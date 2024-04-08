package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Enseignant;
import com.mycompany.myapp.domain.Etudiant;
import com.mycompany.myapp.repository.EnseignantRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import com.mycompany.myapp.web.rest.errors.CinAlreadyUsedException;
import com.mycompany.myapp.web.rest.errors.NumInscriptionAlreadyUsedException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Enseignant}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EnseignantResource {

    private final Logger log = LoggerFactory.getLogger(EnseignantResource.class);

    private static final String ENTITY_NAME = "enseignant";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EnseignantRepository enseignantRepository;

    public EnseignantResource(EnseignantRepository enseignantRepository) {
        this.enseignantRepository = enseignantRepository;
    }

    /**
     * {@code POST  /enseignants} : Create a new enseignant.
     *
     * @param enseignant the enseignant to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new enseignant, or with status {@code 400 (Bad Request)} if the enseignant has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/enseignants")
    public ResponseEntity<Enseignant> createEnseignant(@RequestBody Enseignant enseignant) throws URISyntaxException {
        log.debug("REST request to save Enseignant : {}", enseignant);

        // Vérifier si un enseignant avec le même cin existe déjà
        Optional<Enseignant> existingEnseignant = enseignantRepository.findByCin(enseignant.getCin());
        if (existingEnseignant.isPresent()) {
            throw new CinAlreadyUsedException();
        }

        if (enseignant.getId() != null) {
            throw new BadRequestAlertException("A new enseignant cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Enseignant result = enseignantRepository.save(enseignant);
        return ResponseEntity
            .created(new URI("/api/enseignants/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /enseignants/:id} : Updates an existing enseignant.
     *
     * @param id the id of the enseignant to save.
     * @param enseignant the enseignant to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated enseignant,
     * or with status {@code 400 (Bad Request)} if the enseignant is not valid,
     * or with status {@code 500 (Internal Server Error)} if the enseignant couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/enseignants/{id}")
    public ResponseEntity<Enseignant> updateEnseignant(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Enseignant enseignant
    ) throws URISyntaxException {
        log.debug("REST request to update Enseignant : {}, {}", id, enseignant);
        if (enseignant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, enseignant.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!enseignantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Enseignant result = enseignantRepository.save(enseignant);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, enseignant.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /enseignants/:id} : Partial updates given fields of an existing enseignant, field will ignore if it is null
     *
     * @param id the id of the enseignant to save.
     * @param enseignant the enseignant to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated enseignant,
     * or with status {@code 400 (Bad Request)} if the enseignant is not valid,
     * or with status {@code 404 (Not Found)} if the enseignant is not found,
     * or with status {@code 500 (Internal Server Error)} if the enseignant couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/enseignants/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Enseignant> partialUpdateEnseignant(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Enseignant enseignant
    ) throws URISyntaxException {
        log.debug("REST request to partial update Enseignant partially : {}, {}", id, enseignant);
        if (enseignant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, enseignant.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!enseignantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Enseignant> result = enseignantRepository
            .findById(enseignant.getId())
            .map(existingEnseignant -> {
                if (enseignant.getNom() != null) {
                    existingEnseignant.setNom(enseignant.getNom());
                }
                if (enseignant.getPrenom() != null) {
                    existingEnseignant.setPrenom(enseignant.getPrenom());
                }
                if (enseignant.getCin() != null) {
                    existingEnseignant.setCin(enseignant.getCin());
                }
                if (enseignant.getEmail() != null) {
                    existingEnseignant.setEmail(enseignant.getEmail());
                }
                if (enseignant.getNumTel() != null) {
                    existingEnseignant.setNumTel(enseignant.getNumTel());
                }
                if (enseignant.getDateEmbauche() != null) {
                    existingEnseignant.setDateEmbauche(enseignant.getDateEmbauche());
                }
                if (enseignant.getGrade() != null) {
                    existingEnseignant.setGrade(enseignant.getGrade());
                }

                return existingEnseignant;
            })
            .map(enseignantRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, enseignant.getId().toString())
        );
    }

    /**
     * {@code GET  /enseignants} : get all the enseignants.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of enseignants in body.
     */
    @GetMapping("/enseignants")
    public List<Enseignant> getAllEnseignants(
        @RequestParam(required = false) String filter,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        if ("departement-is-null".equals(filter)) {
            log.debug("REST request to get all Enseignants where departement is null");
            return StreamSupport
                .stream(enseignantRepository.findAll().spliterator(), false)
                .filter(enseignant -> enseignant.getDepartement() == null)
                .toList();
        }
        log.debug("REST request to get all Enseignants");
        if (eagerload) {
            return enseignantRepository.findAllWithEagerRelationships();
        } else {
            return enseignantRepository.findAll();
        }
    }

    /**
     * {@code GET  /enseignants/:id} : get the "id" enseignant.
     *
     * @param id the id of the enseignant to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the enseignant, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/enseignants/{id}")
    public ResponseEntity<Enseignant> getEnseignant(@PathVariable Long id) {
        log.debug("REST request to get Enseignant : {}", id);
        Optional<Enseignant> enseignant = enseignantRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(enseignant);
    }

    /**
     * {@code DELETE  /enseignants/:id} : delete the "id" enseignant.
     *
     * @param id the id of the enseignant to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/enseignants/{id}")
    public ResponseEntity<Void> deleteEnseignant(@PathVariable Long id) {
        log.debug("REST request to delete Enseignant : {}", id);
        enseignantRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/mail/{email}")
    public ResponseEntity<Long> getEnseignantIdByEmail(@PathVariable String email) {
        log.debug("REST request to get Enseignant ID by email: {}", email);
        Long enseignantId = enseignantRepository.findIdByEmail(email);
        if (enseignantId != null) {
            return ResponseEntity.ok().body(enseignantId);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
