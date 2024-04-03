package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.DemandeEtudiant;
import com.mycompany.myapp.domain.enumeration.Status;
import com.mycompany.myapp.domain.enumeration.SujetEtud;
import com.mycompany.myapp.repository.DemandeEtudiantRepository;
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
 * Integration tests for the {@link DemandeEtudiantResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DemandeEtudiantResourceIT {

    private static final SujetEtud DEFAULT_SUJET = SujetEtud.Stage;
    private static final SujetEtud UPDATED_SUJET = SujetEtud.Bourse;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Status DEFAULT_STATUT = Status.EnAttente;
    private static final Status UPDATED_STATUT = Status.Terminee;

    private static final Instant DEFAULT_DATE_CREATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_CREATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_PROPRIETAIRE = "AAAAAAAAAA";
    private static final String UPDATED_PROPRIETAIRE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/demande-etudiants";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DemandeEtudiantRepository demandeEtudiantRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDemandeEtudiantMockMvc;

    private DemandeEtudiant demandeEtudiant;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DemandeEtudiant createEntity(EntityManager em) {
        DemandeEtudiant demandeEtudiant = new DemandeEtudiant()
            .sujet(DEFAULT_SUJET)
            .description(DEFAULT_DESCRIPTION)
            .statut(DEFAULT_STATUT)
            .dateCreation(DEFAULT_DATE_CREATION)
            .proprietaire(DEFAULT_PROPRIETAIRE);
        return demandeEtudiant;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DemandeEtudiant createUpdatedEntity(EntityManager em) {
        DemandeEtudiant demandeEtudiant = new DemandeEtudiant()
            .sujet(UPDATED_SUJET)
            .description(UPDATED_DESCRIPTION)
            .statut(UPDATED_STATUT)
            .dateCreation(UPDATED_DATE_CREATION)
            .proprietaire(UPDATED_PROPRIETAIRE);
        return demandeEtudiant;
    }

    @BeforeEach
    public void initTest() {
        demandeEtudiant = createEntity(em);
    }

    @Test
    @Transactional
    void createDemandeEtudiant() throws Exception {
        int databaseSizeBeforeCreate = demandeEtudiantRepository.findAll().size();
        // Create the DemandeEtudiant
        restDemandeEtudiantMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(demandeEtudiant))
            )
            .andExpect(status().isCreated());

        // Validate the DemandeEtudiant in the database
        List<DemandeEtudiant> demandeEtudiantList = demandeEtudiantRepository.findAll();
        assertThat(demandeEtudiantList).hasSize(databaseSizeBeforeCreate + 1);
        DemandeEtudiant testDemandeEtudiant = demandeEtudiantList.get(demandeEtudiantList.size() - 1);
        assertThat(testDemandeEtudiant.getSujet()).isEqualTo(DEFAULT_SUJET);
        assertThat(testDemandeEtudiant.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testDemandeEtudiant.getStatut()).isEqualTo(DEFAULT_STATUT);
        assertThat(testDemandeEtudiant.getDateCreation()).isEqualTo(DEFAULT_DATE_CREATION);
        assertThat(testDemandeEtudiant.getProprietaire()).isEqualTo(DEFAULT_PROPRIETAIRE);
    }

    @Test
    @Transactional
    void createDemandeEtudiantWithExistingId() throws Exception {
        // Create the DemandeEtudiant with an existing ID
        demandeEtudiant.setId(1L);

        int databaseSizeBeforeCreate = demandeEtudiantRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDemandeEtudiantMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(demandeEtudiant))
            )
            .andExpect(status().isBadRequest());

        // Validate the DemandeEtudiant in the database
        List<DemandeEtudiant> demandeEtudiantList = demandeEtudiantRepository.findAll();
        assertThat(demandeEtudiantList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDemandeEtudiants() throws Exception {
        // Initialize the database
        demandeEtudiantRepository.saveAndFlush(demandeEtudiant);

        // Get all the demandeEtudiantList
        restDemandeEtudiantMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(demandeEtudiant.getId().intValue())))
            .andExpect(jsonPath("$.[*].sujet").value(hasItem(DEFAULT_SUJET.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].statut").value(hasItem(DEFAULT_STATUT.toString())))
            .andExpect(jsonPath("$.[*].dateCreation").value(hasItem(DEFAULT_DATE_CREATION.toString())))
            .andExpect(jsonPath("$.[*].proprietaire").value(hasItem(DEFAULT_PROPRIETAIRE)));
    }

    @Test
    @Transactional
    void getDemandeEtudiant() throws Exception {
        // Initialize the database
        demandeEtudiantRepository.saveAndFlush(demandeEtudiant);

        // Get the demandeEtudiant
        restDemandeEtudiantMockMvc
            .perform(get(ENTITY_API_URL_ID, demandeEtudiant.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(demandeEtudiant.getId().intValue()))
            .andExpect(jsonPath("$.sujet").value(DEFAULT_SUJET.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.statut").value(DEFAULT_STATUT.toString()))
            .andExpect(jsonPath("$.dateCreation").value(DEFAULT_DATE_CREATION.toString()))
            .andExpect(jsonPath("$.proprietaire").value(DEFAULT_PROPRIETAIRE));
    }

    @Test
    @Transactional
    void getNonExistingDemandeEtudiant() throws Exception {
        // Get the demandeEtudiant
        restDemandeEtudiantMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDemandeEtudiant() throws Exception {
        // Initialize the database
        demandeEtudiantRepository.saveAndFlush(demandeEtudiant);

        int databaseSizeBeforeUpdate = demandeEtudiantRepository.findAll().size();

        // Update the demandeEtudiant
        DemandeEtudiant updatedDemandeEtudiant = demandeEtudiantRepository.findById(demandeEtudiant.getId()).get();
        // Disconnect from session so that the updates on updatedDemandeEtudiant are not directly saved in db
        em.detach(updatedDemandeEtudiant);
        updatedDemandeEtudiant
            .sujet(UPDATED_SUJET)
            .description(UPDATED_DESCRIPTION)
            .statut(UPDATED_STATUT)
            .dateCreation(UPDATED_DATE_CREATION)
            .proprietaire(UPDATED_PROPRIETAIRE);

        restDemandeEtudiantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDemandeEtudiant.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDemandeEtudiant))
            )
            .andExpect(status().isOk());

        // Validate the DemandeEtudiant in the database
        List<DemandeEtudiant> demandeEtudiantList = demandeEtudiantRepository.findAll();
        assertThat(demandeEtudiantList).hasSize(databaseSizeBeforeUpdate);
        DemandeEtudiant testDemandeEtudiant = demandeEtudiantList.get(demandeEtudiantList.size() - 1);
        assertThat(testDemandeEtudiant.getSujet()).isEqualTo(UPDATED_SUJET);
        assertThat(testDemandeEtudiant.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDemandeEtudiant.getStatut()).isEqualTo(UPDATED_STATUT);
        assertThat(testDemandeEtudiant.getDateCreation()).isEqualTo(UPDATED_DATE_CREATION);
        assertThat(testDemandeEtudiant.getProprietaire()).isEqualTo(UPDATED_PROPRIETAIRE);
    }

    @Test
    @Transactional
    void putNonExistingDemandeEtudiant() throws Exception {
        int databaseSizeBeforeUpdate = demandeEtudiantRepository.findAll().size();
        demandeEtudiant.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDemandeEtudiantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, demandeEtudiant.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(demandeEtudiant))
            )
            .andExpect(status().isBadRequest());

        // Validate the DemandeEtudiant in the database
        List<DemandeEtudiant> demandeEtudiantList = demandeEtudiantRepository.findAll();
        assertThat(demandeEtudiantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDemandeEtudiant() throws Exception {
        int databaseSizeBeforeUpdate = demandeEtudiantRepository.findAll().size();
        demandeEtudiant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDemandeEtudiantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(demandeEtudiant))
            )
            .andExpect(status().isBadRequest());

        // Validate the DemandeEtudiant in the database
        List<DemandeEtudiant> demandeEtudiantList = demandeEtudiantRepository.findAll();
        assertThat(demandeEtudiantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDemandeEtudiant() throws Exception {
        int databaseSizeBeforeUpdate = demandeEtudiantRepository.findAll().size();
        demandeEtudiant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDemandeEtudiantMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(demandeEtudiant))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DemandeEtudiant in the database
        List<DemandeEtudiant> demandeEtudiantList = demandeEtudiantRepository.findAll();
        assertThat(demandeEtudiantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDemandeEtudiantWithPatch() throws Exception {
        // Initialize the database
        demandeEtudiantRepository.saveAndFlush(demandeEtudiant);

        int databaseSizeBeforeUpdate = demandeEtudiantRepository.findAll().size();

        // Update the demandeEtudiant using partial update
        DemandeEtudiant partialUpdatedDemandeEtudiant = new DemandeEtudiant();
        partialUpdatedDemandeEtudiant.setId(demandeEtudiant.getId());

        partialUpdatedDemandeEtudiant.sujet(UPDATED_SUJET).statut(UPDATED_STATUT).dateCreation(UPDATED_DATE_CREATION);

        restDemandeEtudiantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDemandeEtudiant.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDemandeEtudiant))
            )
            .andExpect(status().isOk());

        // Validate the DemandeEtudiant in the database
        List<DemandeEtudiant> demandeEtudiantList = demandeEtudiantRepository.findAll();
        assertThat(demandeEtudiantList).hasSize(databaseSizeBeforeUpdate);
        DemandeEtudiant testDemandeEtudiant = demandeEtudiantList.get(demandeEtudiantList.size() - 1);
        assertThat(testDemandeEtudiant.getSujet()).isEqualTo(UPDATED_SUJET);
        assertThat(testDemandeEtudiant.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testDemandeEtudiant.getStatut()).isEqualTo(UPDATED_STATUT);
        assertThat(testDemandeEtudiant.getDateCreation()).isEqualTo(UPDATED_DATE_CREATION);
        assertThat(testDemandeEtudiant.getProprietaire()).isEqualTo(DEFAULT_PROPRIETAIRE);
    }

    @Test
    @Transactional
    void fullUpdateDemandeEtudiantWithPatch() throws Exception {
        // Initialize the database
        demandeEtudiantRepository.saveAndFlush(demandeEtudiant);

        int databaseSizeBeforeUpdate = demandeEtudiantRepository.findAll().size();

        // Update the demandeEtudiant using partial update
        DemandeEtudiant partialUpdatedDemandeEtudiant = new DemandeEtudiant();
        partialUpdatedDemandeEtudiant.setId(demandeEtudiant.getId());

        partialUpdatedDemandeEtudiant
            .sujet(UPDATED_SUJET)
            .description(UPDATED_DESCRIPTION)
            .statut(UPDATED_STATUT)
            .dateCreation(UPDATED_DATE_CREATION)
            .proprietaire(UPDATED_PROPRIETAIRE);

        restDemandeEtudiantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDemandeEtudiant.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDemandeEtudiant))
            )
            .andExpect(status().isOk());

        // Validate the DemandeEtudiant in the database
        List<DemandeEtudiant> demandeEtudiantList = demandeEtudiantRepository.findAll();
        assertThat(demandeEtudiantList).hasSize(databaseSizeBeforeUpdate);
        DemandeEtudiant testDemandeEtudiant = demandeEtudiantList.get(demandeEtudiantList.size() - 1);
        assertThat(testDemandeEtudiant.getSujet()).isEqualTo(UPDATED_SUJET);
        assertThat(testDemandeEtudiant.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDemandeEtudiant.getStatut()).isEqualTo(UPDATED_STATUT);
        assertThat(testDemandeEtudiant.getDateCreation()).isEqualTo(UPDATED_DATE_CREATION);
        assertThat(testDemandeEtudiant.getProprietaire()).isEqualTo(UPDATED_PROPRIETAIRE);
    }

    @Test
    @Transactional
    void patchNonExistingDemandeEtudiant() throws Exception {
        int databaseSizeBeforeUpdate = demandeEtudiantRepository.findAll().size();
        demandeEtudiant.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDemandeEtudiantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, demandeEtudiant.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(demandeEtudiant))
            )
            .andExpect(status().isBadRequest());

        // Validate the DemandeEtudiant in the database
        List<DemandeEtudiant> demandeEtudiantList = demandeEtudiantRepository.findAll();
        assertThat(demandeEtudiantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDemandeEtudiant() throws Exception {
        int databaseSizeBeforeUpdate = demandeEtudiantRepository.findAll().size();
        demandeEtudiant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDemandeEtudiantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(demandeEtudiant))
            )
            .andExpect(status().isBadRequest());

        // Validate the DemandeEtudiant in the database
        List<DemandeEtudiant> demandeEtudiantList = demandeEtudiantRepository.findAll();
        assertThat(demandeEtudiantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDemandeEtudiant() throws Exception {
        int databaseSizeBeforeUpdate = demandeEtudiantRepository.findAll().size();
        demandeEtudiant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDemandeEtudiantMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(demandeEtudiant))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DemandeEtudiant in the database
        List<DemandeEtudiant> demandeEtudiantList = demandeEtudiantRepository.findAll();
        assertThat(demandeEtudiantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDemandeEtudiant() throws Exception {
        // Initialize the database
        demandeEtudiantRepository.saveAndFlush(demandeEtudiant);

        int databaseSizeBeforeDelete = demandeEtudiantRepository.findAll().size();

        // Delete the demandeEtudiant
        restDemandeEtudiantMockMvc
            .perform(delete(ENTITY_API_URL_ID, demandeEtudiant.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DemandeEtudiant> demandeEtudiantList = demandeEtudiantRepository.findAll();
        assertThat(demandeEtudiantList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
