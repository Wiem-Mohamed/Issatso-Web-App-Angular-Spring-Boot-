package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Etudiant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Etudiant entity.
 */
@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {
    default Optional<Etudiant> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Etudiant> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Etudiant> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select etudiant from Etudiant etudiant left join fetch etudiant.groupe",
        countQuery = "select count(etudiant) from Etudiant etudiant"
    )
    Page<Etudiant> findAllWithToOneRelationships(Pageable pageable);

    @Query("select etudiant from Etudiant etudiant left join fetch etudiant.groupe")
    List<Etudiant> findAllWithToOneRelationships();

    @Query("select etudiant from Etudiant etudiant left join fetch etudiant.groupe where etudiant.id =:id")
    Optional<Etudiant> findOneWithToOneRelationships(@Param("id") Long id);

    Optional<Etudiant> findByNumInscription(String numInscription);

    @Query("SELECT e.id FROM Etudiant e WHERE e.email = :email")
    Long findIdByEmailEtudiant(@Param("email") String email);

    @Query("SELECT e.groupe.id FROM Etudiant e WHERE e.id = :etudiantId")
    Long findGroupIdByEtudiantId(@Param("etudiantId") Long etudiantId);

    @Query("SELECT e FROM Etudiant e WHERE e.groupe.id = (SELECT e2.groupe.id FROM Etudiant e2 WHERE e2.id = :etudiantId)")
    List<Etudiant> findEtudiantsBySameGroupe(@Param("etudiantId") Long etudiantId);
}
