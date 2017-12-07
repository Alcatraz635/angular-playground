import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';

import { CharacterState } from './../types/state';
import { Character } from '../types/character';
import * as characterActions from '../store/character/character.actions';
import * as characterReducer from '../store/character/character.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'anime characters';
  savedCharacters$: Observable<Character[]>;

  constructor(private store: Store<CharacterState>) {
    this.savedCharacters$ = store.select(characterReducer.getSavedCharacters);
  }

  onAddNewCharacter(character: Character): void {
    this.store.dispatch(new characterActions.AddNewCharacterAction(character));
  }

  onRemoveCharacter(character: Character): void {
    this.store.dispatch(new characterActions.RemoveCharacterAction(character));
  }

  onRequestCharacterSuggestions(query: string): void {
    this.store.dispatch(new characterActions.RequestCharacterSuggestions(query));
  }

  onRequestAPIAccessToken(): void {
    this.store.dispatch(new characterActions.RequestAPIAccessToken);
  }
}
