package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.DemandeEtudiant;
import com.mycompany.myapp.repository.DemandeEtudiantRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.DemandeEtudiant}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DemandeEtudiantResource {

    private final Logger log = LoggerFactory.getLogger(DemandeEtudiantResource.class);

    private static final String ENTITY_NAME = "demandeEtudiant";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DemandeEtudiantRepository demandeEtudiantRepository;

    public DemandeEtudiantResource(DemandeEtudiantRepository demandeEtudiantRepository) {
        this.demandeEtudiantRepository = demandeEtudiantRepository;
    }

    /**
     * {@code POST  /demande-etudiants} : Create a new demandeEtudiant.
     *
     * @param demandeEtudiant the demandeEtudiant to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new demandeEtudiant, or with status {@code 400 (Bad Request)} if the demandeEtudiant has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/demande-etudiants")
    public ResponseEntity<DemandeEtudiant> createDemandeEtudiant(@RequestBody DemandeEtudiant demandeEtudiant) throws URISyntaxException {
        log.debug("REST request to save DemandeEtudiant : {}", demandeEtudiant);
        if (demandeEtudiant.getId() != null) {
            throw new BadRequestAlertException("A new demandeEtudiant cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DemandeEtudiant result = demandeEtudiantRepository.save(demandeEtudiant);
        return ResponseEntity
            .created(new URI("/api/demande-etudiants/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /demande-etudiants/:id} : Updates an existing demandeEtudiant.
     *
     * @param id the id of the demandeEtudiant to save.
     * @param demandeEtudiant the demandeEtudiant to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated demandeEtudiant,
     * or with status {@code 400 (Bad Request)} if the demandeEtudiant is not valid,
     * or with status {@code 500 (Internal Server Error)} if the demandeEtudiant couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/demande-etudiants/{id}")
    public ResponseEntity<DemandeEtudiant> updateDemandeEtudiant(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DemandeEtudiant demandeEtudiant
    ) throws URISyntaxException {
        log.debug("REST request to update DemandeEtudiant : {}, {}", id, demandeEtudiant);
        if (demandeEtudiant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, demandeEtudiant.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!demandeEtudiantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DemandeEtudiant result = demandeEtudiantRepository.save(demandeEtudiant);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, demandeEtudiant.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /demande-etudiants/:id} : Partial updates given fields of an existing demandeEtudiant, field will ignore if it is null
     *
     * @param id the id of the demandeEtudiant to save.
     * @param demandeEtudiant the demandeEtudiant to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated demandeEtudiant,
     * or with status {@code 400 (Bad Request)} if the demandeEtudiant is not valid,
     * or with status {@code 404 (Not Found)} if the demandeEtudiant is not found,
     * or with status {@code 500 (Internal Server Error)} if the demandeEtudiant couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/demande-etudiants/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DemandeEtudiant> partialUpdateDemandeEtudiant(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DemandeEtudiant demandeEtudiant
    ) throws URISyntaxException {
        log.debug("REST request to partial update DemandeEtudiant partially : {}, {}", id, demandeEtudiant);
        if (demandeEtudiant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, demandeEtudiant.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!demandeEtudiantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DemandeEtudiant> result = demandeEtudiantRepository
            .findById(demandeEtudiant.getId())
            .map(existingDemandeEtudiant -> {
                if (demandeEtudiant.getSujet() != null) {
                    existingDemandeEtudiant.setSujet(demandeEtudiant.getSujet());
                }
                if (demandeEtudiant.getDescription() != null) {
                    existingDemandeEtudiant.setDescription(demandeEtudiant.getDescription());
                }
                if (demandeEtudiant.getStatut() != null) {
                    existingDemandeEtudiant.setStatut(demandeEtudiant.getStatut());
                }
                if (demandeEtudiant.getDateCreation() != null) {
                    existingDemandeEtudiant.setDateCreation(demandeEtudiant.getDateCreation());
                }

                return existingDemandeEtudiant;
            })
            .map(demandeEtudiantRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, demandeEtudiant.getId().toString())
        );
    }

    /**
     * {@code GET  /demande-etudiants} : get all the demandeEtudiants.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of demandeEtudiants in body.
     */
    @GetMapping("/demande-etudiants")
    public List<DemandeEtudiant> getAllDemandeEtudiants() {
        log.debug("REST request to get all DemandeEtudiants");
        return demandeEtudiantRepository.findAll();
    }

    /**
     * {@code GET  /demande-etudiants/:id} : get the "id" demandeEtudiant.
     *
     * @param id the id of the demandeEtudiant to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the demandeEtudiant, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/demande-etudiants/{id}")
    public ResponseEntity<DemandeEtudiant> getDemandeEtudiant(@PathVariable Long id) {
        log.debug("REST request to get DemandeEtudiant : {}", id);
        Optional<DemandeEtudiant> demandeEtudiant = demandeEtudiantRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(demandeEtudiant);
    }

    /**
     * {@code DELETE  /demande-etudiants/:id} : delete the "id" demandeEtudiant.
     *
     * @param id the id of the demandeEtudiant to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/demande-etudiants/{id}")
    public ResponseEntity<Void> deleteDemandeEtudiant(@PathVariable Long id) {
        log.debug("REST request to delete DemandeEtudiant : {}", id);
        demandeEtudiantRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
