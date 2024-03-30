package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.DemandeEnseignant;
import com.mycompany.myapp.repository.DemandeEnseignantRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.DemandeEnseignant}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DemandeEnseignantResource {

    private final Logger log = LoggerFactory.getLogger(DemandeEnseignantResource.class);

    private static final String ENTITY_NAME = "demandeEnseignant";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DemandeEnseignantRepository demandeEnseignantRepository;

    public DemandeEnseignantResource(DemandeEnseignantRepository demandeEnseignantRepository) {
        this.demandeEnseignantRepository = demandeEnseignantRepository;
    }

    /**
     * {@code POST  /demande-enseignants} : Create a new demandeEnseignant.
     *
     * @param demandeEnseignant the demandeEnseignant to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new demandeEnseignant, or with status {@code 400 (Bad Request)} if the demandeEnseignant has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/demande-enseignants")
    public ResponseEntity<DemandeEnseignant> createDemandeEnseignant(@RequestBody DemandeEnseignant demandeEnseignant)
        throws URISyntaxException {
        log.debug("REST request to save DemandeEnseignant : {}", demandeEnseignant);
        if (demandeEnseignant.getId() != null) {
            throw new BadRequestAlertException("A new demandeEnseignant cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DemandeEnseignant result = demandeEnseignantRepository.save(demandeEnseignant);
        return ResponseEntity
            .created(new URI("/api/demande-enseignants/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /demande-enseignants/:id} : Updates an existing demandeEnseignant.
     *
     * @param id the id of the demandeEnseignant to save.
     * @param demandeEnseignant the demandeEnseignant to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated demandeEnseignant,
     * or with status {@code 400 (Bad Request)} if the demandeEnseignant is not valid,
     * or with status {@code 500 (Internal Server Error)} if the demandeEnseignant couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/demande-enseignants/{id}")
    public ResponseEntity<DemandeEnseignant> updateDemandeEnseignant(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DemandeEnseignant demandeEnseignant
    ) throws URISyntaxException {
        log.debug("REST request to update DemandeEnseignant : {}, {}", id, demandeEnseignant);
        if (demandeEnseignant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, demandeEnseignant.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!demandeEnseignantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DemandeEnseignant result = demandeEnseignantRepository.save(demandeEnseignant);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, demandeEnseignant.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /demande-enseignants/:id} : Partial updates given fields of an existing demandeEnseignant, field will ignore if it is null
     *
     * @param id the id of the demandeEnseignant to save.
     * @param demandeEnseignant the demandeEnseignant to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated demandeEnseignant,
     * or with status {@code 400 (Bad Request)} if the demandeEnseignant is not valid,
     * or with status {@code 404 (Not Found)} if the demandeEnseignant is not found,
     * or with status {@code 500 (Internal Server Error)} if the demandeEnseignant couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/demande-enseignants/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DemandeEnseignant> partialUpdateDemandeEnseignant(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DemandeEnseignant demandeEnseignant
    ) throws URISyntaxException {
        log.debug("REST request to partial update DemandeEnseignant partially : {}, {}", id, demandeEnseignant);
        if (demandeEnseignant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, demandeEnseignant.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!demandeEnseignantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DemandeEnseignant> result = demandeEnseignantRepository
            .findById(demandeEnseignant.getId())
            .map(existingDemandeEnseignant -> {
                if (demandeEnseignant.getSujet() != null) {
                    existingDemandeEnseignant.setSujet(demandeEnseignant.getSujet());
                }
                if (demandeEnseignant.getDescription() != null) {
                    existingDemandeEnseignant.setDescription(demandeEnseignant.getDescription());
                }
                if (demandeEnseignant.getStatut() != null) {
                    existingDemandeEnseignant.setStatut(demandeEnseignant.getStatut());
                }
                if (demandeEnseignant.getDateCreation() != null) {
                    existingDemandeEnseignant.setDateCreation(demandeEnseignant.getDateCreation());
                }

                return existingDemandeEnseignant;
            })
            .map(demandeEnseignantRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, demandeEnseignant.getId().toString())
        );
    }

    /**
     * {@code GET  /demande-enseignants} : get all the demandeEnseignants.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of demandeEnseignants in body.
     */
    @GetMapping("/demande-enseignants")
    public List<DemandeEnseignant> getAllDemandeEnseignants() {
        log.debug("REST request to get all DemandeEnseignants");
        return demandeEnseignantRepository.findAll();
    }

    /**
     * {@code GET  /demande-enseignants/:id} : get the "id" demandeEnseignant.
     *
     * @param id the id of the demandeEnseignant to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the demandeEnseignant, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/demande-enseignants/{id}")
    public ResponseEntity<DemandeEnseignant> getDemandeEnseignant(@PathVariable Long id) {
        log.debug("REST request to get DemandeEnseignant : {}", id);
        Optional<DemandeEnseignant> demandeEnseignant = demandeEnseignantRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(demandeEnseignant);
    }

    /**
     * {@code DELETE  /demande-enseignants/:id} : delete the "id" demandeEnseignant.
     *
     * @param id the id of the demandeEnseignant to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/demande-enseignants/{id}")
    public ResponseEntity<Void> deleteDemandeEnseignant(@PathVariable Long id) {
        log.debug("REST request to delete DemandeEnseignant : {}", id);
        demandeEnseignantRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
