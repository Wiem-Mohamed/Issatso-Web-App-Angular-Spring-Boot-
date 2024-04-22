package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Groupe;
import com.mycompany.myapp.domain.enumeration.Filiere;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Groupe entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GroupeRepository extends JpaRepository<Groupe, Long> {
    @Query("SELECT g.filiere FROM Groupe g JOIN g.etudiants e WHERE e.id = :etudiantId")
    String findFiliereByEtudiantId(@Param("etudiantId") Long etudiantId);
}
