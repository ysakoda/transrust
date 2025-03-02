import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';

interface TranslationFormProps {
  onTranslate: (text: string, sourceLang: string | undefined, targetLang: string, provider: string) => void;
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

  return (
    <form className="translation-form" onSubmit={handleSubmit}>
      <div className="form-controls">
        <div className="provider-selector">
          <label>翻訳サービス:</label>
          <select
            value={provider}
            onChange={e => setProvider(e.target.value)}
            disabled={availableProviders.length <= 1}
          >
            {availableProviders.map(key => (
              <option key={key.provider} value={key.provider}>
                {key.provider === 'deepl' ? 'DeepL' : key.provider === 'google' ? 'Google翻訳' : key.provider}
              </option>
            ))}
          </select>
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
      <button type="submit" disabled={isLoading || !sourceText.trim()}>
        {isLoading ? '翻訳中...' : '翻訳する'}
      </button>
    </form>
  );
};

export default TranslationForm;
