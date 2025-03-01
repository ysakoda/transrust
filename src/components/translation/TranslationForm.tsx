import React, { useState } from 'react';

interface TranslationFormProps {
  onTranslate: (text: string, sourceLang: string | undefined, targetLang: string) => void;
  isLoading: boolean;
}

const TranslationForm: React.FC<TranslationFormProps> = ({ onTranslate, isLoading }) => {
  const [sourceText, setSourceText] = useState('');
  const [sourceLang, setSourceLang] = useState<string | undefined>(undefined);
  const [targetLang, setTargetLang] = useState('EN');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceText.trim()) {
      onTranslate(sourceText, sourceLang, targetLang);
    }
  };

  return (
    <form className="translation-form" onSubmit={handleSubmit}>
      <div className="form-controls">
        <div className="language-selectors">
          <select
            value={sourceLang || ''}
            onChange={(e) => setSourceLang(e.target.value || undefined)}
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
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            required
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
      <textarea
        value={sourceText}
        onChange={(e) => setSourceText(e.target.value)}
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
