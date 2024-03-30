package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.DemandeEtudiant;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the DemandeEtudiant entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DemandeEtudiantRepository extends JpaRepository<DemandeEtudiant, Long> {}
