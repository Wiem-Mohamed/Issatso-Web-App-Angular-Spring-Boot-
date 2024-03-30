package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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

    @Column(name = "contenu")
    private String contenu;

    @Column(name = "date_depot")
    private Instant dateDepot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "supportDeCours", "nomEnseigant" }, allowSetters = true)
    private Matiere nomMatiere;

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

    public String getContenu() {
        return this.contenu;
    }

    public SupportDeCours contenu(String contenu) {
        this.setContenu(contenu);
        return this;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
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

    public Matiere getNomMatiere() {
        return this.nomMatiere;
    }

    public void setNomMatiere(Matiere matiere) {
        this.nomMatiere = matiere;
    }

    public SupportDeCours nomMatiere(Matiere matiere) {
        this.setNomMatiere(matiere);
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
            ", dateDepot='" + getDateDepot() + "'" +
            "}";
    }
}
