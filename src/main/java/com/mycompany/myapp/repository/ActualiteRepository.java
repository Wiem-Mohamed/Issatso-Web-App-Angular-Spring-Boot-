package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Actualite;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Actualite entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ActualiteRepository extends JpaRepository<Actualite, Long> {}
