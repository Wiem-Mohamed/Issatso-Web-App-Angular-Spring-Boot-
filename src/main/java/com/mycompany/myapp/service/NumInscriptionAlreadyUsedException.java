package com.mycompany.myapp.service;

public class NumInscriptionAlreadyUsedException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public NumInscriptionAlreadyUsedException() {
        super("Num Inscription existe déjà");
    }
}
