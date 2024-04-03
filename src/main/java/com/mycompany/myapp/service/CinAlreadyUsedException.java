package com.mycompany.myapp.service;

public class CinAlreadyUsedException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public CinAlreadyUsedException() {
        super("CIN existe déjà");
    }
}
