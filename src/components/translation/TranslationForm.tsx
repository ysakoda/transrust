import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { ApiKey } from '../../store/slices/apiKeySlice';

interface TranslationFormProps {
  onTranslate: (
    text: string,
    sourceLang: string | undefined,
    targetLang: string,
    provider: string
  ) => void;
  isLoading: boolean;
}

const TranslationForm: React.FC<TranslationFormProps> = ({ onTranslate, isLoading }) => {
  const [sourceText, setSourceText] = useState('');
  const [sourceLang, setSourceLang] = useState<string | undefined>(undefined);
  const [targetLang, setTargetLang] = useState('EN');
  const [provider, setProvider] = useState('deepl');

  const { apiKeys } = useSelector((state: RootState) => state.apiKeys);
  const availableProviders = apiKeys.filter(key => key.is_active);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceText.trim()) {
      onTranslate(sourceText, sourceLang, targetLang, provider);
    }
  };

  const renderProviderStatus = (providerKey: ApiKey) => {
    return (
      <div className={`provider-status ${providerKey.is_active ? 'active' : 'inactive'}`}>
        <span className="status-indicator"></span>
        <span>{providerKey.is_active ? '利用可能' : '無効'}</span>
      </div>
    );
  };

  const getProviderDisplayName = (providerName: string) => {
    switch (providerName) {
      case 'deepl':
        return 'DeepL';
      case 'google':
        return 'Google翻訳';
      default:
        return providerName;
    }
  };

  return (
    <form className="translation-form" onSubmit={handleSubmit}>
      <div className="form-controls">
        <div className="provider-selector-cards">
          <h3 className="provider-heading">翻訳サービスを選択</h3>
          <div className="provider-cards">
            {apiKeys.map(key => (
              <div
                key={key.provider}
                className={`provider-card ${provider === key.provider ? 'selected' : ''} ${!key.is_active ? 'disabled' : ''}`}
                onClick={() => key.is_active && setProvider(key.provider)}
              >
                <div className="provider-card-header">
                  <h4>{getProviderDisplayName(key.provider)}</h4>
                  {renderProviderStatus(key)}
                </div>
                <div className="provider-card-content">
                  <p className="provider-description">
                    {key.provider === 'deepl'
                      ? 'DeepL API - 高精度な機械翻訳サービス'
                      : 'Google Cloud Translation API - 200以上の言語に対応'}
                  </p>
                </div>
                {provider === key.provider && <div className="provider-selected-badge">選択中</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="language-selectors">
          <select
            value={sourceLang || ''}
            onChange={e => setSourceLang(e.target.value || undefined)}
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
          <span className="arrow-icon">→</span>
          <select value={targetLang} onChange={e => setTargetLang(e.target.value)} required>
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
      <textarea
        value={sourceText}
        onChange={e => setSourceText(e.target.value)}
        placeholder="翻訳するテキストを入力してください"
        rows={6}
        required
      />
      <button
        type="submit"
        disabled={isLoading || !sourceText.trim() || availableProviders.length === 0}
      >
        {isLoading ? '翻訳中...' : '翻訳する'}
      </button>
      {availableProviders.length === 0 && (
        <p className="no-provider-warning">
          有効な翻訳サービスがありません。APIキー設定から有効化してください。
        </p>
      )}
    </form>
  );
};

export default TranslationForm;
