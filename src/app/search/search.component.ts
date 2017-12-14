import { RequestCharacterSuggestions } from './../store/character/character.actions';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { startWith, map, tap } from 'rxjs/operators'
import { Store } from '@ngrx/store';

import { CharacterState } from '../types/state';
import * as characterActions from '../store/character/character.actions';
import * as characterReducer from '../store/character/character.reducer';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchCtrl: FormControl;
  characterSuggestions$: Observable<any[]>;

  constructor(private store: Store<CharacterState>) {
    this.searchCtrl = new FormControl();
    this.characterSuggestions$ = store.select(characterReducer.getChracterSuggestions);
  }

  ngOnInit() {
    this.searchCtrl.valueChanges
      .subscribe(query =>
        query.length ?
        this.store.dispatch(new characterActions.RequestCharacterSuggestions(query)) :
        this.store.dispatch(new characterActions.ClearCharacterSuggestions()));
  }

}
