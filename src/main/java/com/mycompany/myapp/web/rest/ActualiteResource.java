package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Actualite;
import com.mycompany.myapp.repository.ActualiteRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Actualite}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ActualiteResource {

    private final Logger log = LoggerFactory.getLogger(ActualiteResource.class);

    private static final String ENTITY_NAME = "actualite";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ActualiteRepository actualiteRepository;

    public ActualiteResource(ActualiteRepository actualiteRepository) {
        this.actualiteRepository = actualiteRepository;
    }

    /**
     * {@code POST  /actualites} : Create a new actualite.
     *
     * @param actualite the actualite to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new actualite, or with status {@code 400 (Bad Request)} if the actualite has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/actualites")
    public ResponseEntity<Actualite> createActualite(@RequestBody Actualite actualite) throws URISyntaxException {
        log.debug("REST request to save Actualite : {}", actualite);
        if (actualite.getId() != null) {
            throw new BadRequestAlertException("A new actualite cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Actualite result = actualiteRepository.save(actualite);
        return ResponseEntity
            .created(new URI("/api/actualites/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /actualites/:id} : Updates an existing actualite.
     *
     * @param id the id of the actualite to save.
     * @param actualite the actualite to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated actualite,
     * or with status {@code 400 (Bad Request)} if the actualite is not valid,
     * or with status {@code 500 (Internal Server Error)} if the actualite couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/actualites/{id}")
    public ResponseEntity<Actualite> updateActualite(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Actualite actualite
    ) throws URISyntaxException {
        log.debug("REST request to update Actualite : {}, {}", id, actualite);
        if (actualite.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, actualite.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!actualiteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Actualite result = actualiteRepository.save(actualite);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, actualite.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /actualites/:id} : Partial updates given fields of an existing actualite, field will ignore if it is null
     *
     * @param id the id of the actualite to save.
     * @param actualite the actualite to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated actualite,
     * or with status {@code 400 (Bad Request)} if the actualite is not valid,
     * or with status {@code 404 (Not Found)} if the actualite is not found,
     * or with status {@code 500 (Internal Server Error)} if the actualite couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/actualites/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Actualite> partialUpdateActualite(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Actualite actualite
    ) throws URISyntaxException {
        log.debug("REST request to partial update Actualite partially : {}, {}", id, actualite);
        if (actualite.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, actualite.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!actualiteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Actualite> result = actualiteRepository
            .findById(actualite.getId())
            .map(existingActualite -> {
                if (actualite.getTitre() != null) {
                    existingActualite.setTitre(actualite.getTitre());
                }
                if (actualite.getImage() != null) {
                    existingActualite.setImage(actualite.getImage());
                }
                if (actualite.getImageContentType() != null) {
                    existingActualite.setImageContentType(actualite.getImageContentType());
                }
                if (actualite.getContenu() != null) {
                    existingActualite.setContenu(actualite.getContenu());
                }
                if (actualite.getDatePublication() != null) {
                    existingActualite.setDatePublication(actualite.getDatePublication());
                }

                return existingActualite;
            })
            .map(actualiteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, actualite.getId().toString())
        );
    }

    /**
     * {@code GET  /actualites} : get all the actualites.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of actualites in body.
     */
    @GetMapping("/actualites")
    public List<Actualite> getAllActualites() {
        log.debug("REST request to get all Actualites");
        return actualiteRepository.findAll();
    }

    /**
     * {@code GET  /actualites/:id} : get the "id" actualite.
     *
     * @param id the id of the actualite to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the actualite, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/actualites/{id}")
    public ResponseEntity<Actualite> getActualite(@PathVariable Long id) {
        log.debug("REST request to get Actualite : {}", id);
        Optional<Actualite> actualite = actualiteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(actualite);
    }

    /**
     * {@code DELETE  /actualites/:id} : delete the "id" actualite.
     *
     * @param id the id of the actualite to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/actualites/{id}")
    public ResponseEntity<Void> deleteActualite(@PathVariable Long id) {
        log.debug("REST request to delete Actualite : {}", id);
        actualiteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
