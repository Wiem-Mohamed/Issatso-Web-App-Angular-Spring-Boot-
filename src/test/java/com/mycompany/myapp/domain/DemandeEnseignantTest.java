package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DemandeEnseignantTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DemandeEnseignant.class);
        DemandeEnseignant demandeEnseignant1 = new DemandeEnseignant();
        demandeEnseignant1.setId(1L);
        DemandeEnseignant demandeEnseignant2 = new DemandeEnseignant();
        demandeEnseignant2.setId(demandeEnseignant1.getId());
        assertThat(demandeEnseignant1).isEqualTo(demandeEnseignant2);
        demandeEnseignant2.setId(2L);
        assertThat(demandeEnseignant1).isNotEqualTo(demandeEnseignant2);
        demandeEnseignant1.setId(null);
        assertThat(demandeEnseignant1).isNotEqualTo(demandeEnseignant2);
    }
}
