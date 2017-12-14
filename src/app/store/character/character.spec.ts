import { Character } from './../../types/character';
import { AddNewCharacterAction, INITIAL_STATE, reducer, RemoveCharacterAction } from './character.actions';

describe('Given character reducer', () => {
  let expectedState;
  let actualState;

  describe('When the addNewCharacter action is reduced', () => {
    let newCharacter;
    beforeEach(() => {
      newCharacter = new Character('test character');
      expectedState = {
        savedCharacters: [
          newCharacter,
        ],
      };
      actualState = reducer(INITIAL_STATE, new AddNewCharacterAction(newCharacter));
    });
    it('Then returns the appropriate state', () => {
      expect(expectedState).toEqual(actualState);
    });

    describe('When the removeCharacter action is reduced with the character that was just added', () => {
      beforeEach(() => {
        expectedState = {
          savedCharacters: [],
        };
        actualState = reducer(actualState, new RemoveCharacterAction(newCharacter));
      });

      it('Then returns the appropriate state', () => {
        expect(expectedState).toEqual(actualState);
      });
    });
  });
});
