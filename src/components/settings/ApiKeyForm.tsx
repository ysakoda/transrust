import React, { useState } from 'react';

interface ApiKeyFormProps {
  onSubmit: (provider: string, key: string) => void;
  onCancel: () => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onSubmit, onCancel }) => {
  const [provider, setProvider] = useState('deepl');
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(provider, apiKey);
    }
  };

  return (
    <div className="api-key-form">
      <h3>API キーの設定</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>プロバイダー:</label>
          <select value={provider} onChange={e => setProvider(e.target.value)} required>
            <option value="deepl">DeepL</option>
            <option value="google">Google翻訳</option>
          </select>
        </div>
        <div className="form-group">
          <label>API キー:</label>
          <input
            type="text"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="APIキーを入力してください"
            required
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={onCancel}>
            キャンセル
          </button>
          <button type="submit" disabled={!apiKey.trim()}>
            保存
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApiKeyForm;
