import {combineReducers, configureStore} from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice';

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const persistConfig = {
    key: 'root',
    storage,
  }

const rootReducer = combineReducers({
    user: userReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
    reducer: persistedReducer
})

export default store;
export const persistor = persistStore(store);