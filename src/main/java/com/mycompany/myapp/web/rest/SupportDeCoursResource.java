package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.SupportDeCours;
import com.mycompany.myapp.repository.SupportDeCoursRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.SupportDeCours}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SupportDeCoursResource {

    private final Logger log = LoggerFactory.getLogger(SupportDeCoursResource.class);

    private static final String ENTITY_NAME = "supportDeCours";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SupportDeCoursRepository supportDeCoursRepository;

    public SupportDeCoursResource(SupportDeCoursRepository supportDeCoursRepository) {
        this.supportDeCoursRepository = supportDeCoursRepository;
    }

    /**
     * {@code POST  /support-de-cours} : Create a new supportDeCours.
     *
     * @param supportDeCours the supportDeCours to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new supportDeCours, or with status {@code 400 (Bad Request)} if the supportDeCours has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/support-de-cours")
    public ResponseEntity<SupportDeCours> createSupportDeCours(@RequestBody SupportDeCours supportDeCours) throws URISyntaxException {
        log.debug("REST request to save SupportDeCours : {}", supportDeCours);
        if (supportDeCours.getId() != null) {
            throw new BadRequestAlertException("A new supportDeCours cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SupportDeCours result = supportDeCoursRepository.save(supportDeCours);
        return ResponseEntity
            .created(new URI("/api/support-de-cours/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /support-de-cours/:id} : Updates an existing supportDeCours.
     *
     * @param id the id of the supportDeCours to save.
     * @param supportDeCours the supportDeCours to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated supportDeCours,
     * or with status {@code 400 (Bad Request)} if the supportDeCours is not valid,
     * or with status {@code 500 (Internal Server Error)} if the supportDeCours couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/support-de-cours/{id}")
    public ResponseEntity<SupportDeCours> updateSupportDeCours(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SupportDeCours supportDeCours
    ) throws URISyntaxException {
        log.debug("REST request to update SupportDeCours : {}, {}", id, supportDeCours);
        if (supportDeCours.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, supportDeCours.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!supportDeCoursRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SupportDeCours result = supportDeCoursRepository.save(supportDeCours);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, supportDeCours.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /support-de-cours/:id} : Partial updates given fields of an existing supportDeCours, field will ignore if it is null
     *
     * @param id the id of the supportDeCours to save.
     * @param supportDeCours the supportDeCours to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated supportDeCours,
     * or with status {@code 400 (Bad Request)} if the supportDeCours is not valid,
     * or with status {@code 404 (Not Found)} if the supportDeCours is not found,
     * or with status {@code 500 (Internal Server Error)} if the supportDeCours couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/support-de-cours/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SupportDeCours> partialUpdateSupportDeCours(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SupportDeCours supportDeCours
    ) throws URISyntaxException {
        log.debug("REST request to partial update SupportDeCours partially : {}, {}", id, supportDeCours);
        if (supportDeCours.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, supportDeCours.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!supportDeCoursRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SupportDeCours> result = supportDeCoursRepository
            .findById(supportDeCours.getId())
            .map(existingSupportDeCours -> {
                if (supportDeCours.getTitre() != null) {
                    existingSupportDeCours.setTitre(supportDeCours.getTitre());
                }
                if (supportDeCours.getDescription() != null) {
                    existingSupportDeCours.setDescription(supportDeCours.getDescription());
                }
                if (supportDeCours.getContenu() != null) {
                    existingSupportDeCours.setContenu(supportDeCours.getContenu());
                }
                if (supportDeCours.getContenuContentType() != null) {
                    existingSupportDeCours.setContenuContentType(supportDeCours.getContenuContentType());
                }
                if (supportDeCours.getDateDepot() != null) {
                    existingSupportDeCours.setDateDepot(supportDeCours.getDateDepot());
                }
                if (supportDeCours.getFiliere() != null) {
                    existingSupportDeCours.setFiliere(supportDeCours.getFiliere());
                }
                if (supportDeCours.getNiveau() != null) {
                    existingSupportDeCours.setNiveau(supportDeCours.getNiveau());
                }

                return existingSupportDeCours;
            })
            .map(supportDeCoursRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, supportDeCours.getId().toString())
        );
    }

    /**
     * {@code GET  /support-de-cours} : get all the supportDeCours.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of supportDeCours in body.
     */
    @GetMapping("/support-de-cours")
    public List<SupportDeCours> getAllSupportDeCours(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all SupportDeCours");
        if (eagerload) {
            return supportDeCoursRepository.findAllWithEagerRelationships();
        } else {
            return supportDeCoursRepository.findAll();
        }
    }

    /**
     * {@code GET  /support-de-cours/:id} : get the "id" supportDeCours.
     *
     * @param id the id of the supportDeCours to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the supportDeCours, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/support-de-cours/{id}")
    public ResponseEntity<SupportDeCours> getSupportDeCours(@PathVariable Long id) {
        log.debug("REST request to get SupportDeCours : {}", id);
        Optional<SupportDeCours> supportDeCours = supportDeCoursRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(supportDeCours);
    }

    /**
     * {@code DELETE  /support-de-cours/:id} : delete the "id" supportDeCours.
     *
     * @param id the id of the supportDeCours to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/support-de-cours/{id}")
    public ResponseEntity<Void> deleteSupportDeCours(@PathVariable Long id) {
        log.debug("REST request to delete SupportDeCours : {}", id);
        supportDeCoursRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
