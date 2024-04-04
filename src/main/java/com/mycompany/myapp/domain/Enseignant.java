package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.Grade;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

/**
 * A Enseignant.
 */
@Entity
@Table(name = "enseignant")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Enseignant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "prenom")
    private String prenom;

    @Column(name = "cin")
    private String cin;

    @Column(name = "email")
    private String email;

    @Column(name = "num_tel")
    private String numTel;

    @Column(name = "date_embauche")
    private Instant dateEmbauche;

    @Enumerated(EnumType.STRING)
    @Column(name = "grade")
    private Grade grade;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "enseignant")
    @JsonIgnoreProperties(value = { "supportDeCours", "enseignant" }, allowSetters = true)
    private Set<Matiere> matieres = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_enseignant__groupe",
        joinColumns = @JoinColumn(name = "enseignant_id"),
        inverseJoinColumns = @JoinColumn(name = "groupe_id")
    )
    @JsonIgnoreProperties(value = { "etudiants", "enseigants" }, allowSetters = true)
    private Set<Groupe> groupes = new HashSet<>();

    @JsonIgnoreProperties(value = { "chefDepartement" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "chefDepartement")
    private Departement departement;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Enseignant id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Enseignant nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return this.prenom;
    }

    public Enseignant prenom(String prenom) {
        this.setPrenom(prenom);
        return this;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getCin() {
        return this.cin;
    }

    public Enseignant cin(String cin) {
        this.setCin(cin);
        return this;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public String getEmail() {
        return this.email;
    }

    public Enseignant email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNumTel() {
        return this.numTel;
    }

    public Enseignant numTel(String numTel) {
        this.setNumTel(numTel);
        return this;
    }

    public void setNumTel(String numTel) {
        this.numTel = numTel;
    }

    public Instant getDateEmbauche() {
        return this.dateEmbauche;
    }

    public Enseignant dateEmbauche(Instant dateEmbauche) {
        this.setDateEmbauche(dateEmbauche);
        return this;
    }

    public void setDateEmbauche(Instant dateEmbauche) {
        this.dateEmbauche = dateEmbauche;
    }

    public Grade getGrade() {
        return this.grade;
    }

    public Enseignant grade(Grade grade) {
        this.setGrade(grade);
        return this;
    }

    public void setGrade(Grade grade) {
        this.grade = grade;
    }

    public Set<Matiere> getMatieres() {
        return this.matieres;
    }

    public void setMatieres(Set<Matiere> matieres) {
        if (this.matieres != null) {
            this.matieres.forEach(i -> i.setEnseignant(null));
        }
        if (matieres != null) {
            matieres.forEach(i -> i.setEnseignant(this));
        }
        this.matieres = matieres;
    }

    public Enseignant matieres(Set<Matiere> matieres) {
        this.setMatieres(matieres);
        return this;
    }

    public Enseignant addMatiere(Matiere matiere) {
        this.matieres.add(matiere);
        matiere.setEnseignant(this);
        return this;
    }

    public Enseignant removeMatiere(Matiere matiere) {
        this.matieres.remove(matiere);
        matiere.setEnseignant(null);
        return this;
    }

    public Set<Groupe> getGroupes() {
        return this.groupes;
    }

    public void setGroupes(Set<Groupe> groupes) {
        this.groupes = groupes;
    }

    public Enseignant groupes(Set<Groupe> groupes) {
        this.setGroupes(groupes);
        return this;
    }

    public Enseignant addGroupe(Groupe groupe) {
        this.groupes.add(groupe);
        groupe.getEnseigants().add(this);
        return this;
    }

    public Enseignant removeGroupe(Groupe groupe) {
        this.groupes.remove(groupe);
        groupe.getEnseigants().remove(this);
        return this;
    }

    public Departement getDepartement() {
        return this.departement;
    }

    public void setDepartement(Departement departement) {
        if (this.departement != null) {
            this.departement.setChefDepartement(null);
        }
        if (departement != null) {
            departement.setChefDepartement(this);
        }
        this.departement = departement;
    }

    public Enseignant departement(Departement departement) {
        this.setDepartement(departement);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Enseignant)) {
            return false;
        }
        return id != null && id.equals(((Enseignant) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Enseignant{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", prenom='" + getPrenom() + "'" +
            ", cin='" + getCin() + "'" +
            ", email='" + getEmail() + "'" +
            ", numTel='" + getNumTel() + "'" +
            ", dateEmbauche='" + getDateEmbauche() + "'" +
            ", grade='" + getGrade() + "'" +
            "}";
    }
}
