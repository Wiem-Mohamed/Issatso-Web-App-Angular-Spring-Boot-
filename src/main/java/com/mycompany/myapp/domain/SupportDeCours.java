package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.Filiere;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;

/**
 * A SupportDeCours.
 */
@Entity
@Table(name = "support_de_cours")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SupportDeCours implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "titre")
    private String titre;

    @Column(name = "description")
    private String description;

    @Lob
    @Column(name = "contenu")
    private byte[] contenu;

    @Column(name = "contenu_content_type")
    private String contenuContentType;

    @Column(name = "date_depot")
    private Instant dateDepot;

    @Enumerated(EnumType.STRING)
    @Column(name = "filiere")
    private Filiere filiere;

    @Column(name = "niveau")
    private Integer niveau;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "supportDeCours", "enseignant" }, allowSetters = true)
    private Matiere matiere;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SupportDeCours id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return this.titre;
    }

    public SupportDeCours titre(String titre) {
        this.setTitre(titre);
        return this;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return this.description;
    }

    public SupportDeCours description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public byte[] getContenu() {
        return this.contenu;
    }

    public SupportDeCours contenu(byte[] contenu) {
        this.setContenu(contenu);
        return this;
    }

    public void setContenu(byte[] contenu) {
        this.contenu = contenu;
    }

    public String getContenuContentType() {
        return this.contenuContentType;
    }

    public SupportDeCours contenuContentType(String contenuContentType) {
        this.contenuContentType = contenuContentType;
        return this;
    }

    public void setContenuContentType(String contenuContentType) {
        this.contenuContentType = contenuContentType;
    }

    public Instant getDateDepot() {
        return this.dateDepot;
    }

    public SupportDeCours dateDepot(Instant dateDepot) {
        this.setDateDepot(dateDepot);
        return this;
    }

    public void setDateDepot(Instant dateDepot) {
        this.dateDepot = dateDepot;
    }

    public Filiere getFiliere() {
        return this.filiere;
    }

    public SupportDeCours filiere(Filiere filiere) {
        this.setFiliere(filiere);
        return this;
    }

    public void setFiliere(Filiere filiere) {
        this.filiere = filiere;
    }

    public Integer getNiveau() {
        return this.niveau;
    }

    public SupportDeCours niveau(Integer niveau) {
        this.setNiveau(niveau);
        return this;
    }

    public void setNiveau(Integer niveau) {
        this.niveau = niveau;
    }

    public Matiere getMatiere() {
        return this.matiere;
    }

    public void setMatiere(Matiere matiere) {
        this.matiere = matiere;
    }

    public SupportDeCours matiere(Matiere matiere) {
        this.setMatiere(matiere);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SupportDeCours)) {
            return false;
        }
        return id != null && id.equals(((SupportDeCours) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SupportDeCours{" +
            "id=" + getId() +
            ", titre='" + getTitre() + "'" +
            ", description='" + getDescription() + "'" +
            ", contenu='" + getContenu() + "'" +
            ", contenuContentType='" + getContenuContentType() + "'" +
            ", dateDepot='" + getDateDepot() + "'" +
            ", filiere='" + getFiliere() + "'" +
            ", niveau=" + getNiveau() +
            "}";
    }
}
