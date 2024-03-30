package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SupportDeCoursTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SupportDeCours.class);
        SupportDeCours supportDeCours1 = new SupportDeCours();
        supportDeCours1.setId(1L);
        SupportDeCours supportDeCours2 = new SupportDeCours();
        supportDeCours2.setId(supportDeCours1.getId());
        assertThat(supportDeCours1).isEqualTo(supportDeCours2);
        supportDeCours2.setId(2L);
        assertThat(supportDeCours1).isNotEqualTo(supportDeCours2);
        supportDeCours1.setId(null);
        assertThat(supportDeCours1).isNotEqualTo(supportDeCours2);
    }
}
