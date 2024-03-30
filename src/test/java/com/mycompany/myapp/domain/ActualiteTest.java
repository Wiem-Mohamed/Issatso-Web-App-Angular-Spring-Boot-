package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ActualiteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Actualite.class);
        Actualite actualite1 = new Actualite();
        actualite1.setId(1L);
        Actualite actualite2 = new Actualite();
        actualite2.setId(actualite1.getId());
        assertThat(actualite1).isEqualTo(actualite2);
        actualite2.setId(2L);
        assertThat(actualite1).isNotEqualTo(actualite2);
        actualite1.setId(null);
        assertThat(actualite1).isNotEqualTo(actualite2);
    }
}
