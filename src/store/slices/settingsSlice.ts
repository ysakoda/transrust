import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { invoke } from '@tauri-apps/api/core';

export interface Settings {
  theme: 'dark' | 'light';
  defaultSourceLanguage: string | undefined;
  defaultTargetLanguage: string;
  defaultProvider: string;
  historyLimit: number;
  cacheEnabled: boolean;
}

interface SettingsState {
  settings: Settings;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: {
    theme: 'dark',
    defaultSourceLanguage: undefined,
    defaultTargetLanguage: 'EN',
    defaultProvider: 'deepl',
    historyLimit: 100,
    cacheEnabled: true,
  },
  loading: false,
  error: null,
};

export const fetchSettings = createAsyncThunk('settings/fetch', async () => {
  const rustSettings = await invoke<any>('get_settings');

  return {
    theme: rustSettings.theme,
    defaultSourceLanguage: rustSettings.default_source_language,
    defaultTargetLanguage: rustSettings.default_target_language,
    defaultProvider: rustSettings.default_provider,
    historyLimit: rustSettings.history_limit,
    cacheEnabled: rustSettings.cache_enabled,
  } as Settings;
});

export const saveSettings = createAsyncThunk('settings/save', async (settings: Settings) => {
  const rustSettings = {
    theme: settings.theme,
    default_source_language: settings.defaultSourceLanguage,
    default_target_language: settings.defaultTargetLanguage,
    default_provider: settings.defaultProvider,
    history_limit: settings.historyLimit,
    cache_enabled: settings.cacheEnabled,
  };

  const result = await invoke<any>('save_settings', { settings: rustSettings });

  return {
    theme: result.theme,
    defaultSourceLanguage: result.default_source_language,
    defaultTargetLanguage: result.default_target_language,
    defaultProvider: result.default_provider,
    historyLimit: result.history_limit,
    cacheEnabled: result.cache_enabled,
  } as Settings;
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSettings.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.loading = false;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '設定データの取得に失敗しました';
      })
      .addCase(saveSettings.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.loading = false;
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '設定の保存に失敗しました';
      });
  },
});

export default settingsSlice.reducer;
