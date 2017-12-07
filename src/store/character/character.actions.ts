import { Action } from '@ngrx/store';

import { CharacterState } from '../../types/state';
import { Character } from '../../types/character';

export const ADD_CHARACTER = '[Character] Add';
export const REMOVE_CHARACTER = '[Character] Remove';
export const REQUEST_CHARACTER_SUGGESTIONS = '[Character] Request Suggestions';
export const RECEIVE_CHARACTER_SUGGESTIONS = '[Character] Receive Suggestions';
export const REQUEST_API_ACCESS_TOKEN = '[Character] Request API Token';
export const RECEIVE_API_ACCESS_TOKEN = '[Character] Receive API Token';
export const FAILED_TO_RECEIVE_API_ACCESS_TOKEN = '[Character] Failed To Receive API Token';

export class AddNewCharacterAction implements Action {
  readonly type = ADD_CHARACTER;
  constructor(public payload: Character) {}
}

export class RemoveCharacterAction implements Action {
  readonly type = REMOVE_CHARACTER;
  constructor(public payload: Character) {}
}

export class RequestCharacterSuggestions implements Action {
  readonly type = REQUEST_CHARACTER_SUGGESTIONS;
  constructor(public payload: string) {}
}

export class ReceiveCharacterSuggestions implements Action {
  readonly type = RECEIVE_CHARACTER_SUGGESTIONS;
  constructor(public payload: any) {}
}

export class RequestAPIAccessToken implements Action {
  readonly type = REQUEST_API_ACCESS_TOKEN;
}

export class ReceiveAPIAccessToken implements Action {
  readonly type = RECEIVE_API_ACCESS_TOKEN;
  constructor(public payload: string) {}
}

export class FailedToReceiveAPIAccessToken implements Action {
  readonly type = FAILED_TO_RECEIVE_API_ACCESS_TOKEN;
}

export type All = AddNewCharacterAction |
RemoveCharacterAction |
RequestCharacterSuggestions |
ReceiveCharacterSuggestions |
RequestAPIAccessToken |
ReceiveAPIAccessToken |
FailedToReceiveAPIAccessToken;
