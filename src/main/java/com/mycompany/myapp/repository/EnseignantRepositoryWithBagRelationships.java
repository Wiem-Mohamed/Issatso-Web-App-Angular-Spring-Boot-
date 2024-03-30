package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Enseignant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface EnseignantRepositoryWithBagRelationships {
    Optional<Enseignant> fetchBagRelationships(Optional<Enseignant> enseignant);

    List<Enseignant> fetchBagRelationships(List<Enseignant> enseignants);

    Page<Enseignant> fetchBagRelationships(Page<Enseignant> enseignants);
}
