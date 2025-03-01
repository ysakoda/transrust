import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { invoke } from '@tauri-apps/api/core';

export interface Translation {
  id?: number;
  source_text: string;
  translated_text: string;
  source_language: string;
  target_language: string;
  created_at: string;
  api_source: string;
}

interface TranslationState {
  currentTranslation: Translation | null;
  history: Translation[];
  loading: boolean;
  error: string | null;
}

const initialState: TranslationState = {
  currentTranslation: null,
  history: [],
  loading: false,
  error: null,
};

export const translateText = createAsyncThunk(
  'translation/translate',
  async ({
    text,
    sourceLang,
    targetLang
  }: {
    text: string;
    sourceLang?: string;
    targetLang: string
  }) => {
    return await invoke<Translation>('translate', {
      text,
      source_lang: sourceLang,
      target_lang: targetLang,
    });
  }
);

export const fetchTranslationHistory = createAsyncThunk(
  'translation/fetchHistory',
  async () => {
    return await invoke<Translation[]>('get_translation_history');
  }
);

export const deleteTranslation = createAsyncThunk(
  'translation/delete',
  async (id: number) => {
    const success = await invoke<boolean>('delete_translation', { id });
    return { id, success };
  }
);

const translationSlice = createSlice({
  name: 'translation',
  initialState,
  reducers: {
    clearCurrentTranslation: (state) => {
      state.currentTranslation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(translateText.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(translateText.fulfilled, (state, action) => {
        state.currentTranslation = action.payload;
        state.loading = false;
        // 履歴に追加（既存の場合は更新）
        const index = state.history.findIndex(item => item.id === action.payload.id);
        if (index >= 0) {
          state.history[index] = action.payload;
        } else {
          state.history.unshift(action.payload);
        }
      })
      .addCase(translateText.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '翻訳に失敗しました';
      })
      .addCase(fetchTranslationHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTranslationHistory.fulfilled, (state, action) => {
        state.history = action.payload;
        state.loading = false;
      })
      .addCase(fetchTranslationHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '翻訳履歴の取得に失敗しました';
      })
      .addCase(deleteTranslation.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.history = state.history.filter(item => item.id !== action.payload.id);
          if (state.currentTranslation?.id === action.payload.id) {
            state.currentTranslation = null;
          }
        }
      });
  },
});

export const { clearCurrentTranslation } = translationSlice.actions;
export default translationSlice.reducer;
