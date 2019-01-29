import {ADD_ALBUM, ADD_QUEUE} from './types';

export const addAlbum= (data) => dispatch =>{
  dispatch({
      type:ADD_ALBUM,
      payload: data
  })
};
export const addQueue = (data) => dispatch => {
  dispatch({
    type: ADD_QUEUE,
    payload:data
  })
};
