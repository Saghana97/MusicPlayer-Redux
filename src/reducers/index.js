import { combineReducers } from 'redux';
// import posts from './postReducer';
import postReducer from './postReducer';

export default combineReducers({
    posts: postReducer
});