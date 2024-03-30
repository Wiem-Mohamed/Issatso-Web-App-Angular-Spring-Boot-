package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.OffreStage;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the OffreStage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OffreStageRepository extends JpaRepository<OffreStage, Long> {}
