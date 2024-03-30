package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Partenaire;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface PartenaireRepositoryWithBagRelationships {
    Optional<Partenaire> fetchBagRelationships(Optional<Partenaire> partenaire);

    List<Partenaire> fetchBagRelationships(List<Partenaire> partenaires);

    Page<Partenaire> fetchBagRelationships(Page<Partenaire> partenaires);
}
