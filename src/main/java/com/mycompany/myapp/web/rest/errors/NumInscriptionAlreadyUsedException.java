package com.mycompany.myapp.web.rest.errors;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.ErrorResponseException;
import tech.jhipster.web.rest.errors.ProblemDetailWithCause;

@SuppressWarnings("java:S110")
public class NumInscriptionAlreadyUsedException extends ErrorResponseException {

    private static final long serialVersionUID = 1L;

    public NumInscriptionAlreadyUsedException() {
        super(
            HttpStatus.BAD_REQUEST,
            ProblemDetailWithCause.ProblemDetailWithCauseBuilder
                .instance()
                .withStatus(HttpStatus.BAD_REQUEST.value())
                .withType(ErrorConstants.NUMINSCRIPTION_ALREADY_USED_TYPE)
                .withTitle("numInscription existe")
                .build(),
            null
        );
    }
}
