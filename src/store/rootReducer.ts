import { combineReducers } from '@reduxjs/toolkit';
import apiKeyReducer from './slices/apiKeySlice';
import translationReducer from './slices/translationSlice';

const rootReducer = combineReducers({
  apiKeys: apiKeyReducer,
  translation: translationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
