package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Matiere.
 */
@Entity
@Table(name = "matiere")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Matiere implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "matiere_name")
    private String matiereName;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "matiere")
    @JsonIgnoreProperties(value = { "matiere" }, allowSetters = true)
    private Set<SupportDeCours> supportDeCours = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "matieres", "groupes", "departement" }, allowSetters = true)
    private Enseignant enseignant;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Matiere id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMatiereName() {
        return this.matiereName;
    }

    public Matiere matiereName(String matiereName) {
        this.setMatiereName(matiereName);
        return this;
    }

    public void setMatiereName(String matiereName) {
        this.matiereName = matiereName;
    }

    public Set<SupportDeCours> getSupportDeCours() {
        return this.supportDeCours;
    }

    public void setSupportDeCours(Set<SupportDeCours> supportDeCours) {
        if (this.supportDeCours != null) {
            this.supportDeCours.forEach(i -> i.setMatiere(null));
        }
        if (supportDeCours != null) {
            supportDeCours.forEach(i -> i.setMatiere(this));
        }
        this.supportDeCours = supportDeCours;
    }

    public Matiere supportDeCours(Set<SupportDeCours> supportDeCours) {
        this.setSupportDeCours(supportDeCours);
        return this;
    }

    public Matiere addSupportDeCours(SupportDeCours supportDeCours) {
        this.supportDeCours.add(supportDeCours);
        supportDeCours.setMatiere(this);
        return this;
    }

    public Matiere removeSupportDeCours(SupportDeCours supportDeCours) {
        this.supportDeCours.remove(supportDeCours);
        supportDeCours.setMatiere(null);
        return this;
    }

    public Enseignant getEnseignant() {
        return this.enseignant;
    }

    public void setEnseignant(Enseignant enseignant) {
        this.enseignant = enseignant;
    }

    public Matiere enseignant(Enseignant enseignant) {
        this.setEnseignant(enseignant);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Matiere)) {
            return false;
        }
        return id != null && id.equals(((Matiere) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Matiere{" +
            "id=" + getId() +
            ", matiereName='" + getMatiereName() + "'" +
            "}";
    }
}
