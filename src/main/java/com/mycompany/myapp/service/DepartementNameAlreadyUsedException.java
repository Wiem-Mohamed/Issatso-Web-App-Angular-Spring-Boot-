package com.mycompany.myapp.service;

public class DepartementNameAlreadyUsedException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public DepartementNameAlreadyUsedException() {
        super("Nom département existe déjà");
    }
}
