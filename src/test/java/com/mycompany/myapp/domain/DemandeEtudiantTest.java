package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DemandeEtudiantTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DemandeEtudiant.class);
        DemandeEtudiant demandeEtudiant1 = new DemandeEtudiant();
        demandeEtudiant1.setId(1L);
        DemandeEtudiant demandeEtudiant2 = new DemandeEtudiant();
        demandeEtudiant2.setId(demandeEtudiant1.getId());
        assertThat(demandeEtudiant1).isEqualTo(demandeEtudiant2);
        demandeEtudiant2.setId(2L);
        assertThat(demandeEtudiant1).isNotEqualTo(demandeEtudiant2);
        demandeEtudiant1.setId(null);
        assertThat(demandeEtudiant1).isNotEqualTo(demandeEtudiant2);
    }
}
