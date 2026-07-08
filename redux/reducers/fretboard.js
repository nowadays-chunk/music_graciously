import {
  ADD_FRETBOARD,
  UPDATE_FRETBOARD_PROPERTY
} from "../actionTypes";
import { newFretboard } from '../actions';
import { produce } from 'immer';

// Utility function to update nested properties immutably
const updateNestedObject = (obj, propertyPath, value) => {
  const keys = propertyPath.split('.');
  return produce(obj, draft => {
    let nested = draft;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!nested[keys[i]]) nested[keys[i]] = {};
      nested = nested[keys[i]];
    }
    nested[keys[keys.length - 1]] = value;
  });
};

const initialState = {
  components: [
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "home", 'scale'),
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "compose", 'chord'),
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "learn", 'chord'),
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "references1", 'chord'),
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "references1-C", 'chord'),
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "references1-A", 'chord'),
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "references1-G", 'chord'),
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "references1-E", 'chord'),
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "references1-D", 'chord'),
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "references2", 'scale'), // all 3 displays accordingly set in the component, over-ride
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "references2-C", 'scale'), // all 3 displays accordingly set in the component, over-ride
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "references2-A", 'scale'), // all 3 displays accordingly set in the component, over-ride
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "references2-G", 'scale'), // all 3 displays accordingly set in the component, over-ride
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "references2-E", 'scale'), // all 3 displays accordingly set in the component, over-ride
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "references2-D", 'scale'), // all 3 displays accordingly set in the component, over-ride
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "references3", 'arppegio'), // all 3 displays accordingly set in the component, over-ride
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "references3-C", 'arppegio'), // all 3 displays accordingly set in the component, over-ride
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "references3-A", 'arppegio'), // all 3 displays accordingly set in the component, over-ride
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "references3-G", 'arppegio'), // all 3 displays accordingly set in the component, over-ride
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "references3-E", 'arppegio'), // all 3 displays accordingly set in the component, over-ride
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "references3-D", 'arppegio'), // all 3 displays accordingly set in the component, over-ride
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "circle"), // no fretboard only circle of fifths
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "generate"), // chords only
    newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "empty"), // chords only
    ...Array.from({ length: 20 }, (_, i) => [
      newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], `query-${i}`, 'arppegio'),
      newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], `query-${i}`, 'scale')
    ]).flat(),
    // chords only
    // newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], "fill-only"), // fill only
  ]
};

const fretboard = (state = initialState, action) => {
  switch (action.type) {
    case ADD_FRETBOARD:
      return {
        ...state,
        components: [...state.components, action.payload.fretboard],
      }
    case UPDATE_FRETBOARD_PROPERTY: {
      const { fretboardId, propertyPath, value } = action.payload;

      const newComponents = [...state.components];
      const keys = propertyPath.split('.');

      if (keys.length === 1) {
        return {
          ...state,
          components: newComponents.map((fretboard) =>
            fretboard.id === fretboardId
              ? { ...fretboard, [propertyPath]: value }
              : fretboard
          ),
        };
      } else {
        return {
          ...state,
          components: newComponents.map((fretboard) =>
            fretboard.id === fretboardId
              ? updateNestedObject(fretboard, propertyPath, value)
              : fretboard
          ),
        };
      }
    }
    default: {
      return state;
    }
  }
};

export default fretboard;