import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { RootState } from '../store/rootReducer';
import { type Settings, fetchSettings, saveSettings } from '../store/slices/settingsSlice';
import { fetchApiKeys } from '../store/slices/apiKeySlice';

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { settings, loading, error } = useSelector((state: RootState) => state.settings);
  const { apiKeys } = useSelector((state: RootState) => state.apiKeys);

  const [formData, setFormData] = useState<Settings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    dispatch(fetchSettings());
    dispatch(fetchApiKeys());
  }, [dispatch]);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  useEffect(() => {
    const isChanged = JSON.stringify(settings) !== JSON.stringify(formData);
    setHasChanges(isChanged);
  }, [formData, settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: target.checked,
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleThemeSelect = (theme: 'dark' | 'light') => {
    setFormData({
      ...formData,
      theme,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await dispatch(saveSettings(formData)).unwrap();
      setHasChanges(false);
    } catch (error) {
      console.error('設定の保存に失敗しました:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(settings);
    setHasChanges(false);
  };

  const activeProviders = apiKeys.filter(key => key.is_active);

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>設定</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="settings-section">
          <h3>アプリケーション設定</h3>

          <div className="settings-item">
            <label>テーマ</label>
            <div className="theme-selector">
              <div
                className={`theme-option theme-dark ${formData.theme === 'dark' ? 'selected' : ''}`}
                onClick={() => handleThemeSelect('dark')}
              >
                <div className="theme-name">ダークテーマ</div>
              </div>
              <div
                className={`theme-option theme-light ${formData.theme === 'light' ? 'selected' : ''}`}
                onClick={() => handleThemeSelect('light')}
              >
                <div className="theme-name">ライトテーマ</div>
              </div>
            </div>
          </div>

          <div className="settings-item">
            <label>履歴保存件数</label>
            <input
              type="number"
              name="historyLimit"
              min="10"
              max="1000"
              value={formData.historyLimit}
              onChange={handleInputChange}
            />
          </div>

          <div className="settings-item">
            <div className="toggle-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="cacheEnabled"
                  checked={formData.cacheEnabled}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      cacheEnabled: e.target.checked,
                    })
                  }
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">翻訳キャッシュを有効化</span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>翻訳設定</h3>

          <div className="settings-item">
            <label>デフォルト翻訳プロバイダー</label>
            <select
              name="defaultProvider"
              value={formData.defaultProvider}
              onChange={handleInputChange}
            >
              {activeProviders.map(provider => (
                <option key={provider.provider} value={provider.provider}>
                  {provider.provider === 'deepl' ? 'DeepL' : 'Google翻訳'}
                </option>
              ))}
              {activeProviders.length === 0 && (
                <option value="none" disabled>
                  有効なAPIキーがありません
                </option>
              )}
            </select>
          </div>

          <div className="settings-item">
            <label>デフォルトソース言語</label>
            <select
              name="defaultSourceLanguage"
              value={formData.defaultSourceLanguage || ''}
              onChange={handleInputChange}
            >
              <option value="">自動検出</option>
              <option value="JA">日本語</option>
              <option value="EN">英語</option>
              <option value="DE">ドイツ語</option>
              <option value="FR">フランス語</option>
              <option value="ES">スペイン語</option>
              <option value="IT">イタリア語</option>
              <option value="KO">韓国語</option>
              <option value="ZH">中国語</option>
            </select>
          </div>

          <div className="settings-item">
            <label>デフォルトターゲット言語</label>
            <select
              name="defaultTargetLanguage"
              value={formData.defaultTargetLanguage}
              onChange={handleInputChange}
            >
              <option value="JA">日本語</option>
              <option value="EN">英語</option>
              <option value="DE">ドイツ語</option>
              <option value="FR">フランス語</option>
              <option value="ES">スペイン語</option>
              <option value="IT">イタリア語</option>
              <option value="KO">韓国語</option>
              <option value="ZH">中国語</option>
            </select>
          </div>
        </div>

        <div className="settings-actions">
          <button
            type="button"
            className="settings-reset-button"
            onClick={handleReset}
            disabled={!hasChanges || loading || isSaving}
          >
            リセット
          </button>
          <button
            type="submit"
            className="settings-save-button"
            disabled={!hasChanges || loading || isSaving}
          >
            {isSaving ? '保存中...' : '設定を保存'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
