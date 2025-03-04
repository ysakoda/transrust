import { combineReducers } from '@reduxjs/toolkit';
import apiKeyReducer from './slices/apiKeySlice';
import translationReducer from './slices/translationSlice';
import settingsReducer from './slices/settingsSlice';

const rootReducer = combineReducers({
  apiKeys: apiKeyReducer,
  translation: translationReducer,
  settings: settingsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
