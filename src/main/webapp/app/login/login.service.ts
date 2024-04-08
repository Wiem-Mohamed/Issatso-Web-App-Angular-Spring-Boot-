import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { Login } from './login.model';

import { IMatiere } from '../entities/matiere/matiere.model';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from '../core/config/application-config.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
  email!: String;
  protected resourceUrl2 = this.applicationConfigService.getEndpointFor('api/mail');
  constructor(
    private accountService: AccountService,
    private authServerProvider: AuthServerProvider,
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService
  ) {}

  login(credentials: Login): Observable<Account | null> {
    return this.authServerProvider.login(credentials).pipe(mergeMap(() => this.accountService.identity(true)));
  }

  logout(): void {
    this.authServerProvider.logout().subscribe({ complete: () => this.accountService.authenticate(null) });
  }
}
