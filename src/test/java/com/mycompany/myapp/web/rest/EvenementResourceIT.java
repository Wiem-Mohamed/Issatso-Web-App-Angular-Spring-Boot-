package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Evenement;
import com.mycompany.myapp.repository.EvenementRepository;
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
 * Integration tests for the {@link EvenementResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EvenementResourceIT {

    private static final String DEFAULT_TITRE = "AAAAAAAAAA";
    private static final String UPDATED_TITRE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_DEBUT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_DEBUT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATE_FIN = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_FIN = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_LIEU = "AAAAAAAAAA";
    private static final String UPDATED_LIEU = "BBBBBBBBBB";

    private static final String DEFAULT_ORGANISATEUR = "AAAAAAAAAA";
    private static final String UPDATED_ORGANISATEUR = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/evenements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EvenementRepository evenementRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEvenementMockMvc;

    private Evenement evenement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Evenement createEntity(EntityManager em) {
        Evenement evenement = new Evenement()
            .titre(DEFAULT_TITRE)
            .description(DEFAULT_DESCRIPTION)
            .dateDebut(DEFAULT_DATE_DEBUT)
            .dateFin(DEFAULT_DATE_FIN)
            .lieu(DEFAULT_LIEU)
            .organisateur(DEFAULT_ORGANISATEUR);
        return evenement;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Evenement createUpdatedEntity(EntityManager em) {
        Evenement evenement = new Evenement()
            .titre(UPDATED_TITRE)
            .description(UPDATED_DESCRIPTION)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .lieu(UPDATED_LIEU)
            .organisateur(UPDATED_ORGANISATEUR);
        return evenement;
    }

    @BeforeEach
    public void initTest() {
        evenement = createEntity(em);
    }

    @Test
    @Transactional
    void createEvenement() throws Exception {
        int databaseSizeBeforeCreate = evenementRepository.findAll().size();
        // Create the Evenement
        restEvenementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(evenement)))
            .andExpect(status().isCreated());

        // Validate the Evenement in the database
        List<Evenement> evenementList = evenementRepository.findAll();
        assertThat(evenementList).hasSize(databaseSizeBeforeCreate + 1);
        Evenement testEvenement = evenementList.get(evenementList.size() - 1);
        assertThat(testEvenement.getTitre()).isEqualTo(DEFAULT_TITRE);
        assertThat(testEvenement.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testEvenement.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testEvenement.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
        assertThat(testEvenement.getLieu()).isEqualTo(DEFAULT_LIEU);
        assertThat(testEvenement.getOrganisateur()).isEqualTo(DEFAULT_ORGANISATEUR);
    }

    @Test
    @Transactional
    void createEvenementWithExistingId() throws Exception {
        // Create the Evenement with an existing ID
        evenement.setId(1L);

        int databaseSizeBeforeCreate = evenementRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEvenementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(evenement)))
            .andExpect(status().isBadRequest());

        // Validate the Evenement in the database
        List<Evenement> evenementList = evenementRepository.findAll();
        assertThat(evenementList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEvenements() throws Exception {
        // Initialize the database
        evenementRepository.saveAndFlush(evenement);

        // Get all the evenementList
        restEvenementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(evenement.getId().intValue())))
            .andExpect(jsonPath("$.[*].titre").value(hasItem(DEFAULT_TITRE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(DEFAULT_DATE_DEBUT.toString())))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(DEFAULT_DATE_FIN.toString())))
            .andExpect(jsonPath("$.[*].lieu").value(hasItem(DEFAULT_LIEU)))
            .andExpect(jsonPath("$.[*].organisateur").value(hasItem(DEFAULT_ORGANISATEUR)));
    }

    @Test
    @Transactional
    void getEvenement() throws Exception {
        // Initialize the database
        evenementRepository.saveAndFlush(evenement);

        // Get the evenement
        restEvenementMockMvc
            .perform(get(ENTITY_API_URL_ID, evenement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(evenement.getId().intValue()))
            .andExpect(jsonPath("$.titre").value(DEFAULT_TITRE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.dateDebut").value(DEFAULT_DATE_DEBUT.toString()))
            .andExpect(jsonPath("$.dateFin").value(DEFAULT_DATE_FIN.toString()))
            .andExpect(jsonPath("$.lieu").value(DEFAULT_LIEU))
            .andExpect(jsonPath("$.organisateur").value(DEFAULT_ORGANISATEUR));
    }

    @Test
    @Transactional
    void getNonExistingEvenement() throws Exception {
        // Get the evenement
        restEvenementMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEvenement() throws Exception {
        // Initialize the database
        evenementRepository.saveAndFlush(evenement);

        int databaseSizeBeforeUpdate = evenementRepository.findAll().size();

        // Update the evenement
        Evenement updatedEvenement = evenementRepository.findById(evenement.getId()).get();
        // Disconnect from session so that the updates on updatedEvenement are not directly saved in db
        em.detach(updatedEvenement);
        updatedEvenement
            .titre(UPDATED_TITRE)
            .description(UPDATED_DESCRIPTION)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .lieu(UPDATED_LIEU)
            .organisateur(UPDATED_ORGANISATEUR);

        restEvenementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEvenement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEvenement))
            )
            .andExpect(status().isOk());

        // Validate the Evenement in the database
        List<Evenement> evenementList = evenementRepository.findAll();
        assertThat(evenementList).hasSize(databaseSizeBeforeUpdate);
        Evenement testEvenement = evenementList.get(evenementList.size() - 1);
        assertThat(testEvenement.getTitre()).isEqualTo(UPDATED_TITRE);
        assertThat(testEvenement.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testEvenement.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testEvenement.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
        assertThat(testEvenement.getLieu()).isEqualTo(UPDATED_LIEU);
        assertThat(testEvenement.getOrganisateur()).isEqualTo(UPDATED_ORGANISATEUR);
    }

    @Test
    @Transactional
    void putNonExistingEvenement() throws Exception {
        int databaseSizeBeforeUpdate = evenementRepository.findAll().size();
        evenement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEvenementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, evenement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(evenement))
            )
            .andExpect(status().isBadRequest());

        // Validate the Evenement in the database
        List<Evenement> evenementList = evenementRepository.findAll();
        assertThat(evenementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEvenement() throws Exception {
        int databaseSizeBeforeUpdate = evenementRepository.findAll().size();
        evenement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEvenementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(evenement))
            )
            .andExpect(status().isBadRequest());

        // Validate the Evenement in the database
        List<Evenement> evenementList = evenementRepository.findAll();
        assertThat(evenementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEvenement() throws Exception {
        int databaseSizeBeforeUpdate = evenementRepository.findAll().size();
        evenement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEvenementMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(evenement)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Evenement in the database
        List<Evenement> evenementList = evenementRepository.findAll();
        assertThat(evenementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEvenementWithPatch() throws Exception {
        // Initialize the database
        evenementRepository.saveAndFlush(evenement);

        int databaseSizeBeforeUpdate = evenementRepository.findAll().size();

        // Update the evenement using partial update
        Evenement partialUpdatedEvenement = new Evenement();
        partialUpdatedEvenement.setId(evenement.getId());

        partialUpdatedEvenement.titre(UPDATED_TITRE).description(UPDATED_DESCRIPTION).lieu(UPDATED_LIEU).organisateur(UPDATED_ORGANISATEUR);

        restEvenementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEvenement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEvenement))
            )
            .andExpect(status().isOk());

        // Validate the Evenement in the database
        List<Evenement> evenementList = evenementRepository.findAll();
        assertThat(evenementList).hasSize(databaseSizeBeforeUpdate);
        Evenement testEvenement = evenementList.get(evenementList.size() - 1);
        assertThat(testEvenement.getTitre()).isEqualTo(UPDATED_TITRE);
        assertThat(testEvenement.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testEvenement.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testEvenement.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
        assertThat(testEvenement.getLieu()).isEqualTo(UPDATED_LIEU);
        assertThat(testEvenement.getOrganisateur()).isEqualTo(UPDATED_ORGANISATEUR);
    }

    @Test
    @Transactional
    void fullUpdateEvenementWithPatch() throws Exception {
        // Initialize the database
        evenementRepository.saveAndFlush(evenement);

        int databaseSizeBeforeUpdate = evenementRepository.findAll().size();

        // Update the evenement using partial update
        Evenement partialUpdatedEvenement = new Evenement();
        partialUpdatedEvenement.setId(evenement.getId());

        partialUpdatedEvenement
            .titre(UPDATED_TITRE)
            .description(UPDATED_DESCRIPTION)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN)
            .lieu(UPDATED_LIEU)
            .organisateur(UPDATED_ORGANISATEUR);

        restEvenementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEvenement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEvenement))
            )
            .andExpect(status().isOk());

        // Validate the Evenement in the database
        List<Evenement> evenementList = evenementRepository.findAll();
        assertThat(evenementList).hasSize(databaseSizeBeforeUpdate);
        Evenement testEvenement = evenementList.get(evenementList.size() - 1);
        assertThat(testEvenement.getTitre()).isEqualTo(UPDATED_TITRE);
        assertThat(testEvenement.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testEvenement.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testEvenement.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
        assertThat(testEvenement.getLieu()).isEqualTo(UPDATED_LIEU);
        assertThat(testEvenement.getOrganisateur()).isEqualTo(UPDATED_ORGANISATEUR);
    }

    @Test
    @Transactional
    void patchNonExistingEvenement() throws Exception {
        int databaseSizeBeforeUpdate = evenementRepository.findAll().size();
        evenement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEvenementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, evenement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(evenement))
            )
            .andExpect(status().isBadRequest());

        // Validate the Evenement in the database
        List<Evenement> evenementList = evenementRepository.findAll();
        assertThat(evenementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEvenement() throws Exception {
        int databaseSizeBeforeUpdate = evenementRepository.findAll().size();
        evenement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEvenementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(evenement))
            )
            .andExpect(status().isBadRequest());

        // Validate the Evenement in the database
        List<Evenement> evenementList = evenementRepository.findAll();
        assertThat(evenementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEvenement() throws Exception {
        int databaseSizeBeforeUpdate = evenementRepository.findAll().size();
        evenement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEvenementMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(evenement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Evenement in the database
        List<Evenement> evenementList = evenementRepository.findAll();
        assertThat(evenementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEvenement() throws Exception {
        // Initialize the database
        evenementRepository.saveAndFlush(evenement);

        int databaseSizeBeforeDelete = evenementRepository.findAll().size();

        // Delete the evenement
        restEvenementMockMvc
            .perform(delete(ENTITY_API_URL_ID, evenement.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Evenement> evenementList = evenementRepository.findAll();
        assertThat(evenementList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
