package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Partenaire.
 */
@Entity
@Table(name = "partenaire")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Partenaire implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "domaine_activite")
    private String domaineActivite;

    @Column(name = "adresse")
    private String adresse;

    @Column(name = "contact")
    private String contact;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_partenaire__evenement",
        joinColumns = @JoinColumn(name = "partenaire_id"),
        inverseJoinColumns = @JoinColumn(name = "evenement_id")
    )
    @JsonIgnoreProperties(value = { "partenaires" }, allowSetters = true)
    private Set<Evenement> evenements = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Partenaire id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Partenaire nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return this.description;
    }

    public Partenaire description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDomaineActivite() {
        return this.domaineActivite;
    }

    public Partenaire domaineActivite(String domaineActivite) {
        this.setDomaineActivite(domaineActivite);
        return this;
    }

    public void setDomaineActivite(String domaineActivite) {
        this.domaineActivite = domaineActivite;
    }

    public String getAdresse() {
        return this.adresse;
    }

    public Partenaire adresse(String adresse) {
        this.setAdresse(adresse);
        return this;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getContact() {
        return this.contact;
    }

    public Partenaire contact(String contact) {
        this.setContact(contact);
        return this;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public Set<Evenement> getEvenements() {
        return this.evenements;
    }

    public void setEvenements(Set<Evenement> evenements) {
        this.evenements = evenements;
    }

    public Partenaire evenements(Set<Evenement> evenements) {
        this.setEvenements(evenements);
        return this;
    }

    public Partenaire addEvenement(Evenement evenement) {
        this.evenements.add(evenement);
        evenement.getPartenaires().add(this);
        return this;
    }

    public Partenaire removeEvenement(Evenement evenement) {
        this.evenements.remove(evenement);
        evenement.getPartenaires().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Partenaire)) {
            return false;
        }
        return id != null && id.equals(((Partenaire) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Partenaire{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", description='" + getDescription() + "'" +
            ", domaineActivite='" + getDomaineActivite() + "'" +
            ", adresse='" + getAdresse() + "'" +
            ", contact='" + getContact() + "'" +
            "}";
    }
}
