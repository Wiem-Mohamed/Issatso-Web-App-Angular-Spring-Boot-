package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

/**
 * A Evenement.
 */
@Entity
@Table(name = "evenement")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Evenement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "titre")
    private String titre;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "date_debut")
    private Instant dateDebut;

    @Column(name = "date_fin")
    private Instant dateFin;

    @Column(name = "lieu")
    private String lieu;

    @Column(name = "organisateur")
    private String organisateur;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "evenements")
    @JsonIgnoreProperties(value = { "evenements" }, allowSetters = true)
    private Set<Partenaire> partenaires = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Evenement id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return this.titre;
    }

    public Evenement titre(String titre) {
        this.setTitre(titre);
        return this;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return this.description;
    }

    public Evenement description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getDateDebut() {
        return this.dateDebut;
    }

    public Evenement dateDebut(Instant dateDebut) {
        this.setDateDebut(dateDebut);
        return this;
    }

    public void setDateDebut(Instant dateDebut) {
        this.dateDebut = dateDebut;
    }

    public Instant getDateFin() {
        return this.dateFin;
    }

    public Evenement dateFin(Instant dateFin) {
        this.setDateFin(dateFin);
        return this;
    }

    public void setDateFin(Instant dateFin) {
        this.dateFin = dateFin;
    }

    public String getLieu() {
        return this.lieu;
    }

    public Evenement lieu(String lieu) {
        this.setLieu(lieu);
        return this;
    }

    public void setLieu(String lieu) {
        this.lieu = lieu;
    }

    public String getOrganisateur() {
        return this.organisateur;
    }

    public Evenement organisateur(String organisateur) {
        this.setOrganisateur(organisateur);
        return this;
    }

    public void setOrganisateur(String organisateur) {
        this.organisateur = organisateur;
    }

    public Set<Partenaire> getPartenaires() {
        return this.partenaires;
    }

    public void setPartenaires(Set<Partenaire> partenaires) {
        if (this.partenaires != null) {
            this.partenaires.forEach(i -> i.removeEvenement(this));
        }
        if (partenaires != null) {
            partenaires.forEach(i -> i.addEvenement(this));
        }
        this.partenaires = partenaires;
    }

    public Evenement partenaires(Set<Partenaire> partenaires) {
        this.setPartenaires(partenaires);
        return this;
    }

    public Evenement addPartenaire(Partenaire partenaire) {
        this.partenaires.add(partenaire);
        partenaire.getEvenements().add(this);
        return this;
    }

    public Evenement removePartenaire(Partenaire partenaire) {
        this.partenaires.remove(partenaire);
        partenaire.getEvenements().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Evenement)) {
            return false;
        }
        return id != null && id.equals(((Evenement) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Evenement{" +
            "id=" + getId() +
            ", titre='" + getTitre() + "'" +
            ", description='" + getDescription() + "'" +
            ", dateDebut='" + getDateDebut() + "'" +
            ", dateFin='" + getDateFin() + "'" +
            ", lieu='" + getLieu() + "'" +
            ", organisateur='" + getOrganisateur() + "'" +
            "}";
    }
}
