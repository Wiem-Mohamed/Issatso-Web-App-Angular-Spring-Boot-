package com.mycompany.myapp.domain;

import com.mycompany.myapp.domain.enumeration.Status;
import com.mycompany.myapp.domain.enumeration.SujetEtud;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;

/**
 * A DemandeEtudiant.
 */
@Entity
@Table(name = "demande_etudiant")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DemandeEtudiant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "sujet")
    private SujetEtud sujet;

    @Lob
    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut")
    private Status statut;

    @Column(name = "date_creation")
    private Instant dateCreation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DemandeEtudiant id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SujetEtud getSujet() {
        return this.sujet;
    }

    public DemandeEtudiant sujet(SujetEtud sujet) {
        this.setSujet(sujet);
        return this;
    }

    public void setSujet(SujetEtud sujet) {
        this.sujet = sujet;
    }

    public String getDescription() {
        return this.description;
    }

    public DemandeEtudiant description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Status getStatut() {
        return this.statut;
    }

    public DemandeEtudiant statut(Status statut) {
        this.setStatut(statut);
        return this;
    }

    public void setStatut(Status statut) {
        this.statut = statut;
    }

    public Instant getDateCreation() {
        return this.dateCreation;
    }

    public DemandeEtudiant dateCreation(Instant dateCreation) {
        this.setDateCreation(dateCreation);
        return this;
    }

    public void setDateCreation(Instant dateCreation) {
        this.dateCreation = dateCreation;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DemandeEtudiant)) {
            return false;
        }
        return id != null && id.equals(((DemandeEtudiant) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DemandeEtudiant{" +
            "id=" + getId() +
            ", sujet='" + getSujet() + "'" +
            ", description='" + getDescription() + "'" +
            ", statut='" + getStatut() + "'" +
            ", dateCreation='" + getDateCreation() + "'" +
            "}";
    }
}
