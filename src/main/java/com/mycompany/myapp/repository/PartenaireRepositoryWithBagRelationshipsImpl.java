package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Partenaire;
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
public class PartenaireRepositoryWithBagRelationshipsImpl implements PartenaireRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Partenaire> fetchBagRelationships(Optional<Partenaire> partenaire) {
        return partenaire.map(this::fetchEvenements);
    }

    @Override
    public Page<Partenaire> fetchBagRelationships(Page<Partenaire> partenaires) {
        return new PageImpl<>(fetchBagRelationships(partenaires.getContent()), partenaires.getPageable(), partenaires.getTotalElements());
    }

    @Override
    public List<Partenaire> fetchBagRelationships(List<Partenaire> partenaires) {
        return Optional.of(partenaires).map(this::fetchEvenements).orElse(Collections.emptyList());
    }

    Partenaire fetchEvenements(Partenaire result) {
        return entityManager
            .createQuery(
                "select partenaire from Partenaire partenaire left join fetch partenaire.evenements where partenaire.id = :id",
                Partenaire.class
            )
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<Partenaire> fetchEvenements(List<Partenaire> partenaires) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, partenaires.size()).forEach(index -> order.put(partenaires.get(index).getId(), index));
        List<Partenaire> result = entityManager
            .createQuery(
                "select partenaire from Partenaire partenaire left join fetch partenaire.evenements where partenaire in :partenaires",
                Partenaire.class
            )
            .setParameter("partenaires", partenaires)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
