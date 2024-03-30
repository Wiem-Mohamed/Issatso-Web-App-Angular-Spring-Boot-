package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.DemandeEnseignant;
import com.mycompany.myapp.domain.enumeration.Status;
import com.mycompany.myapp.domain.enumeration.SujetEns;
import com.mycompany.myapp.repository.DemandeEnseignantRepository;
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
 * Integration tests for the {@link DemandeEnseignantResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DemandeEnseignantResourceIT {

    private static final SujetEns DEFAULT_SUJET = SujetEns.Conge;
    private static final SujetEns UPDATED_SUJET = SujetEns.Rattrapage;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Status DEFAULT_STATUT = Status.EnAttente;
    private static final Status UPDATED_STATUT = Status.Terminee;

    private static final Instant DEFAULT_DATE_CREATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_CREATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/demande-enseignants";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DemandeEnseignantRepository demandeEnseignantRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDemandeEnseignantMockMvc;

    private DemandeEnseignant demandeEnseignant;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DemandeEnseignant createEntity(EntityManager em) {
        DemandeEnseignant demandeEnseignant = new DemandeEnseignant()
            .sujet(DEFAULT_SUJET)
            .description(DEFAULT_DESCRIPTION)
            .statut(DEFAULT_STATUT)
            .dateCreation(DEFAULT_DATE_CREATION);
        return demandeEnseignant;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DemandeEnseignant createUpdatedEntity(EntityManager em) {
        DemandeEnseignant demandeEnseignant = new DemandeEnseignant()
            .sujet(UPDATED_SUJET)
            .description(UPDATED_DESCRIPTION)
            .statut(UPDATED_STATUT)
            .dateCreation(UPDATED_DATE_CREATION);
        return demandeEnseignant;
    }

    @BeforeEach
    public void initTest() {
        demandeEnseignant = createEntity(em);
    }

    @Test
    @Transactional
    void createDemandeEnseignant() throws Exception {
        int databaseSizeBeforeCreate = demandeEnseignantRepository.findAll().size();
        // Create the DemandeEnseignant
        restDemandeEnseignantMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(demandeEnseignant))
            )
            .andExpect(status().isCreated());

        // Validate the DemandeEnseignant in the database
        List<DemandeEnseignant> demandeEnseignantList = demandeEnseignantRepository.findAll();
        assertThat(demandeEnseignantList).hasSize(databaseSizeBeforeCreate + 1);
        DemandeEnseignant testDemandeEnseignant = demandeEnseignantList.get(demandeEnseignantList.size() - 1);
        assertThat(testDemandeEnseignant.getSujet()).isEqualTo(DEFAULT_SUJET);
        assertThat(testDemandeEnseignant.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testDemandeEnseignant.getStatut()).isEqualTo(DEFAULT_STATUT);
        assertThat(testDemandeEnseignant.getDateCreation()).isEqualTo(DEFAULT_DATE_CREATION);
    }

    @Test
    @Transactional
    void createDemandeEnseignantWithExistingId() throws Exception {
        // Create the DemandeEnseignant with an existing ID
        demandeEnseignant.setId(1L);

        int databaseSizeBeforeCreate = demandeEnseignantRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDemandeEnseignantMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(demandeEnseignant))
            )
            .andExpect(status().isBadRequest());

        // Validate the DemandeEnseignant in the database
        List<DemandeEnseignant> demandeEnseignantList = demandeEnseignantRepository.findAll();
        assertThat(demandeEnseignantList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDemandeEnseignants() throws Exception {
        // Initialize the database
        demandeEnseignantRepository.saveAndFlush(demandeEnseignant);

        // Get all the demandeEnseignantList
        restDemandeEnseignantMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(demandeEnseignant.getId().intValue())))
            .andExpect(jsonPath("$.[*].sujet").value(hasItem(DEFAULT_SUJET.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].statut").value(hasItem(DEFAULT_STATUT.toString())))
            .andExpect(jsonPath("$.[*].dateCreation").value(hasItem(DEFAULT_DATE_CREATION.toString())));
    }

    @Test
    @Transactional
    void getDemandeEnseignant() throws Exception {
        // Initialize the database
        demandeEnseignantRepository.saveAndFlush(demandeEnseignant);

        // Get the demandeEnseignant
        restDemandeEnseignantMockMvc
            .perform(get(ENTITY_API_URL_ID, demandeEnseignant.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(demandeEnseignant.getId().intValue()))
            .andExpect(jsonPath("$.sujet").value(DEFAULT_SUJET.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.statut").value(DEFAULT_STATUT.toString()))
            .andExpect(jsonPath("$.dateCreation").value(DEFAULT_DATE_CREATION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingDemandeEnseignant() throws Exception {
        // Get the demandeEnseignant
        restDemandeEnseignantMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDemandeEnseignant() throws Exception {
        // Initialize the database
        demandeEnseignantRepository.saveAndFlush(demandeEnseignant);

        int databaseSizeBeforeUpdate = demandeEnseignantRepository.findAll().size();

        // Update the demandeEnseignant
        DemandeEnseignant updatedDemandeEnseignant = demandeEnseignantRepository.findById(demandeEnseignant.getId()).get();
        // Disconnect from session so that the updates on updatedDemandeEnseignant are not directly saved in db
        em.detach(updatedDemandeEnseignant);
        updatedDemandeEnseignant
            .sujet(UPDATED_SUJET)
            .description(UPDATED_DESCRIPTION)
            .statut(UPDATED_STATUT)
            .dateCreation(UPDATED_DATE_CREATION);

        restDemandeEnseignantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDemandeEnseignant.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDemandeEnseignant))
            )
            .andExpect(status().isOk());

        // Validate the DemandeEnseignant in the database
        List<DemandeEnseignant> demandeEnseignantList = demandeEnseignantRepository.findAll();
        assertThat(demandeEnseignantList).hasSize(databaseSizeBeforeUpdate);
        DemandeEnseignant testDemandeEnseignant = demandeEnseignantList.get(demandeEnseignantList.size() - 1);
        assertThat(testDemandeEnseignant.getSujet()).isEqualTo(UPDATED_SUJET);
        assertThat(testDemandeEnseignant.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDemandeEnseignant.getStatut()).isEqualTo(UPDATED_STATUT);
        assertThat(testDemandeEnseignant.getDateCreation()).isEqualTo(UPDATED_DATE_CREATION);
    }

    @Test
    @Transactional
    void putNonExistingDemandeEnseignant() throws Exception {
        int databaseSizeBeforeUpdate = demandeEnseignantRepository.findAll().size();
        demandeEnseignant.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDemandeEnseignantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, demandeEnseignant.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(demandeEnseignant))
            )
            .andExpect(status().isBadRequest());

        // Validate the DemandeEnseignant in the database
        List<DemandeEnseignant> demandeEnseignantList = demandeEnseignantRepository.findAll();
        assertThat(demandeEnseignantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDemandeEnseignant() throws Exception {
        int databaseSizeBeforeUpdate = demandeEnseignantRepository.findAll().size();
        demandeEnseignant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDemandeEnseignantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(demandeEnseignant))
            )
            .andExpect(status().isBadRequest());

        // Validate the DemandeEnseignant in the database
        List<DemandeEnseignant> demandeEnseignantList = demandeEnseignantRepository.findAll();
        assertThat(demandeEnseignantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDemandeEnseignant() throws Exception {
        int databaseSizeBeforeUpdate = demandeEnseignantRepository.findAll().size();
        demandeEnseignant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDemandeEnseignantMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(demandeEnseignant))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DemandeEnseignant in the database
        List<DemandeEnseignant> demandeEnseignantList = demandeEnseignantRepository.findAll();
        assertThat(demandeEnseignantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDemandeEnseignantWithPatch() throws Exception {
        // Initialize the database
        demandeEnseignantRepository.saveAndFlush(demandeEnseignant);

        int databaseSizeBeforeUpdate = demandeEnseignantRepository.findAll().size();

        // Update the demandeEnseignant using partial update
        DemandeEnseignant partialUpdatedDemandeEnseignant = new DemandeEnseignant();
        partialUpdatedDemandeEnseignant.setId(demandeEnseignant.getId());

        partialUpdatedDemandeEnseignant.sujet(UPDATED_SUJET).description(UPDATED_DESCRIPTION).dateCreation(UPDATED_DATE_CREATION);

        restDemandeEnseignantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDemandeEnseignant.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDemandeEnseignant))
            )
            .andExpect(status().isOk());

        // Validate the DemandeEnseignant in the database
        List<DemandeEnseignant> demandeEnseignantList = demandeEnseignantRepository.findAll();
        assertThat(demandeEnseignantList).hasSize(databaseSizeBeforeUpdate);
        DemandeEnseignant testDemandeEnseignant = demandeEnseignantList.get(demandeEnseignantList.size() - 1);
        assertThat(testDemandeEnseignant.getSujet()).isEqualTo(UPDATED_SUJET);
        assertThat(testDemandeEnseignant.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDemandeEnseignant.getStatut()).isEqualTo(DEFAULT_STATUT);
        assertThat(testDemandeEnseignant.getDateCreation()).isEqualTo(UPDATED_DATE_CREATION);
    }

    @Test
    @Transactional
    void fullUpdateDemandeEnseignantWithPatch() throws Exception {
        // Initialize the database
        demandeEnseignantRepository.saveAndFlush(demandeEnseignant);

        int databaseSizeBeforeUpdate = demandeEnseignantRepository.findAll().size();

        // Update the demandeEnseignant using partial update
        DemandeEnseignant partialUpdatedDemandeEnseignant = new DemandeEnseignant();
        partialUpdatedDemandeEnseignant.setId(demandeEnseignant.getId());

        partialUpdatedDemandeEnseignant
            .sujet(UPDATED_SUJET)
            .description(UPDATED_DESCRIPTION)
            .statut(UPDATED_STATUT)
            .dateCreation(UPDATED_DATE_CREATION);

        restDemandeEnseignantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDemandeEnseignant.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDemandeEnseignant))
            )
            .andExpect(status().isOk());

        // Validate the DemandeEnseignant in the database
        List<DemandeEnseignant> demandeEnseignantList = demandeEnseignantRepository.findAll();
        assertThat(demandeEnseignantList).hasSize(databaseSizeBeforeUpdate);
        DemandeEnseignant testDemandeEnseignant = demandeEnseignantList.get(demandeEnseignantList.size() - 1);
        assertThat(testDemandeEnseignant.getSujet()).isEqualTo(UPDATED_SUJET);
        assertThat(testDemandeEnseignant.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDemandeEnseignant.getStatut()).isEqualTo(UPDATED_STATUT);
        assertThat(testDemandeEnseignant.getDateCreation()).isEqualTo(UPDATED_DATE_CREATION);
    }

    @Test
    @Transactional
    void patchNonExistingDemandeEnseignant() throws Exception {
        int databaseSizeBeforeUpdate = demandeEnseignantRepository.findAll().size();
        demandeEnseignant.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDemandeEnseignantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, demandeEnseignant.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(demandeEnseignant))
            )
            .andExpect(status().isBadRequest());

        // Validate the DemandeEnseignant in the database
        List<DemandeEnseignant> demandeEnseignantList = demandeEnseignantRepository.findAll();
        assertThat(demandeEnseignantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDemandeEnseignant() throws Exception {
        int databaseSizeBeforeUpdate = demandeEnseignantRepository.findAll().size();
        demandeEnseignant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDemandeEnseignantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(demandeEnseignant))
            )
            .andExpect(status().isBadRequest());

        // Validate the DemandeEnseignant in the database
        List<DemandeEnseignant> demandeEnseignantList = demandeEnseignantRepository.findAll();
        assertThat(demandeEnseignantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDemandeEnseignant() throws Exception {
        int databaseSizeBeforeUpdate = demandeEnseignantRepository.findAll().size();
        demandeEnseignant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDemandeEnseignantMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(demandeEnseignant))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DemandeEnseignant in the database
        List<DemandeEnseignant> demandeEnseignantList = demandeEnseignantRepository.findAll();
        assertThat(demandeEnseignantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDemandeEnseignant() throws Exception {
        // Initialize the database
        demandeEnseignantRepository.saveAndFlush(demandeEnseignant);

        int databaseSizeBeforeDelete = demandeEnseignantRepository.findAll().size();

        // Delete the demandeEnseignant
        restDemandeEnseignantMockMvc
            .perform(delete(ENTITY_API_URL_ID, demandeEnseignant.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DemandeEnseignant> demandeEnseignantList = demandeEnseignantRepository.findAll();
        assertThat(demandeEnseignantList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
