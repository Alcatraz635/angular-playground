import { reducers } from './../store/index';
import { Store, StoreModule } from '@ngrx/store';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { CharacterState } from '../types/state';

describe('Given AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let store: Store<CharacterState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
      ],
      imports: [
        StoreModule.forRoot(reducers),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    store = fixture.debugElement.injector.get(Store);
  });
  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));
  it('store to be defined', async(() => {
    expect(store).toBeDefined();
  }));
});
