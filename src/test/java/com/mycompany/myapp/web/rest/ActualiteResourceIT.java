package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Actualite;
import com.mycompany.myapp.repository.ActualiteRepository;
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
 * Integration tests for the {@link ActualiteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ActualiteResourceIT {

    private static final String DEFAULT_TITRE = "AAAAAAAAAA";
    private static final String UPDATED_TITRE = "BBBBBBBBBB";

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_CONTENU = "AAAAAAAAAA";
    private static final String UPDATED_CONTENU = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_PUBLICATION = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_PUBLICATION = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/actualites";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ActualiteRepository actualiteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restActualiteMockMvc;

    private Actualite actualite;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Actualite createEntity(EntityManager em) {
        Actualite actualite = new Actualite()
            .titre(DEFAULT_TITRE)
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE)
            .contenu(DEFAULT_CONTENU)
            .datePublication(DEFAULT_DATE_PUBLICATION);
        return actualite;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Actualite createUpdatedEntity(EntityManager em) {
        Actualite actualite = new Actualite()
            .titre(UPDATED_TITRE)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .contenu(UPDATED_CONTENU)
            .datePublication(UPDATED_DATE_PUBLICATION);
        return actualite;
    }

    @BeforeEach
    public void initTest() {
        actualite = createEntity(em);
    }

    @Test
    @Transactional
    void createActualite() throws Exception {
        int databaseSizeBeforeCreate = actualiteRepository.findAll().size();
        // Create the Actualite
        restActualiteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(actualite)))
            .andExpect(status().isCreated());

        // Validate the Actualite in the database
        List<Actualite> actualiteList = actualiteRepository.findAll();
        assertThat(actualiteList).hasSize(databaseSizeBeforeCreate + 1);
        Actualite testActualite = actualiteList.get(actualiteList.size() - 1);
        assertThat(testActualite.getTitre()).isEqualTo(DEFAULT_TITRE);
        assertThat(testActualite.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testActualite.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
        assertThat(testActualite.getContenu()).isEqualTo(DEFAULT_CONTENU);
        assertThat(testActualite.getDatePublication()).isEqualTo(DEFAULT_DATE_PUBLICATION);
    }

    @Test
    @Transactional
    void createActualiteWithExistingId() throws Exception {
        // Create the Actualite with an existing ID
        actualite.setId(1L);

        int databaseSizeBeforeCreate = actualiteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restActualiteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(actualite)))
            .andExpect(status().isBadRequest());

        // Validate the Actualite in the database
        List<Actualite> actualiteList = actualiteRepository.findAll();
        assertThat(actualiteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllActualites() throws Exception {
        // Initialize the database
        actualiteRepository.saveAndFlush(actualite);

        // Get all the actualiteList
        restActualiteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(actualite.getId().intValue())))
            .andExpect(jsonPath("$.[*].titre").value(hasItem(DEFAULT_TITRE)))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))))
            .andExpect(jsonPath("$.[*].contenu").value(hasItem(DEFAULT_CONTENU.toString())))
            .andExpect(jsonPath("$.[*].datePublication").value(hasItem(DEFAULT_DATE_PUBLICATION.toString())));
    }

    @Test
    @Transactional
    void getActualite() throws Exception {
        // Initialize the database
        actualiteRepository.saveAndFlush(actualite);

        // Get the actualite
        restActualiteMockMvc
            .perform(get(ENTITY_API_URL_ID, actualite.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(actualite.getId().intValue()))
            .andExpect(jsonPath("$.titre").value(DEFAULT_TITRE))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)))
            .andExpect(jsonPath("$.contenu").value(DEFAULT_CONTENU.toString()))
            .andExpect(jsonPath("$.datePublication").value(DEFAULT_DATE_PUBLICATION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingActualite() throws Exception {
        // Get the actualite
        restActualiteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingActualite() throws Exception {
        // Initialize the database
        actualiteRepository.saveAndFlush(actualite);

        int databaseSizeBeforeUpdate = actualiteRepository.findAll().size();

        // Update the actualite
        Actualite updatedActualite = actualiteRepository.findById(actualite.getId()).get();
        // Disconnect from session so that the updates on updatedActualite are not directly saved in db
        em.detach(updatedActualite);
        updatedActualite
            .titre(UPDATED_TITRE)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .contenu(UPDATED_CONTENU)
            .datePublication(UPDATED_DATE_PUBLICATION);

        restActualiteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedActualite.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedActualite))
            )
            .andExpect(status().isOk());

        // Validate the Actualite in the database
        List<Actualite> actualiteList = actualiteRepository.findAll();
        assertThat(actualiteList).hasSize(databaseSizeBeforeUpdate);
        Actualite testActualite = actualiteList.get(actualiteList.size() - 1);
        assertThat(testActualite.getTitre()).isEqualTo(UPDATED_TITRE);
        assertThat(testActualite.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testActualite.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testActualite.getContenu()).isEqualTo(UPDATED_CONTENU);
        assertThat(testActualite.getDatePublication()).isEqualTo(UPDATED_DATE_PUBLICATION);
    }

    @Test
    @Transactional
    void putNonExistingActualite() throws Exception {
        int databaseSizeBeforeUpdate = actualiteRepository.findAll().size();
        actualite.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActualiteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, actualite.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(actualite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Actualite in the database
        List<Actualite> actualiteList = actualiteRepository.findAll();
        assertThat(actualiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchActualite() throws Exception {
        int databaseSizeBeforeUpdate = actualiteRepository.findAll().size();
        actualite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActualiteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(actualite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Actualite in the database
        List<Actualite> actualiteList = actualiteRepository.findAll();
        assertThat(actualiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamActualite() throws Exception {
        int databaseSizeBeforeUpdate = actualiteRepository.findAll().size();
        actualite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActualiteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(actualite)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Actualite in the database
        List<Actualite> actualiteList = actualiteRepository.findAll();
        assertThat(actualiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateActualiteWithPatch() throws Exception {
        // Initialize the database
        actualiteRepository.saveAndFlush(actualite);

        int databaseSizeBeforeUpdate = actualiteRepository.findAll().size();

        // Update the actualite using partial update
        Actualite partialUpdatedActualite = new Actualite();
        partialUpdatedActualite.setId(actualite.getId());

        partialUpdatedActualite
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .contenu(UPDATED_CONTENU)
            .datePublication(UPDATED_DATE_PUBLICATION);

        restActualiteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActualite.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActualite))
            )
            .andExpect(status().isOk());

        // Validate the Actualite in the database
        List<Actualite> actualiteList = actualiteRepository.findAll();
        assertThat(actualiteList).hasSize(databaseSizeBeforeUpdate);
        Actualite testActualite = actualiteList.get(actualiteList.size() - 1);
        assertThat(testActualite.getTitre()).isEqualTo(DEFAULT_TITRE);
        assertThat(testActualite.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testActualite.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testActualite.getContenu()).isEqualTo(UPDATED_CONTENU);
        assertThat(testActualite.getDatePublication()).isEqualTo(UPDATED_DATE_PUBLICATION);
    }

    @Test
    @Transactional
    void fullUpdateActualiteWithPatch() throws Exception {
        // Initialize the database
        actualiteRepository.saveAndFlush(actualite);

        int databaseSizeBeforeUpdate = actualiteRepository.findAll().size();

        // Update the actualite using partial update
        Actualite partialUpdatedActualite = new Actualite();
        partialUpdatedActualite.setId(actualite.getId());

        partialUpdatedActualite
            .titre(UPDATED_TITRE)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .contenu(UPDATED_CONTENU)
            .datePublication(UPDATED_DATE_PUBLICATION);

        restActualiteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActualite.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActualite))
            )
            .andExpect(status().isOk());

        // Validate the Actualite in the database
        List<Actualite> actualiteList = actualiteRepository.findAll();
        assertThat(actualiteList).hasSize(databaseSizeBeforeUpdate);
        Actualite testActualite = actualiteList.get(actualiteList.size() - 1);
        assertThat(testActualite.getTitre()).isEqualTo(UPDATED_TITRE);
        assertThat(testActualite.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testActualite.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testActualite.getContenu()).isEqualTo(UPDATED_CONTENU);
        assertThat(testActualite.getDatePublication()).isEqualTo(UPDATED_DATE_PUBLICATION);
    }

    @Test
    @Transactional
    void patchNonExistingActualite() throws Exception {
        int databaseSizeBeforeUpdate = actualiteRepository.findAll().size();
        actualite.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActualiteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, actualite.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(actualite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Actualite in the database
        List<Actualite> actualiteList = actualiteRepository.findAll();
        assertThat(actualiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchActualite() throws Exception {
        int databaseSizeBeforeUpdate = actualiteRepository.findAll().size();
        actualite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActualiteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(actualite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Actualite in the database
        List<Actualite> actualiteList = actualiteRepository.findAll();
        assertThat(actualiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamActualite() throws Exception {
        int databaseSizeBeforeUpdate = actualiteRepository.findAll().size();
        actualite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActualiteMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(actualite))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Actualite in the database
        List<Actualite> actualiteList = actualiteRepository.findAll();
        assertThat(actualiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteActualite() throws Exception {
        // Initialize the database
        actualiteRepository.saveAndFlush(actualite);

        int databaseSizeBeforeDelete = actualiteRepository.findAll().size();

        // Delete the actualite
        restActualiteMockMvc
            .perform(delete(ENTITY_API_URL_ID, actualite.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Actualite> actualiteList = actualiteRepository.findAll();
        assertThat(actualiteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
