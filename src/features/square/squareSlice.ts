import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Square } from "../../types/types";

interface SquareState {
  squares: Square[];
}

const initialState: SquareState = {
  squares: [],
};

// Define the reducer function
export const squareSlice = createSlice({
  name: "square",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<Square[]>) => {
      state.squares = action.payload;
    },

    rotate: (state, action: PayloadAction<number>) => {
      for (let n = 0; n < action.payload; n++) {
        state.squares[n].rotation += 1;
      }
    },

    toggleHighlight: (state, action: PayloadAction<Square>) => {
      const id = action.payload.id;
      state.squares[id].isHighligted = !state.squares[id].isHighligted;
    },

    toggleSelect: (state, action: PayloadAction<Square>) => {
      const id = action.payload.id;
      state.squares[id].isSelected = !state.squares[id].isSelected;
    },

    deselectAll: (state) => {
      for (let square of state.squares) {
        square.isSelected = false;
      }
    },

    translateSelected: (
      state,
      action: PayloadAction<{ deltaX: number; deltaY: number }>
    ) => {
      for (let square of state.squares) {
        if (square.isSelected) {
          square.x += action.payload.deltaX;
          square.y -= action.payload.deltaY;
        }
      }
    },
  },
});

// Export the action creators
export const {
  set,
  rotate,
  toggleHighlight,
  toggleSelect,
  deselectAll,
  translateSelected,
} = squareSlice.actions;

// Export selectors
export const selectSquares = (state: RootState) => state.square.squares;

export default squareSlice.reducer;
