import {combineReducers, configureStore} from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice';
import taskReducer from '../features/task/taskSlice';

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const userPersistConfig  = {
    key: 'user',
    storage,
    blacklist: ['loading', 'success', 'error', 'message'],
  }

const rootReducer = combineReducers({
    user: persistReducer(userPersistConfig, userReducer),
    tasks: taskReducer
})


const store = configureStore({
    reducer: rootReducer
})

export default store;
export const persistor = persistStore(store);