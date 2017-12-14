import { Character } from './character';

export interface AppState {
  characterState: CharacterState;
}

export interface CharacterState {
  savedCharacters: Character[];
  characterSuggestionsIsPending: boolean;
  characterSuggestions: Character[];
  apiAccessToken: any;

}
