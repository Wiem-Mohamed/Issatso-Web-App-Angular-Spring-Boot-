package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.OffreStage;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the OffreStage entity.
 */
@Repository
public interface OffreStageRepository extends JpaRepository<OffreStage, Long> {
    default Optional<OffreStage> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<OffreStage> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<OffreStage> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select offreStage from OffreStage offreStage left join fetch offreStage.departement",
        countQuery = "select count(offreStage) from OffreStage offreStage"
    )
    Page<OffreStage> findAllWithToOneRelationships(Pageable pageable);

    @Query("select offreStage from OffreStage offreStage left join fetch offreStage.departement")
    List<OffreStage> findAllWithToOneRelationships();

    @Query("select offreStage from OffreStage offreStage left join fetch offreStage.departement where offreStage.id =:id")
    Optional<OffreStage> findOneWithToOneRelationships(@Param("id") Long id);
}
