import { ADD_ALBUM, ADD_QUEUE } from '../actions/types';

const initialState = {
  album: [],
  Queue: []
}

export default function postReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ALBUM:
      return { ...state, album: action.payload };
    case ADD_QUEUE:
      return { ...state, Queue: action.payload };
    default:
      return state;
  }
}