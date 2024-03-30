package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DepartementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Departement.class);
        Departement departement1 = new Departement();
        departement1.setId(1L);
        Departement departement2 = new Departement();
        departement2.setId(departement1.getId());
        assertThat(departement1).isEqualTo(departement2);
        departement2.setId(2L);
        assertThat(departement1).isNotEqualTo(departement2);
        departement1.setId(null);
        assertThat(departement1).isNotEqualTo(departement2);
    }
}
