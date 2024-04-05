package com.mycompany.myapp.web.rest.errors;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.ErrorResponseException;
import tech.jhipster.web.rest.errors.ProblemDetailWithCause;

public class DepartementNameAlreadyUsedException extends ErrorResponseException {

    private static final long serialVersionUID = 1L;

    public DepartementNameAlreadyUsedException() {
        super(
            HttpStatus.BAD_REQUEST,
            ProblemDetailWithCause.ProblemDetailWithCauseBuilder
                .instance()
                .withStatus(HttpStatus.BAD_REQUEST.value())
                .withType(ErrorConstants.NOM_DEPARTEMENT_ALREADY_USED_TYPE)
                .withTitle("nom departement existe")
                .build(),
            null
        );
    }
}
