export type Square = {
  id: string;
  x: number;
  y: number;
  sideLength: number;
  rotation: number;
  isSelected: boolean;
};

export const initialState: Square[] = [];

type CreatePayload = {
  numberOfSquares: number;
  sideLength: number;
};

function create({ numberOfSquares, sideLength }: CreatePayload) {
  const squaresPerRow = Math.round(Math.sqrt(numberOfSquares));
  const distance = sideLength * 1.75;
  const newSquares: Square[] = [];
  for (let n = 1; n <= numberOfSquares; n++) {
    const row = Math.ceil(n / squaresPerRow);
    const colum = n - (row - 1) * squaresPerRow;
    const x = distance * colum;
    const y = distance * row;
    const square: Square = {
      id: n.toString(),
      x,
      y,
      sideLength: sideLength,
      rotation: 0,
      isSelected: false,
    };
    newSquares.push(square);
  }
  return newSquares;
}

type RotatePayload = {
  numberSpinning: number;
};

function rotate(state: Square[], { numberSpinning }: RotatePayload) {
  return state.map((square, n) => {
    if (n < numberSpinning) {
      square = { ...square, rotation: square.rotation + 1 };
    }
    return square;
  });
}

type SelectPayload = {
  squareId: string;
};

function select(state: Square[], { squareId }: SelectPayload) {
  return state.map(square => {
    if (square.id === squareId) {
      square = { ...square, isSelected: !square.isSelected };
    }
    return square;
  });
}

function deselectAll(state: Square[]) {
  return state.map(square => {
    square = { ...square, isSelected: false };
    return square;
  });
}

type TranslatePayload = {
  deltaX: number;
  deltaY: number;
};

function translate(state: Square[], { deltaX, deltaY }: TranslatePayload) {
  return state.map(square => {
    if (square.isSelected === true) {
      square = {
        ...square,
        x: square.x + deltaX,
        y: square.y - deltaY,
      };
    }
    return square;
  });
}

type Payload =
  | undefined
  | CreatePayload
  | RotatePayload
  | SelectPayload
  | TranslatePayload;

export type PayloadAction = {
  type: 'create' | 'rotate' | 'select' | 'deselectAll' | 'translate';
  payload: Payload;
};

export function squareReducer(state: Square[], action: PayloadAction) {
  let payload: Payload = undefined;
  switch (action.type) {
    case 'create':
      payload = action.payload as CreatePayload;
      return create(payload);
    case 'rotate':
      payload = action.payload as RotatePayload;
      return rotate(state, payload);
    case 'select':
      payload = action.payload as SelectPayload;
      return select(state, payload);
    case 'deselectAll':
      return deselectAll(state);
    case 'translate':
      payload = action.payload as TranslatePayload;
      return translate(state, payload);
    default:
      throw new Error();
  }
}
