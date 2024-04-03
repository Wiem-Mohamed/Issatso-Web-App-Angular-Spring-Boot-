package com.mycompany.myapp.domain;

import com.mycompany.myapp.domain.enumeration.Status;
import com.mycompany.myapp.domain.enumeration.SujetEns;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;

/**
 * A DemandeEnseignant.
 */
@Entity
@Table(name = "demande_enseignant")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DemandeEnseignant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "sujet")
    private SujetEns sujet;

    @Lob
    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut")
    private Status statut;

    @Column(name = "date_creation")
    private Instant dateCreation;

    @Column(name = "proprietaire")
    private String proprietaire;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DemandeEnseignant id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SujetEns getSujet() {
        return this.sujet;
    }

    public DemandeEnseignant sujet(SujetEns sujet) {
        this.setSujet(sujet);
        return this;
    }

    public void setSujet(SujetEns sujet) {
        this.sujet = sujet;
    }

    public String getDescription() {
        return this.description;
    }

    public DemandeEnseignant description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Status getStatut() {
        return this.statut;
    }

    public DemandeEnseignant statut(Status statut) {
        this.setStatut(statut);
        return this;
    }

    public void setStatut(Status statut) {
        this.statut = statut;
    }

    public Instant getDateCreation() {
        return this.dateCreation;
    }

    public DemandeEnseignant dateCreation(Instant dateCreation) {
        this.setDateCreation(dateCreation);
        return this;
    }

    public void setDateCreation(Instant dateCreation) {
        this.dateCreation = dateCreation;
    }

    public String getProprietaire() {
        return this.proprietaire;
    }

    public DemandeEnseignant proprietaire(String proprietaire) {
        this.setProprietaire(proprietaire);
        return this;
    }

    public void setProprietaire(String proprietaire) {
        this.proprietaire = proprietaire;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DemandeEnseignant)) {
            return false;
        }
        return id != null && id.equals(((DemandeEnseignant) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DemandeEnseignant{" +
            "id=" + getId() +
            ", sujet='" + getSujet() + "'" +
            ", description='" + getDescription() + "'" +
            ", statut='" + getStatut() + "'" +
            ", dateCreation='" + getDateCreation() + "'" +
            ", proprietaire='" + getProprietaire() + "'" +
            "}";
    }
}
