package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Evenement;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class EvenementRepositoryWithBagRelationshipsImpl implements EvenementRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Evenement> fetchBagRelationships(Optional<Evenement> evenement) {
        return evenement.map(this::fetchPartenaires);
    }

    @Override
    public Page<Evenement> fetchBagRelationships(Page<Evenement> evenements) {
        return new PageImpl<>(fetchBagRelationships(evenements.getContent()), evenements.getPageable(), evenements.getTotalElements());
    }

    @Override
    public List<Evenement> fetchBagRelationships(List<Evenement> evenements) {
        return Optional.of(evenements).map(this::fetchPartenaires).orElse(Collections.emptyList());
    }

    Evenement fetchPartenaires(Evenement result) {
        return entityManager
            .createQuery(
                "select evenement from Evenement evenement left join fetch evenement.partenaires where evenement.id = :id",
                Evenement.class
            )
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<Evenement> fetchPartenaires(List<Evenement> evenements) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, evenements.size()).forEach(index -> order.put(evenements.get(index).getId(), index));
        List<Evenement> result = entityManager
            .createQuery(
                "select evenement from Evenement evenement left join fetch evenement.partenaires where evenement in :evenements",
                Evenement.class
            )
            .setParameter("evenements", evenements)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
