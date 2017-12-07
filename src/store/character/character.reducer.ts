import { createFeatureSelector, createSelector } from '@ngrx/store';
import lodashIsequal from 'lodash.isequal';

import { CharacterState } from '../../types/state';
import { Character } from '../../types/character';
import * as CharacterActions from './character.actions';

export const INITIAL_STATE: CharacterState = Object.freeze({
  savedCharacters: [],
  characterSuggestionsIsPending: false,
  characterSuggestions: [],
  apiAccessToken: 'fake',
});
type Action = CharacterActions.All;

export const character = (state = INITIAL_STATE, action: Action): CharacterState => {
  switch (action.type) {
    case CharacterActions.ADD_CHARACTER:
      return {
        ...state,
        savedCharacters: state.savedCharacters.concat(action.payload),
      };
    case CharacterActions.REMOVE_CHARACTER:
      return {
        ...state,
        savedCharacters: state.savedCharacters.filter(c => lodashIsequal(c.name, action.payload)),
      };
    case CharacterActions.RECEIVE_CHARACTER_SUGGESTIONS:
      return {
        ...state,
        characterSuggestions: [action.payload],
      };
    case CharacterActions.RECEIVE_API_ACCESS_TOKEN:
      return {
        ...state,
        apiAccessToken: action.payload,
      };
    case CharacterActions.FAILED_TO_RECEIVE_API_ACCESS_TOKEN:
      return {
        ...state,
        apiAccessToken: undefined,
      };
    default:
      return state;
  }
};

export const getCharacterState = createFeatureSelector<CharacterState>('characterState');
export const getSavedCharacters = createSelector(
  getCharacterState,
  (state: CharacterState) => state.savedCharacters,
);
export const getAPIAcessToken = createSelector(
  getCharacterState,
  (state: CharacterState) => state.apiAccessToken,
);
