package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.SupportDeCours;
import com.mycompany.myapp.domain.enumeration.Filiere;
import com.mycompany.myapp.repository.SupportDeCoursRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link SupportDeCoursResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class SupportDeCoursResourceIT {

    private static final String DEFAULT_TITRE = "AAAAAAAAAA";
    private static final String UPDATED_TITRE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final byte[] DEFAULT_CONTENU = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_CONTENU = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_CONTENU_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_CONTENU_CONTENT_TYPE = "image/png";

    private static final Instant DEFAULT_DATE_DEPOT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_DEPOT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Filiere DEFAULT_FILIERE = Filiere.ING;
    private static final Filiere UPDATED_FILIERE = Filiere.LEEA;

    private static final Integer DEFAULT_NIVEAU = 1;
    private static final Integer UPDATED_NIVEAU = 2;

    private static final String ENTITY_API_URL = "/api/support-de-cours";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SupportDeCoursRepository supportDeCoursRepository;

    @Mock
    private SupportDeCoursRepository supportDeCoursRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSupportDeCoursMockMvc;

    private SupportDeCours supportDeCours;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SupportDeCours createEntity(EntityManager em) {
        SupportDeCours supportDeCours = new SupportDeCours()
            .titre(DEFAULT_TITRE)
            .description(DEFAULT_DESCRIPTION)
            .contenu(DEFAULT_CONTENU)
            .contenuContentType(DEFAULT_CONTENU_CONTENT_TYPE)
            .dateDepot(DEFAULT_DATE_DEPOT)
            .filiere(DEFAULT_FILIERE)
            .niveau(DEFAULT_NIVEAU);
        return supportDeCours;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SupportDeCours createUpdatedEntity(EntityManager em) {
        SupportDeCours supportDeCours = new SupportDeCours()
            .titre(UPDATED_TITRE)
            .description(UPDATED_DESCRIPTION)
            .contenu(UPDATED_CONTENU)
            .contenuContentType(UPDATED_CONTENU_CONTENT_TYPE)
            .dateDepot(UPDATED_DATE_DEPOT)
            .filiere(UPDATED_FILIERE)
            .niveau(UPDATED_NIVEAU);
        return supportDeCours;
    }

    @BeforeEach
    public void initTest() {
        supportDeCours = createEntity(em);
    }

    @Test
    @Transactional
    void createSupportDeCours() throws Exception {
        int databaseSizeBeforeCreate = supportDeCoursRepository.findAll().size();
        // Create the SupportDeCours
        restSupportDeCoursMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(supportDeCours))
            )
            .andExpect(status().isCreated());

        // Validate the SupportDeCours in the database
        List<SupportDeCours> supportDeCoursList = supportDeCoursRepository.findAll();
        assertThat(supportDeCoursList).hasSize(databaseSizeBeforeCreate + 1);
        SupportDeCours testSupportDeCours = supportDeCoursList.get(supportDeCoursList.size() - 1);
        assertThat(testSupportDeCours.getTitre()).isEqualTo(DEFAULT_TITRE);
        assertThat(testSupportDeCours.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testSupportDeCours.getContenu()).isEqualTo(DEFAULT_CONTENU);
        assertThat(testSupportDeCours.getContenuContentType()).isEqualTo(DEFAULT_CONTENU_CONTENT_TYPE);
        assertThat(testSupportDeCours.getDateDepot()).isEqualTo(DEFAULT_DATE_DEPOT);
        assertThat(testSupportDeCours.getFiliere()).isEqualTo(DEFAULT_FILIERE);
        assertThat(testSupportDeCours.getNiveau()).isEqualTo(DEFAULT_NIVEAU);
    }

    @Test
    @Transactional
    void createSupportDeCoursWithExistingId() throws Exception {
        // Create the SupportDeCours with an existing ID
        supportDeCours.setId(1L);

        int databaseSizeBeforeCreate = supportDeCoursRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSupportDeCoursMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(supportDeCours))
            )
            .andExpect(status().isBadRequest());

        // Validate the SupportDeCours in the database
        List<SupportDeCours> supportDeCoursList = supportDeCoursRepository.findAll();
        assertThat(supportDeCoursList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSupportDeCours() throws Exception {
        // Initialize the database
        supportDeCoursRepository.saveAndFlush(supportDeCours);

        // Get all the supportDeCoursList
        restSupportDeCoursMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(supportDeCours.getId().intValue())))
            .andExpect(jsonPath("$.[*].titre").value(hasItem(DEFAULT_TITRE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].contenuContentType").value(hasItem(DEFAULT_CONTENU_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].contenu").value(hasItem(Base64Utils.encodeToString(DEFAULT_CONTENU))))
            .andExpect(jsonPath("$.[*].dateDepot").value(hasItem(DEFAULT_DATE_DEPOT.toString())))
            .andExpect(jsonPath("$.[*].filiere").value(hasItem(DEFAULT_FILIERE.toString())))
            .andExpect(jsonPath("$.[*].niveau").value(hasItem(DEFAULT_NIVEAU)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllSupportDeCoursWithEagerRelationshipsIsEnabled() throws Exception {
        when(supportDeCoursRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restSupportDeCoursMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(supportDeCoursRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllSupportDeCoursWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(supportDeCoursRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restSupportDeCoursMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(supportDeCoursRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getSupportDeCours() throws Exception {
        // Initialize the database
        supportDeCoursRepository.saveAndFlush(supportDeCours);

        // Get the supportDeCours
        restSupportDeCoursMockMvc
            .perform(get(ENTITY_API_URL_ID, supportDeCours.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(supportDeCours.getId().intValue()))
            .andExpect(jsonPath("$.titre").value(DEFAULT_TITRE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.contenuContentType").value(DEFAULT_CONTENU_CONTENT_TYPE))
            .andExpect(jsonPath("$.contenu").value(Base64Utils.encodeToString(DEFAULT_CONTENU)))
            .andExpect(jsonPath("$.dateDepot").value(DEFAULT_DATE_DEPOT.toString()))
            .andExpect(jsonPath("$.filiere").value(DEFAULT_FILIERE.toString()))
            .andExpect(jsonPath("$.niveau").value(DEFAULT_NIVEAU));
    }

    @Test
    @Transactional
    void getNonExistingSupportDeCours() throws Exception {
        // Get the supportDeCours
        restSupportDeCoursMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSupportDeCours() throws Exception {
        // Initialize the database
        supportDeCoursRepository.saveAndFlush(supportDeCours);

        int databaseSizeBeforeUpdate = supportDeCoursRepository.findAll().size();

        // Update the supportDeCours
        SupportDeCours updatedSupportDeCours = supportDeCoursRepository.findById(supportDeCours.getId()).get();
        // Disconnect from session so that the updates on updatedSupportDeCours are not directly saved in db
        em.detach(updatedSupportDeCours);
        updatedSupportDeCours
            .titre(UPDATED_TITRE)
            .description(UPDATED_DESCRIPTION)
            .contenu(UPDATED_CONTENU)
            .contenuContentType(UPDATED_CONTENU_CONTENT_TYPE)
            .dateDepot(UPDATED_DATE_DEPOT)
            .filiere(UPDATED_FILIERE)
            .niveau(UPDATED_NIVEAU);

        restSupportDeCoursMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSupportDeCours.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSupportDeCours))
            )
            .andExpect(status().isOk());

        // Validate the SupportDeCours in the database
        List<SupportDeCours> supportDeCoursList = supportDeCoursRepository.findAll();
        assertThat(supportDeCoursList).hasSize(databaseSizeBeforeUpdate);
        SupportDeCours testSupportDeCours = supportDeCoursList.get(supportDeCoursList.size() - 1);
        assertThat(testSupportDeCours.getTitre()).isEqualTo(UPDATED_TITRE);
        assertThat(testSupportDeCours.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSupportDeCours.getContenu()).isEqualTo(UPDATED_CONTENU);
        assertThat(testSupportDeCours.getContenuContentType()).isEqualTo(UPDATED_CONTENU_CONTENT_TYPE);
        assertThat(testSupportDeCours.getDateDepot()).isEqualTo(UPDATED_DATE_DEPOT);
        assertThat(testSupportDeCours.getFiliere()).isEqualTo(UPDATED_FILIERE);
        assertThat(testSupportDeCours.getNiveau()).isEqualTo(UPDATED_NIVEAU);
    }

    @Test
    @Transactional
    void putNonExistingSupportDeCours() throws Exception {
        int databaseSizeBeforeUpdate = supportDeCoursRepository.findAll().size();
        supportDeCours.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSupportDeCoursMockMvc
            .perform(
                put(ENTITY_API_URL_ID, supportDeCours.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(supportDeCours))
            )
            .andExpect(status().isBadRequest());

        // Validate the SupportDeCours in the database
        List<SupportDeCours> supportDeCoursList = supportDeCoursRepository.findAll();
        assertThat(supportDeCoursList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSupportDeCours() throws Exception {
        int databaseSizeBeforeUpdate = supportDeCoursRepository.findAll().size();
        supportDeCours.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSupportDeCoursMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(supportDeCours))
            )
            .andExpect(status().isBadRequest());

        // Validate the SupportDeCours in the database
        List<SupportDeCours> supportDeCoursList = supportDeCoursRepository.findAll();
        assertThat(supportDeCoursList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSupportDeCours() throws Exception {
        int databaseSizeBeforeUpdate = supportDeCoursRepository.findAll().size();
        supportDeCours.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSupportDeCoursMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(supportDeCours)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SupportDeCours in the database
        List<SupportDeCours> supportDeCoursList = supportDeCoursRepository.findAll();
        assertThat(supportDeCoursList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSupportDeCoursWithPatch() throws Exception {
        // Initialize the database
        supportDeCoursRepository.saveAndFlush(supportDeCours);

        int databaseSizeBeforeUpdate = supportDeCoursRepository.findAll().size();

        // Update the supportDeCours using partial update
        SupportDeCours partialUpdatedSupportDeCours = new SupportDeCours();
        partialUpdatedSupportDeCours.setId(supportDeCours.getId());

        partialUpdatedSupportDeCours.description(UPDATED_DESCRIPTION).dateDepot(UPDATED_DATE_DEPOT).filiere(UPDATED_FILIERE);

        restSupportDeCoursMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSupportDeCours.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSupportDeCours))
            )
            .andExpect(status().isOk());

        // Validate the SupportDeCours in the database
        List<SupportDeCours> supportDeCoursList = supportDeCoursRepository.findAll();
        assertThat(supportDeCoursList).hasSize(databaseSizeBeforeUpdate);
        SupportDeCours testSupportDeCours = supportDeCoursList.get(supportDeCoursList.size() - 1);
        assertThat(testSupportDeCours.getTitre()).isEqualTo(DEFAULT_TITRE);
        assertThat(testSupportDeCours.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSupportDeCours.getContenu()).isEqualTo(DEFAULT_CONTENU);
        assertThat(testSupportDeCours.getContenuContentType()).isEqualTo(DEFAULT_CONTENU_CONTENT_TYPE);
        assertThat(testSupportDeCours.getDateDepot()).isEqualTo(UPDATED_DATE_DEPOT);
        assertThat(testSupportDeCours.getFiliere()).isEqualTo(UPDATED_FILIERE);
        assertThat(testSupportDeCours.getNiveau()).isEqualTo(DEFAULT_NIVEAU);
    }

    @Test
    @Transactional
    void fullUpdateSupportDeCoursWithPatch() throws Exception {
        // Initialize the database
        supportDeCoursRepository.saveAndFlush(supportDeCours);

        int databaseSizeBeforeUpdate = supportDeCoursRepository.findAll().size();

        // Update the supportDeCours using partial update
        SupportDeCours partialUpdatedSupportDeCours = new SupportDeCours();
        partialUpdatedSupportDeCours.setId(supportDeCours.getId());

        partialUpdatedSupportDeCours
            .titre(UPDATED_TITRE)
            .description(UPDATED_DESCRIPTION)
            .contenu(UPDATED_CONTENU)
            .contenuContentType(UPDATED_CONTENU_CONTENT_TYPE)
            .dateDepot(UPDATED_DATE_DEPOT)
            .filiere(UPDATED_FILIERE)
            .niveau(UPDATED_NIVEAU);

        restSupportDeCoursMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSupportDeCours.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSupportDeCours))
            )
            .andExpect(status().isOk());

        // Validate the SupportDeCours in the database
        List<SupportDeCours> supportDeCoursList = supportDeCoursRepository.findAll();
        assertThat(supportDeCoursList).hasSize(databaseSizeBeforeUpdate);
        SupportDeCours testSupportDeCours = supportDeCoursList.get(supportDeCoursList.size() - 1);
        assertThat(testSupportDeCours.getTitre()).isEqualTo(UPDATED_TITRE);
        assertThat(testSupportDeCours.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSupportDeCours.getContenu()).isEqualTo(UPDATED_CONTENU);
        assertThat(testSupportDeCours.getContenuContentType()).isEqualTo(UPDATED_CONTENU_CONTENT_TYPE);
        assertThat(testSupportDeCours.getDateDepot()).isEqualTo(UPDATED_DATE_DEPOT);
        assertThat(testSupportDeCours.getFiliere()).isEqualTo(UPDATED_FILIERE);
        assertThat(testSupportDeCours.getNiveau()).isEqualTo(UPDATED_NIVEAU);
    }

    @Test
    @Transactional
    void patchNonExistingSupportDeCours() throws Exception {
        int databaseSizeBeforeUpdate = supportDeCoursRepository.findAll().size();
        supportDeCours.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSupportDeCoursMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, supportDeCours.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(supportDeCours))
            )
            .andExpect(status().isBadRequest());

        // Validate the SupportDeCours in the database
        List<SupportDeCours> supportDeCoursList = supportDeCoursRepository.findAll();
        assertThat(supportDeCoursList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSupportDeCours() throws Exception {
        int databaseSizeBeforeUpdate = supportDeCoursRepository.findAll().size();
        supportDeCours.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSupportDeCoursMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(supportDeCours))
            )
            .andExpect(status().isBadRequest());

        // Validate the SupportDeCours in the database
        List<SupportDeCours> supportDeCoursList = supportDeCoursRepository.findAll();
        assertThat(supportDeCoursList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSupportDeCours() throws Exception {
        int databaseSizeBeforeUpdate = supportDeCoursRepository.findAll().size();
        supportDeCours.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSupportDeCoursMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(supportDeCours))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SupportDeCours in the database
        List<SupportDeCours> supportDeCoursList = supportDeCoursRepository.findAll();
        assertThat(supportDeCoursList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSupportDeCours() throws Exception {
        // Initialize the database
        supportDeCoursRepository.saveAndFlush(supportDeCours);

        int databaseSizeBeforeDelete = supportDeCoursRepository.findAll().size();

        // Delete the supportDeCours
        restSupportDeCoursMockMvc
            .perform(delete(ENTITY_API_URL_ID, supportDeCours.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SupportDeCours> supportDeCoursList = supportDeCoursRepository.findAll();
        assertThat(supportDeCoursList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
