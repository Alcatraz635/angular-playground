import { CharacterEffects } from './character/character.effects';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { character } from './character/character.reducer';
import { AppState } from './../types/state';
import { environment } from '../../environments/environment';

export const reducers: ActionReducerMap<AppState> = {
  characterState: character,
};

export const effects = [
  CharacterEffects,
];


const logger = (reducer: ActionReducer<AppState>): ActionReducer<AppState> =>
  (state: AppState, action: any): AppState => {
    console.log('state', state);
    console.log('action', action);
    return reducer(state, action);
  };

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [logger] : [];
