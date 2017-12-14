import { AppState } from './../../types/state';
import { Store } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, ObservableInput } from 'rxjs/Observable';
import * as moment from 'moment';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/merge';

import { catchError, debounceTime, map, retryWhen, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/observable/of';


import * as CharacterActions from './character.actions';
import * as CharacterReducer from './character.reducer';
import { environment } from '../../../environments/environment';
import { CharacterState } from '../../types/state';
import { ClearCharacterSuggestions } from './character.actions';

@Injectable()
export class CharacterEffects {

  constructor(
    private action$: Actions,
    private http: HttpClient,
    private store: Store<CharacterState>) { }

  @Effect()
  requestAPIAccessToken = this.action$
    .ofType(CharacterActions.REQUEST_API_ACCESS_TOKEN)
    .switchMap(() => {
      const params = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('client_id', environment.aniListClientID)
      .set('client_secret', environment.aniListClientSecret);

      return this.http.post('https://anilist.co/api/auth/access_token', null, { params })
          .pipe(
              map((res: any) => new CharacterActions.ReceiveAPIAccessToken(res)),
              catchError(() => Observable.of(new CharacterActions.FailedToReceiveAPIAccessToken())),
          );
    });


  @Effect()
  requestCharacterSuggestions = this.action$
    .ofType(CharacterActions.REQUEST_CHARACTER_SUGGESTIONS)
    .pipe(
      debounceTime(350),
      map(toPayload),
      withLatestFrom(this.store.select(CharacterReducer.getAPIAcessToken)),
      switchMap(([query, apiAccessToken]) => {
        const callCharacterSuggestionsAPI = (token: string) =>
          this.http.get(`https://anilist.co/api/character/search/${query}`, {
            params: new HttpParams().set('access_token', token),
          }).pipe(
              catchError(err => of(err) ),
              map(res => new CharacterActions.ReceiveCharacterSuggestions(res)),
            );
        if (!!apiAccessToken && moment().unix() < apiAccessToken.expires) {
          return callCharacterSuggestionsAPI(apiAccessToken.access_token);
        }
        return of(new CharacterActions.RequestAPIAccessToken)
          .merge(
            this.action$
              .ofType(CharacterActions.RECEIVE_API_ACCESS_TOKEN)
              .pipe(
                withLatestFrom(this.store.select(CharacterReducer.getAPIAcessToken)),
                switchMap(([action, token]) => {
                  return callCharacterSuggestionsAPI(token.access_token);
                }),
              ),
          );
      }));
}
