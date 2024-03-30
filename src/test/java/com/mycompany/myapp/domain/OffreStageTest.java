package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OffreStageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OffreStage.class);
        OffreStage offreStage1 = new OffreStage();
        offreStage1.setId(1L);
        OffreStage offreStage2 = new OffreStage();
        offreStage2.setId(offreStage1.getId());
        assertThat(offreStage1).isEqualTo(offreStage2);
        offreStage2.setId(2L);
        assertThat(offreStage1).isNotEqualTo(offreStage2);
        offreStage1.setId(null);
        assertThat(offreStage1).isNotEqualTo(offreStage2);
    }
}
