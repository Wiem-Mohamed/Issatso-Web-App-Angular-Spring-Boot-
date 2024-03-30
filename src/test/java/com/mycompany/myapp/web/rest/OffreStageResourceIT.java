package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.OffreStage;
import com.mycompany.myapp.domain.enumeration.Domaine;
import com.mycompany.myapp.repository.OffreStageRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link OffreStageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OffreStageResourceIT {

    private static final String DEFAULT_TITRE = "AAAAAAAAAA";
    private static final String UPDATED_TITRE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Domaine DEFAULT_DOMAINE = Domaine.INFORMATIQUE;
    private static final Domaine UPDATED_DOMAINE = Domaine.MECANIQUE;

    private static final Instant DEFAULT_DATE_DEBUT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_DEBUT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATE_FIN = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_FIN = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_ENTREPRISE = "AAAAAAAAAA";
    private static final String UPDATED_ENTREPRISE = "BBBBBBBBBB";

    private static final String DEFAULT_LIEU = "AAAAAAAAAA";
    private static final String UPDATED_LIEU = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/offre-stages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OffreStageRepository offreStageRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOffreStageMockMvc;

    private OffreStage offreStage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OffreStage createEntity(EntityManager em) {
        OffreStage offreStage = new OffreStage()
            .titre(DEFAULT_TITRE)
            .description(DEFAULT_DESCRIPTION)
            .domaine(DEFAULT_DOMAINE)
            .dateDebut(DEFAULT_DATE_DEBUT)
            .dateFin(DEFAULT_DATE_FIN)
            .entreprise(DEFAULT_ENTREPRISE)
            .lieu(DEFAULT_LIEU);
        return offreStage;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OffreStage createUpdatedEntity(EntityManager em) {
        OffreStage offreStage = new OffreStage()
            .titre(UPDATED_TITRE)
            .description(UPDATED_DESCRIPTION)
            .domaine(UPDATED_DOMAINE)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .entreprise(UPDATED_ENTREPRISE)
            .lieu(UPDATED_LIEU);
        return offreStage;
    }

    @BeforeEach
    public void initTest() {
        offreStage = createEntity(em);
    }

    @Test
    @Transactional
    void createOffreStage() throws Exception {
        int databaseSizeBeforeCreate = offreStageRepository.findAll().size();
        // Create the OffreStage
        restOffreStageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offreStage)))
            .andExpect(status().isCreated());

        // Validate the OffreStage in the database
        List<OffreStage> offreStageList = offreStageRepository.findAll();
        assertThat(offreStageList).hasSize(databaseSizeBeforeCreate + 1);
        OffreStage testOffreStage = offreStageList.get(offreStageList.size() - 1);
        assertThat(testOffreStage.getTitre()).isEqualTo(DEFAULT_TITRE);
        assertThat(testOffreStage.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testOffreStage.getDomaine()).isEqualTo(DEFAULT_DOMAINE);
        assertThat(testOffreStage.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testOffreStage.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
        assertThat(testOffreStage.getEntreprise()).isEqualTo(DEFAULT_ENTREPRISE);
        assertThat(testOffreStage.getLieu()).isEqualTo(DEFAULT_LIEU);
    }

    @Test
    @Transactional
    void createOffreStageWithExistingId() throws Exception {
        // Create the OffreStage with an existing ID
        offreStage.setId(1L);

        int databaseSizeBeforeCreate = offreStageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOffreStageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offreStage)))
            .andExpect(status().isBadRequest());

        // Validate the OffreStage in the database
        List<OffreStage> offreStageList = offreStageRepository.findAll();
        assertThat(offreStageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOffreStages() throws Exception {
        // Initialize the database
        offreStageRepository.saveAndFlush(offreStage);

        // Get all the offreStageList
        restOffreStageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(offreStage.getId().intValue())))
            .andExpect(jsonPath("$.[*].titre").value(hasItem(DEFAULT_TITRE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].domaine").value(hasItem(DEFAULT_DOMAINE.toString())))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(DEFAULT_DATE_DEBUT.toString())))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(DEFAULT_DATE_FIN.toString())))
            .andExpect(jsonPath("$.[*].entreprise").value(hasItem(DEFAULT_ENTREPRISE)))
            .andExpect(jsonPath("$.[*].lieu").value(hasItem(DEFAULT_LIEU)));
    }

    @Test
    @Transactional
    void getOffreStage() throws Exception {
        // Initialize the database
        offreStageRepository.saveAndFlush(offreStage);

        // Get the offreStage
        restOffreStageMockMvc
            .perform(get(ENTITY_API_URL_ID, offreStage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(offreStage.getId().intValue()))
            .andExpect(jsonPath("$.titre").value(DEFAULT_TITRE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.domaine").value(DEFAULT_DOMAINE.toString()))
            .andExpect(jsonPath("$.dateDebut").value(DEFAULT_DATE_DEBUT.toString()))
            .andExpect(jsonPath("$.dateFin").value(DEFAULT_DATE_FIN.toString()))
            .andExpect(jsonPath("$.entreprise").value(DEFAULT_ENTREPRISE))
            .andExpect(jsonPath("$.lieu").value(DEFAULT_LIEU));
    }

    @Test
    @Transactional
    void getNonExistingOffreStage() throws Exception {
        // Get the offreStage
        restOffreStageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOffreStage() throws Exception {
        // Initialize the database
        offreStageRepository.saveAndFlush(offreStage);

        int databaseSizeBeforeUpdate = offreStageRepository.findAll().size();

        // Update the offreStage
        OffreStage updatedOffreStage = offreStageRepository.findById(offreStage.getId()).get();
        // Disconnect from session so that the updates on updatedOffreStage are not directly saved in db
        em.detach(updatedOffreStage);
        updatedOffreStage
            .titre(UPDATED_TITRE)
            .description(UPDATED_DESCRIPTION)
            .domaine(UPDATED_DOMAINE)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .entreprise(UPDATED_ENTREPRISE)
            .lieu(UPDATED_LIEU);

        restOffreStageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOffreStage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOffreStage))
            )
            .andExpect(status().isOk());

        // Validate the OffreStage in the database
        List<OffreStage> offreStageList = offreStageRepository.findAll();
        assertThat(offreStageList).hasSize(databaseSizeBeforeUpdate);
        OffreStage testOffreStage = offreStageList.get(offreStageList.size() - 1);
        assertThat(testOffreStage.getTitre()).isEqualTo(UPDATED_TITRE);
        assertThat(testOffreStage.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testOffreStage.getDomaine()).isEqualTo(UPDATED_DOMAINE);
        assertThat(testOffreStage.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testOffreStage.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
        assertThat(testOffreStage.getEntreprise()).isEqualTo(UPDATED_ENTREPRISE);
        assertThat(testOffreStage.getLieu()).isEqualTo(UPDATED_LIEU);
    }

    @Test
    @Transactional
    void putNonExistingOffreStage() throws Exception {
        int databaseSizeBeforeUpdate = offreStageRepository.findAll().size();
        offreStage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOffreStageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, offreStage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(offreStage))
            )
            .andExpect(status().isBadRequest());

        // Validate the OffreStage in the database
        List<OffreStage> offreStageList = offreStageRepository.findAll();
        assertThat(offreStageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOffreStage() throws Exception {
        int databaseSizeBeforeUpdate = offreStageRepository.findAll().size();
        offreStage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffreStageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(offreStage))
            )
            .andExpect(status().isBadRequest());

        // Validate the OffreStage in the database
        List<OffreStage> offreStageList = offreStageRepository.findAll();
        assertThat(offreStageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOffreStage() throws Exception {
        int databaseSizeBeforeUpdate = offreStageRepository.findAll().size();
        offreStage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffreStageMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offreStage)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OffreStage in the database
        List<OffreStage> offreStageList = offreStageRepository.findAll();
        assertThat(offreStageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOffreStageWithPatch() throws Exception {
        // Initialize the database
        offreStageRepository.saveAndFlush(offreStage);

        int databaseSizeBeforeUpdate = offreStageRepository.findAll().size();

        // Update the offreStage using partial update
        OffreStage partialUpdatedOffreStage = new OffreStage();
        partialUpdatedOffreStage.setId(offreStage.getId());

        partialUpdatedOffreStage
            .description(UPDATED_DESCRIPTION)
            .domaine(UPDATED_DOMAINE)
            .dateFin(UPDATED_DATE_FIN)
            .entreprise(UPDATED_ENTREPRISE)
            .lieu(UPDATED_LIEU);

        restOffreStageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOffreStage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOffreStage))
            )
            .andExpect(status().isOk());

        // Validate the OffreStage in the database
        List<OffreStage> offreStageList = offreStageRepository.findAll();
        assertThat(offreStageList).hasSize(databaseSizeBeforeUpdate);
        OffreStage testOffreStage = offreStageList.get(offreStageList.size() - 1);
        assertThat(testOffreStage.getTitre()).isEqualTo(DEFAULT_TITRE);
        assertThat(testOffreStage.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testOffreStage.getDomaine()).isEqualTo(UPDATED_DOMAINE);
        assertThat(testOffreStage.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testOffreStage.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
        assertThat(testOffreStage.getEntreprise()).isEqualTo(UPDATED_ENTREPRISE);
        assertThat(testOffreStage.getLieu()).isEqualTo(UPDATED_LIEU);
    }

    @Test
    @Transactional
    void fullUpdateOffreStageWithPatch() throws Exception {
        // Initialize the database
        offreStageRepository.saveAndFlush(offreStage);

        int databaseSizeBeforeUpdate = offreStageRepository.findAll().size();

        // Update the offreStage using partial update
        OffreStage partialUpdatedOffreStage = new OffreStage();
        partialUpdatedOffreStage.setId(offreStage.getId());

        partialUpdatedOffreStage
            .titre(UPDATED_TITRE)
            .description(UPDATED_DESCRIPTION)
            .domaine(UPDATED_DOMAINE)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .entreprise(UPDATED_ENTREPRISE)
            .lieu(UPDATED_LIEU);

        restOffreStageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOffreStage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOffreStage))
            )
            .andExpect(status().isOk());

        // Validate the OffreStage in the database
        List<OffreStage> offreStageList = offreStageRepository.findAll();
        assertThat(offreStageList).hasSize(databaseSizeBeforeUpdate);
        OffreStage testOffreStage = offreStageList.get(offreStageList.size() - 1);
        assertThat(testOffreStage.getTitre()).isEqualTo(UPDATED_TITRE);
        assertThat(testOffreStage.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testOffreStage.getDomaine()).isEqualTo(UPDATED_DOMAINE);
        assertThat(testOffreStage.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testOffreStage.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
        assertThat(testOffreStage.getEntreprise()).isEqualTo(UPDATED_ENTREPRISE);
        assertThat(testOffreStage.getLieu()).isEqualTo(UPDATED_LIEU);
    }

    @Test
    @Transactional
    void patchNonExistingOffreStage() throws Exception {
        int databaseSizeBeforeUpdate = offreStageRepository.findAll().size();
        offreStage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOffreStageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, offreStage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(offreStage))
            )
            .andExpect(status().isBadRequest());

        // Validate the OffreStage in the database
        List<OffreStage> offreStageList = offreStageRepository.findAll();
        assertThat(offreStageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOffreStage() throws Exception {
        int databaseSizeBeforeUpdate = offreStageRepository.findAll().size();
        offreStage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffreStageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(offreStage))
            )
            .andExpect(status().isBadRequest());

        // Validate the OffreStage in the database
        List<OffreStage> offreStageList = offreStageRepository.findAll();
        assertThat(offreStageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOffreStage() throws Exception {
        int databaseSizeBeforeUpdate = offreStageRepository.findAll().size();
        offreStage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffreStageMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(offreStage))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OffreStage in the database
        List<OffreStage> offreStageList = offreStageRepository.findAll();
        assertThat(offreStageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOffreStage() throws Exception {
        // Initialize the database
        offreStageRepository.saveAndFlush(offreStage);

        int databaseSizeBeforeDelete = offreStageRepository.findAll().size();

        // Delete the offreStage
        restOffreStageMockMvc
            .perform(delete(ENTITY_API_URL_ID, offreStage.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OffreStage> offreStageList = offreStageRepository.findAll();
        assertThat(offreStageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
