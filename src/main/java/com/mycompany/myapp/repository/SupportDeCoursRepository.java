package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.SupportDeCours;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SupportDeCours entity.
 */
@Repository
public interface SupportDeCoursRepository extends JpaRepository<SupportDeCours, Long> {
    default Optional<SupportDeCours> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<SupportDeCours> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<SupportDeCours> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select supportDeCours from SupportDeCours supportDeCours left join fetch supportDeCours.matiere",
        countQuery = "select count(supportDeCours) from SupportDeCours supportDeCours"
    )
    Page<SupportDeCours> findAllWithToOneRelationships(Pageable pageable);

    @Query("select supportDeCours from SupportDeCours supportDeCours left join fetch supportDeCours.matiere")
    List<SupportDeCours> findAllWithToOneRelationships();

    @Query("select supportDeCours from SupportDeCours supportDeCours left join fetch supportDeCours.matiere where supportDeCours.id =:id")
    Optional<SupportDeCours> findOneWithToOneRelationships(@Param("id") Long id);
}
