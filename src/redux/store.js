//#region import
//#region list of reducers
import authReducers from './reducers/authReducers';
import appReducers from './reducers/appReducers';
import homeReducers from './reducers/homeReducers';
import chatReducers from './reducers/chatReducers';
//#endregion
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
//#endregion

const rootReducer = combineReducers({
    authReducers,
    appReducers,
    homeReducers,
    chatReducers
});
const configureStore = () => {
    return createStore(rootReducer, applyMiddleware(thunk));
}
export default configureStore;