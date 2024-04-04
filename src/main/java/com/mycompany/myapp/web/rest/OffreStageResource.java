package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.OffreStage;
import com.mycompany.myapp.repository.OffreStageRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.OffreStage}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OffreStageResource {

    private final Logger log = LoggerFactory.getLogger(OffreStageResource.class);

    private static final String ENTITY_NAME = "offreStage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OffreStageRepository offreStageRepository;

    public OffreStageResource(OffreStageRepository offreStageRepository) {
        this.offreStageRepository = offreStageRepository;
    }

    /**
     * {@code POST  /offre-stages} : Create a new offreStage.
     *
     * @param offreStage the offreStage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new offreStage, or with status {@code 400 (Bad Request)} if the offreStage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/offre-stages")
    public ResponseEntity<OffreStage> createOffreStage(@RequestBody OffreStage offreStage) throws URISyntaxException {
        log.debug("REST request to save OffreStage : {}", offreStage);
        if (offreStage.getId() != null) {
            throw new BadRequestAlertException("A new offreStage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OffreStage result = offreStageRepository.save(offreStage);
        return ResponseEntity
            .created(new URI("/api/offre-stages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /offre-stages/:id} : Updates an existing offreStage.
     *
     * @param id the id of the offreStage to save.
     * @param offreStage the offreStage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated offreStage,
     * or with status {@code 400 (Bad Request)} if the offreStage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the offreStage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/offre-stages/{id}")
    public ResponseEntity<OffreStage> updateOffreStage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OffreStage offreStage
    ) throws URISyntaxException {
        log.debug("REST request to update OffreStage : {}, {}", id, offreStage);
        if (offreStage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, offreStage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!offreStageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OffreStage result = offreStageRepository.save(offreStage);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, offreStage.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /offre-stages/:id} : Partial updates given fields of an existing offreStage, field will ignore if it is null
     *
     * @param id the id of the offreStage to save.
     * @param offreStage the offreStage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated offreStage,
     * or with status {@code 400 (Bad Request)} if the offreStage is not valid,
     * or with status {@code 404 (Not Found)} if the offreStage is not found,
     * or with status {@code 500 (Internal Server Error)} if the offreStage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/offre-stages/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OffreStage> partialUpdateOffreStage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OffreStage offreStage
    ) throws URISyntaxException {
        log.debug("REST request to partial update OffreStage partially : {}, {}", id, offreStage);
        if (offreStage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, offreStage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!offreStageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OffreStage> result = offreStageRepository
            .findById(offreStage.getId())
            .map(existingOffreStage -> {
                if (offreStage.getTitre() != null) {
                    existingOffreStage.setTitre(offreStage.getTitre());
                }
                if (offreStage.getDescription() != null) {
                    existingOffreStage.setDescription(offreStage.getDescription());
                }
                if (offreStage.getDomaine() != null) {
                    existingOffreStage.setDomaine(offreStage.getDomaine());
                }
                if (offreStage.getDateDebut() != null) {
                    existingOffreStage.setDateDebut(offreStage.getDateDebut());
                }
                if (offreStage.getDateFin() != null) {
                    existingOffreStage.setDateFin(offreStage.getDateFin());
                }
                if (offreStage.getEntreprise() != null) {
                    existingOffreStage.setEntreprise(offreStage.getEntreprise());
                }
                if (offreStage.getLieu() != null) {
                    existingOffreStage.setLieu(offreStage.getLieu());
                }

                return existingOffreStage;
            })
            .map(offreStageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, offreStage.getId().toString())
        );
    }

    /**
     * {@code GET  /offre-stages} : get all the offreStages.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of offreStages in body.
     */
    @GetMapping("/offre-stages")
    public List<OffreStage> getAllOffreStages(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all OffreStages");
        if (eagerload) {
            return offreStageRepository.findAllWithEagerRelationships();
        } else {
            return offreStageRepository.findAll();
        }
    }

    /**
     * {@code GET  /offre-stages/:id} : get the "id" offreStage.
     *
     * @param id the id of the offreStage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the offreStage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/offre-stages/{id}")
    public ResponseEntity<OffreStage> getOffreStage(@PathVariable Long id) {
        log.debug("REST request to get OffreStage : {}", id);
        Optional<OffreStage> offreStage = offreStageRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(offreStage);
    }

    /**
     * {@code DELETE  /offre-stages/:id} : delete the "id" offreStage.
     *
     * @param id the id of the offreStage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/offre-stages/{id}")
    public ResponseEntity<Void> deleteOffreStage(@PathVariable Long id) {
        log.debug("REST request to delete OffreStage : {}", id);
        offreStageRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
