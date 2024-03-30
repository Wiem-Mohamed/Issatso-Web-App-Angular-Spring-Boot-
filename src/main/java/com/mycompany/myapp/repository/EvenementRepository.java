package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Evenement;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Evenement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EvenementRepository extends JpaRepository<Evenement, Long> {}
