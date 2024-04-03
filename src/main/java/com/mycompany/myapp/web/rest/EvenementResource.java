package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Evenement;
import com.mycompany.myapp.repository.EvenementRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Evenement}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EvenementResource {

    private final Logger log = LoggerFactory.getLogger(EvenementResource.class);

    private static final String ENTITY_NAME = "evenement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EvenementRepository evenementRepository;

    public EvenementResource(EvenementRepository evenementRepository) {
        this.evenementRepository = evenementRepository;
    }

    /**
     * {@code POST  /evenements} : Create a new evenement.
     *
     * @param evenement the evenement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new evenement, or with status {@code 400 (Bad Request)} if the evenement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/evenements")
    public ResponseEntity<Evenement> createEvenement(@RequestBody Evenement evenement) throws URISyntaxException {
        log.debug("REST request to save Evenement : {}", evenement);
        if (evenement.getId() != null) {
            throw new BadRequestAlertException("A new evenement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Evenement result = evenementRepository.save(evenement);
        return ResponseEntity
            .created(new URI("/api/evenements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /evenements/:id} : Updates an existing evenement.
     *
     * @param id the id of the evenement to save.
     * @param evenement the evenement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated evenement,
     * or with status {@code 400 (Bad Request)} if the evenement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the evenement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/evenements/{id}")
    public ResponseEntity<Evenement> updateEvenement(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Evenement evenement
    ) throws URISyntaxException {
        log.debug("REST request to update Evenement : {}, {}", id, evenement);
        if (evenement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, evenement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!evenementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Evenement result = evenementRepository.save(evenement);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, evenement.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /evenements/:id} : Partial updates given fields of an existing evenement, field will ignore if it is null
     *
     * @param id the id of the evenement to save.
     * @param evenement the evenement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated evenement,
     * or with status {@code 400 (Bad Request)} if the evenement is not valid,
     * or with status {@code 404 (Not Found)} if the evenement is not found,
     * or with status {@code 500 (Internal Server Error)} if the evenement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/evenements/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Evenement> partialUpdateEvenement(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Evenement evenement
    ) throws URISyntaxException {
        log.debug("REST request to partial update Evenement partially : {}, {}", id, evenement);
        if (evenement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, evenement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!evenementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Evenement> result = evenementRepository
            .findById(evenement.getId())
            .map(existingEvenement -> {
                if (evenement.getTitre() != null) {
                    existingEvenement.setTitre(evenement.getTitre());
                }
                if (evenement.getDescription() != null) {
                    existingEvenement.setDescription(evenement.getDescription());
                }
                if (evenement.getDateDebut() != null) {
                    existingEvenement.setDateDebut(evenement.getDateDebut());
                }
                if (evenement.getDateFin() != null) {
                    existingEvenement.setDateFin(evenement.getDateFin());
                }
                if (evenement.getLieu() != null) {
                    existingEvenement.setLieu(evenement.getLieu());
                }

                return existingEvenement;
            })
            .map(evenementRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, evenement.getId().toString())
        );
    }

    /**
     * {@code GET  /evenements} : get all the evenements.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of evenements in body.
     */
    @GetMapping("/evenements")
    public List<Evenement> getAllEvenements(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Evenements");
        if (eagerload) {
            return evenementRepository.findAllWithEagerRelationships();
        } else {
            return evenementRepository.findAll();
        }
    }

    /**
     * {@code GET  /evenements/:id} : get the "id" evenement.
     *
     * @param id the id of the evenement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the evenement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/evenements/{id}")
    public ResponseEntity<Evenement> getEvenement(@PathVariable Long id) {
        log.debug("REST request to get Evenement : {}", id);
        Optional<Evenement> evenement = evenementRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(evenement);
    }

    /**
     * {@code DELETE  /evenements/:id} : delete the "id" evenement.
     *
     * @param id the id of the evenement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/evenements/{id}")
    public ResponseEntity<Void> deleteEvenement(@PathVariable Long id) {
        log.debug("REST request to delete Evenement : {}", id);
        evenementRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
