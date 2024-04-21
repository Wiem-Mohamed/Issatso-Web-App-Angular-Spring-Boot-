package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.Filiere;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Groupe.
 */
@Entity
@Table(name = "groupe")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Groupe implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nom_groupe")
    private String nomGroupe;

    @Enumerated(EnumType.STRING)
    @Column(name = "filiere")
    private Filiere filiere;

    @Column(name = "niveau")
    private Integer niveau;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "groupe")
    @JsonIgnoreProperties(value = { "groupe" }, allowSetters = true)
    private Set<Etudiant> etudiants = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "groupes")
    @JsonIgnoreProperties(value = { "matieres", "groupes", "departement" }, allowSetters = true)
    private Set<Enseignant> enseigants = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Groupe id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomGroupe() {
        return this.nomGroupe;
    }

    public Groupe nomGroupe(String nomGroupe) {
        this.setNomGroupe(nomGroupe);
        return this;
    }

    public void setNomGroupe(String nomGroupe) {
        this.nomGroupe = nomGroupe;
    }

    public Filiere getFiliere() {
        return this.filiere;
    }

    public Groupe filiere(Filiere filiere) {
        this.setFiliere(filiere);
        return this;
    }

    public void setFiliere(Filiere filiere) {
        this.filiere = filiere;
    }

    public Integer getNiveau() {
        return this.niveau;
    }

    public Groupe niveau(Integer niveau) {
        this.setNiveau(niveau);
        return this;
    }

    public void setNiveau(Integer niveau) {
        this.niveau = niveau;
    }

    public Set<Etudiant> getEtudiants() {
        return this.etudiants;
    }

    public void setEtudiants(Set<Etudiant> etudiants) {
        if (this.etudiants != null) {
            this.etudiants.forEach(i -> i.setGroupe(null));
        }
        if (etudiants != null) {
            etudiants.forEach(i -> i.setGroupe(this));
        }
        this.etudiants = etudiants;
    }

    public Groupe etudiants(Set<Etudiant> etudiants) {
        this.setEtudiants(etudiants);
        return this;
    }

    public Groupe addEtudiant(Etudiant etudiant) {
        this.etudiants.add(etudiant);
        etudiant.setGroupe(this);
        return this;
    }

    public Groupe removeEtudiant(Etudiant etudiant) {
        this.etudiants.remove(etudiant);
        etudiant.setGroupe(null);
        return this;
    }

    public Set<Enseignant> getEnseigants() {
        return this.enseigants;
    }

    public void setEnseigants(Set<Enseignant> enseignants) {
        if (this.enseigants != null) {
            this.enseigants.forEach(i -> i.removeGroupe(this));
        }
        if (enseignants != null) {
            enseignants.forEach(i -> i.addGroupe(this));
        }
        this.enseigants = enseignants;
    }

    public Groupe enseigants(Set<Enseignant> enseignants) {
        this.setEnseigants(enseignants);
        return this;
    }

    public Groupe addEnseigant(Enseignant enseignant) {
        this.enseigants.add(enseignant);
        enseignant.getGroupes().add(this);
        return this;
    }

    public Groupe removeEnseigant(Enseignant enseignant) {
        this.enseigants.remove(enseignant);
        enseignant.getGroupes().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Groupe)) {
            return false;
        }
        return id != null && id.equals(((Groupe) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Groupe{" +
            "id=" + getId() +
            ", nomGroupe='" + getNomGroupe() + "'" +
            ", filiere='" + getFiliere() + "'" +
            ", niveau=" + getNiveau() +
            "}";
    }
}
