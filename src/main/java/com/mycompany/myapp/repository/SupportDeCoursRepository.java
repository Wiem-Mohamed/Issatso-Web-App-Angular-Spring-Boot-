package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.SupportDeCours;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SupportDeCours entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SupportDeCoursRepository extends JpaRepository<SupportDeCours, Long> {}
