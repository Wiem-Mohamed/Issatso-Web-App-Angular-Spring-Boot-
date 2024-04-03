package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Evenement;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface EvenementRepositoryWithBagRelationships {
    Optional<Evenement> fetchBagRelationships(Optional<Evenement> evenement);

    List<Evenement> fetchBagRelationships(List<Evenement> evenements);

    Page<Evenement> fetchBagRelationships(Page<Evenement> evenements);
}
