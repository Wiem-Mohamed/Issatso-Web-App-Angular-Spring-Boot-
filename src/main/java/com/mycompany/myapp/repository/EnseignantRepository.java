package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Enseignant;
import com.mycompany.myapp.domain.Etudiant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Enseignant entity.
 *
 * When extending this class, extend EnseignantRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface EnseignantRepository extends EnseignantRepositoryWithBagRelationships, JpaRepository<Enseignant, Long> {
    default Optional<Enseignant> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<Enseignant> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<Enseignant> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }

    Optional<Enseignant> findByCin(String cin);

    @Query("SELECT e.id FROM Enseignant e WHERE e.email = :email")
    Long findIdByEmail(@Param("email") String email);

    Optional<Enseignant> findByEmail(String email);
}
