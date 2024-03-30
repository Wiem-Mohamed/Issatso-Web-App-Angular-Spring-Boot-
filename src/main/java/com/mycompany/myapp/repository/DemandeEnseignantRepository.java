package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.DemandeEnseignant;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the DemandeEnseignant entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DemandeEnseignantRepository extends JpaRepository<DemandeEnseignant, Long> {}
