import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { invoke } from '@tauri-apps/api/core';

export interface ApiKey {
  id?: number;
  provider: string;
  key: string;
  is_active: boolean;
}

interface ApiKeyState {
  apiKeys: ApiKey[];
  loading: boolean;
  error: string | null;
}

const initialState: ApiKeyState = {
  apiKeys: [],
  loading: false,
  error: null,
};

export const fetchApiKeys = createAsyncThunk('apiKeys/fetchAll', async () => {
  return await invoke<ApiKey[]>('get_all_api_keys');
});

export const registerApiKey = createAsyncThunk(
  'apiKeys/register',
  async ({ provider, key }: { provider: string; key: string }) => {
    const id = await invoke<number>('register_api_key', { provider, key });
    return { id, provider, key, is_active: true };
  }
);

export const toggleApiKeyStatus = createAsyncThunk(
  'apiKeys/toggleStatus',
  async ({ id, active }: { id: number; active: boolean }) => {
    const success = await invoke<boolean>('toggle_api_key_status', { id, active });
    return { id, active, success };
  }
);

export const deleteApiKey = createAsyncThunk('apiKeys/delete', async (id: number) => {
  const success = await invoke<boolean>('delete_api_key', { id });
  return { id, success };
});

const apiKeySlice = createSlice({
  name: 'apiKeys',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchApiKeys.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApiKeys.fulfilled, (state, action) => {
        state.apiKeys = action.payload;
        state.loading = false;
      })
      .addCase(fetchApiKeys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'APIキーの取得に失敗しました';
      })
      .addCase(registerApiKey.fulfilled, (state, action) => {
        const exists = state.apiKeys.some(key => key.provider === action.payload.provider);
        if (exists) {
          state.apiKeys = state.apiKeys.map(key =>
            key.provider === action.payload.provider ? action.payload : key
          );
        } else {
          state.apiKeys.push(action.payload);
        }
      })
      .addCase(toggleApiKeyStatus.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.apiKeys = state.apiKeys.map(key =>
            key.id === action.payload.id ? { ...key, is_active: action.payload.active } : key
          );
        }
      })
      .addCase(deleteApiKey.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.apiKeys = state.apiKeys.filter(key => key.id !== action.payload.id);
        }
      });
  },
});

export default apiKeySlice.reducer;
