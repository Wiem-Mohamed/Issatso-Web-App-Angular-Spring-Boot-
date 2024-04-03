package com.mycompany.myapp.web.rest.errors;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.ErrorResponseException;
import tech.jhipster.web.rest.errors.ProblemDetailWithCause;

public class CinAlreadyUsedException extends ErrorResponseException {

    private static final long serialVersionUID = 1L;

    public CinAlreadyUsedException() {
        super(
            HttpStatus.BAD_REQUEST,
            ProblemDetailWithCause.ProblemDetailWithCauseBuilder
                .instance()
                .withStatus(HttpStatus.BAD_REQUEST.value())
                .withType(ErrorConstants.CIN_ALREADY_USED_TYPE)
                .withTitle("CIN existe")
                .build(),
            null
        );
    }
}
