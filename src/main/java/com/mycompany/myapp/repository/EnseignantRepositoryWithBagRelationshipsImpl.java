package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Enseignant;
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
public class EnseignantRepositoryWithBagRelationshipsImpl implements EnseignantRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Enseignant> fetchBagRelationships(Optional<Enseignant> enseignant) {
        return enseignant.map(this::fetchGroupes);
    }

    @Override
    public Page<Enseignant> fetchBagRelationships(Page<Enseignant> enseignants) {
        return new PageImpl<>(fetchBagRelationships(enseignants.getContent()), enseignants.getPageable(), enseignants.getTotalElements());
    }

    @Override
    public List<Enseignant> fetchBagRelationships(List<Enseignant> enseignants) {
        return Optional.of(enseignants).map(this::fetchGroupes).orElse(Collections.emptyList());
    }

    Enseignant fetchGroupes(Enseignant result) {
        return entityManager
            .createQuery(
                "select enseignant from Enseignant enseignant left join fetch enseignant.groupes where enseignant.id = :id",
                Enseignant.class
            )
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<Enseignant> fetchGroupes(List<Enseignant> enseignants) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, enseignants.size()).forEach(index -> order.put(enseignants.get(index).getId(), index));
        List<Enseignant> result = entityManager
            .createQuery(
                "select enseignant from Enseignant enseignant left join fetch enseignant.groupes where enseignant in :enseignants",
                Enseignant.class
            )
            .setParameter("enseignants", enseignants)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
