package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.Domaine;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;

/**
 * A OffreStage.
 */
@Entity
@Table(name = "offre_stage")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class OffreStage implements Serializable {

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

    @Enumerated(EnumType.STRING)
    @Column(name = "domaine")
    private Domaine domaine;

    @Column(name = "date_debut")
    private Instant dateDebut;

    @Column(name = "date_fin")
    private Instant dateFin;

    @Column(name = "entreprise")
    private String entreprise;

    @Column(name = "lieu")
    private String lieu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "chefDepartement" }, allowSetters = true)
    private Departement departement;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public OffreStage id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return this.titre;
    }

    public OffreStage titre(String titre) {
        this.setTitre(titre);
        return this;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return this.description;
    }

    public OffreStage description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Domaine getDomaine() {
        return this.domaine;
    }

    public OffreStage domaine(Domaine domaine) {
        this.setDomaine(domaine);
        return this;
    }

    public void setDomaine(Domaine domaine) {
        this.domaine = domaine;
    }

    public Instant getDateDebut() {
        return this.dateDebut;
    }

    public OffreStage dateDebut(Instant dateDebut) {
        this.setDateDebut(dateDebut);
        return this;
    }

    public void setDateDebut(Instant dateDebut) {
        this.dateDebut = dateDebut;
    }

    public Instant getDateFin() {
        return this.dateFin;
    }

    public OffreStage dateFin(Instant dateFin) {
        this.setDateFin(dateFin);
        return this;
    }

    public void setDateFin(Instant dateFin) {
        this.dateFin = dateFin;
    }

    public String getEntreprise() {
        return this.entreprise;
    }

    public OffreStage entreprise(String entreprise) {
        this.setEntreprise(entreprise);
        return this;
    }

    public void setEntreprise(String entreprise) {
        this.entreprise = entreprise;
    }

    public String getLieu() {
        return this.lieu;
    }

    public OffreStage lieu(String lieu) {
        this.setLieu(lieu);
        return this;
    }

    public void setLieu(String lieu) {
        this.lieu = lieu;
    }

    public Departement getDepartement() {
        return this.departement;
    }

    public void setDepartement(Departement departement) {
        this.departement = departement;
    }

    public OffreStage departement(Departement departement) {
        this.setDepartement(departement);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OffreStage)) {
            return false;
        }
        return id != null && id.equals(((OffreStage) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OffreStage{" +
            "id=" + getId() +
            ", titre='" + getTitre() + "'" +
            ", description='" + getDescription() + "'" +
            ", domaine='" + getDomaine() + "'" +
            ", dateDebut='" + getDateDebut() + "'" +
            ", dateFin='" + getDateFin() + "'" +
            ", entreprise='" + getEntreprise() + "'" +
            ", lieu='" + getLieu() + "'" +
            "}";
    }
}
