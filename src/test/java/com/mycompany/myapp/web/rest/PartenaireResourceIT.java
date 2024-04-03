package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Partenaire;
import com.mycompany.myapp.repository.PartenaireRepository;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link PartenaireResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PartenaireResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_DOMAINE_ACTIVITE = "AAAAAAAAAA";
    private static final String UPDATED_DOMAINE_ACTIVITE = "BBBBBBBBBB";

    private static final String DEFAULT_ADRESSE = "AAAAAAAAAA";
    private static final String UPDATED_ADRESSE = "BBBBBBBBBB";

    private static final String DEFAULT_CONTACT = "AAAAAAAAAA";
    private static final String UPDATED_CONTACT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/partenaires";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PartenaireRepository partenaireRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPartenaireMockMvc;

    private Partenaire partenaire;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Partenaire createEntity(EntityManager em) {
        Partenaire partenaire = new Partenaire()
            .nom(DEFAULT_NOM)
            .description(DEFAULT_DESCRIPTION)
            .domaineActivite(DEFAULT_DOMAINE_ACTIVITE)
            .adresse(DEFAULT_ADRESSE)
            .contact(DEFAULT_CONTACT);
        return partenaire;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Partenaire createUpdatedEntity(EntityManager em) {
        Partenaire partenaire = new Partenaire()
            .nom(UPDATED_NOM)
            .description(UPDATED_DESCRIPTION)
            .domaineActivite(UPDATED_DOMAINE_ACTIVITE)
            .adresse(UPDATED_ADRESSE)
            .contact(UPDATED_CONTACT);
        return partenaire;
    }

    @BeforeEach
    public void initTest() {
        partenaire = createEntity(em);
    }

    @Test
    @Transactional
    void createPartenaire() throws Exception {
        int databaseSizeBeforeCreate = partenaireRepository.findAll().size();
        // Create the Partenaire
        restPartenaireMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(partenaire)))
            .andExpect(status().isCreated());

        // Validate the Partenaire in the database
        List<Partenaire> partenaireList = partenaireRepository.findAll();
        assertThat(partenaireList).hasSize(databaseSizeBeforeCreate + 1);
        Partenaire testPartenaire = partenaireList.get(partenaireList.size() - 1);
        assertThat(testPartenaire.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testPartenaire.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testPartenaire.getDomaineActivite()).isEqualTo(DEFAULT_DOMAINE_ACTIVITE);
        assertThat(testPartenaire.getAdresse()).isEqualTo(DEFAULT_ADRESSE);
        assertThat(testPartenaire.getContact()).isEqualTo(DEFAULT_CONTACT);
    }

    @Test
    @Transactional
    void createPartenaireWithExistingId() throws Exception {
        // Create the Partenaire with an existing ID
        partenaire.setId(1L);

        int databaseSizeBeforeCreate = partenaireRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPartenaireMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(partenaire)))
            .andExpect(status().isBadRequest());

        // Validate the Partenaire in the database
        List<Partenaire> partenaireList = partenaireRepository.findAll();
        assertThat(partenaireList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPartenaires() throws Exception {
        // Initialize the database
        partenaireRepository.saveAndFlush(partenaire);

        // Get all the partenaireList
        restPartenaireMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(partenaire.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].domaineActivite").value(hasItem(DEFAULT_DOMAINE_ACTIVITE)))
            .andExpect(jsonPath("$.[*].adresse").value(hasItem(DEFAULT_ADRESSE)))
            .andExpect(jsonPath("$.[*].contact").value(hasItem(DEFAULT_CONTACT)));
    }

    @Test
    @Transactional
    void getPartenaire() throws Exception {
        // Initialize the database
        partenaireRepository.saveAndFlush(partenaire);

        // Get the partenaire
        restPartenaireMockMvc
            .perform(get(ENTITY_API_URL_ID, partenaire.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(partenaire.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.domaineActivite").value(DEFAULT_DOMAINE_ACTIVITE))
            .andExpect(jsonPath("$.adresse").value(DEFAULT_ADRESSE))
            .andExpect(jsonPath("$.contact").value(DEFAULT_CONTACT));
    }

    @Test
    @Transactional
    void getNonExistingPartenaire() throws Exception {
        // Get the partenaire
        restPartenaireMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPartenaire() throws Exception {
        // Initialize the database
        partenaireRepository.saveAndFlush(partenaire);

        int databaseSizeBeforeUpdate = partenaireRepository.findAll().size();

        // Update the partenaire
        Partenaire updatedPartenaire = partenaireRepository.findById(partenaire.getId()).get();
        // Disconnect from session so that the updates on updatedPartenaire are not directly saved in db
        em.detach(updatedPartenaire);
        updatedPartenaire
            .nom(UPDATED_NOM)
            .description(UPDATED_DESCRIPTION)
            .domaineActivite(UPDATED_DOMAINE_ACTIVITE)
            .adresse(UPDATED_ADRESSE)
            .contact(UPDATED_CONTACT);

        restPartenaireMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPartenaire.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPartenaire))
            )
            .andExpect(status().isOk());

        // Validate the Partenaire in the database
        List<Partenaire> partenaireList = partenaireRepository.findAll();
        assertThat(partenaireList).hasSize(databaseSizeBeforeUpdate);
        Partenaire testPartenaire = partenaireList.get(partenaireList.size() - 1);
        assertThat(testPartenaire.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testPartenaire.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testPartenaire.getDomaineActivite()).isEqualTo(UPDATED_DOMAINE_ACTIVITE);
        assertThat(testPartenaire.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testPartenaire.getContact()).isEqualTo(UPDATED_CONTACT);
    }

    @Test
    @Transactional
    void putNonExistingPartenaire() throws Exception {
        int databaseSizeBeforeUpdate = partenaireRepository.findAll().size();
        partenaire.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPartenaireMockMvc
            .perform(
                put(ENTITY_API_URL_ID, partenaire.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(partenaire))
            )
            .andExpect(status().isBadRequest());

        // Validate the Partenaire in the database
        List<Partenaire> partenaireList = partenaireRepository.findAll();
        assertThat(partenaireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPartenaire() throws Exception {
        int databaseSizeBeforeUpdate = partenaireRepository.findAll().size();
        partenaire.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPartenaireMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(partenaire))
            )
            .andExpect(status().isBadRequest());

        // Validate the Partenaire in the database
        List<Partenaire> partenaireList = partenaireRepository.findAll();
        assertThat(partenaireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPartenaire() throws Exception {
        int databaseSizeBeforeUpdate = partenaireRepository.findAll().size();
        partenaire.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPartenaireMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(partenaire)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Partenaire in the database
        List<Partenaire> partenaireList = partenaireRepository.findAll();
        assertThat(partenaireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePartenaireWithPatch() throws Exception {
        // Initialize the database
        partenaireRepository.saveAndFlush(partenaire);

        int databaseSizeBeforeUpdate = partenaireRepository.findAll().size();

        // Update the partenaire using partial update
        Partenaire partialUpdatedPartenaire = new Partenaire();
        partialUpdatedPartenaire.setId(partenaire.getId());

        partialUpdatedPartenaire.description(UPDATED_DESCRIPTION).domaineActivite(UPDATED_DOMAINE_ACTIVITE).adresse(UPDATED_ADRESSE);

        restPartenaireMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPartenaire.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPartenaire))
            )
            .andExpect(status().isOk());

        // Validate the Partenaire in the database
        List<Partenaire> partenaireList = partenaireRepository.findAll();
        assertThat(partenaireList).hasSize(databaseSizeBeforeUpdate);
        Partenaire testPartenaire = partenaireList.get(partenaireList.size() - 1);
        assertThat(testPartenaire.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testPartenaire.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testPartenaire.getDomaineActivite()).isEqualTo(UPDATED_DOMAINE_ACTIVITE);
        assertThat(testPartenaire.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testPartenaire.getContact()).isEqualTo(DEFAULT_CONTACT);
    }

    @Test
    @Transactional
    void fullUpdatePartenaireWithPatch() throws Exception {
        // Initialize the database
        partenaireRepository.saveAndFlush(partenaire);

        int databaseSizeBeforeUpdate = partenaireRepository.findAll().size();

        // Update the partenaire using partial update
        Partenaire partialUpdatedPartenaire = new Partenaire();
        partialUpdatedPartenaire.setId(partenaire.getId());

        partialUpdatedPartenaire
            .nom(UPDATED_NOM)
            .description(UPDATED_DESCRIPTION)
            .domaineActivite(UPDATED_DOMAINE_ACTIVITE)
            .adresse(UPDATED_ADRESSE)
            .contact(UPDATED_CONTACT);

        restPartenaireMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPartenaire.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPartenaire))
            )
            .andExpect(status().isOk());

        // Validate the Partenaire in the database
        List<Partenaire> partenaireList = partenaireRepository.findAll();
        assertThat(partenaireList).hasSize(databaseSizeBeforeUpdate);
        Partenaire testPartenaire = partenaireList.get(partenaireList.size() - 1);
        assertThat(testPartenaire.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testPartenaire.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testPartenaire.getDomaineActivite()).isEqualTo(UPDATED_DOMAINE_ACTIVITE);
        assertThat(testPartenaire.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testPartenaire.getContact()).isEqualTo(UPDATED_CONTACT);
    }

    @Test
    @Transactional
    void patchNonExistingPartenaire() throws Exception {
        int databaseSizeBeforeUpdate = partenaireRepository.findAll().size();
        partenaire.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPartenaireMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partenaire.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partenaire))
            )
            .andExpect(status().isBadRequest());

        // Validate the Partenaire in the database
        List<Partenaire> partenaireList = partenaireRepository.findAll();
        assertThat(partenaireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPartenaire() throws Exception {
        int databaseSizeBeforeUpdate = partenaireRepository.findAll().size();
        partenaire.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPartenaireMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partenaire))
            )
            .andExpect(status().isBadRequest());

        // Validate the Partenaire in the database
        List<Partenaire> partenaireList = partenaireRepository.findAll();
        assertThat(partenaireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPartenaire() throws Exception {
        int databaseSizeBeforeUpdate = partenaireRepository.findAll().size();
        partenaire.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPartenaireMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(partenaire))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Partenaire in the database
        List<Partenaire> partenaireList = partenaireRepository.findAll();
        assertThat(partenaireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePartenaire() throws Exception {
        // Initialize the database
        partenaireRepository.saveAndFlush(partenaire);

        int databaseSizeBeforeDelete = partenaireRepository.findAll().size();

        // Delete the partenaire
        restPartenaireMockMvc
            .perform(delete(ENTITY_API_URL_ID, partenaire.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Partenaire> partenaireList = partenaireRepository.findAll();
        assertThat(partenaireList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
