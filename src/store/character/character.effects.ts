import { AppState } from './../../types/state';
import { Store } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, ObservableInput } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/of';

import * as CharacterActions from './character.actions';
import * as CharacterReducer from './character.reducer';
import { environment } from '../../environments/environment';
import { CharacterState } from '../../types/state';

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
          .pipe(authObservable =>
            authObservable
              .map((res: any) => new CharacterActions.ReceiveAPIAccessToken(res.access_token))
              .catch(() => Observable.of(new CharacterActions.FailedToReceiveAPIAccessToken())),
          );
    });


  @Effect()
  requestCharacterSuggestions = this.action$
    .ofType(CharacterActions.REQUEST_CHARACTER_SUGGESTIONS)
    .debounceTime(500)
    .map(toPayload)
    .pipe(observable =>
      observable
      .withLatestFrom(this.store.select(CharacterReducer.getAPIAcessToken))
      .switchMap(([query, apiAccessToken]) => {

        const callCharacterSuggestionsAPI = (token: string) => {
          const params = new HttpParams().set('access_token', token);
          return this.http.get(`https://anilist.co/api/character/search/${query}`, { params })
            .map(response => new CharacterActions.ReceiveCharacterSuggestions(response));
        };

        if (!!apiAccessToken) {
          return callCharacterSuggestionsAPI(apiAccessToken);
        }

        return Observable.of(new CharacterActions.RequestAPIAccessToken)
          .merge(
            this.action$
              .ofType(CharacterActions.RECEIVE_API_ACCESS_TOKEN)
              .withLatestFrom(this.store.select(CharacterReducer.getAPIAcessToken))
              .switchMap(([action, newApiAccessToken]) => {
                return callCharacterSuggestionsAPI('test');
              }),
          );
      }));
}


// .retryWhen((err) => {
//   return err
//     .switchMap((errorObservable) => {
//       if (errorObservable.status === 401) {
//         return Observable.of(new CharacterActions.RequestAPIAccessToken)
//         .merge(
//           this.action$
//             .ofType(CharacterActions.RECEIVE_API_ACCESS_TOKEN)
//             .withLatestFrom(this.store.select(CharacterReducer.getAPIAcessToken))
//             .switchMap(([action, newApiAccessToken]) => {
//               return callCharacterSuggestionsAPI('test');
//             }),
//         );
//       }
//       Observable.of(errorObservable.error.status);
//     })
//     .withLatestFrom(this.store.select(CharacterReducer.getAPIAcessToken))
//     .take(2);
// });
