import React from 'react';
import { Translation } from '../../store/slices/translationSlice';

interface TranslationResultProps {
  translation: Translation;
}

const TranslationResult: React.FC<TranslationResultProps> = ({ translation }) => {
  return (
    <div className="translation-result">
      <h3>翻訳結果</h3>
      <div className="result-content">
        <p>{translation.translated_text}</p>
      </div>
      <div className="result-meta">
        <span>ソース言語: {translation.source_language}</span>
        <span>翻訳プロバイダー: {translation.api_source}</span>
      </div>
    </div>
  );
};

export default TranslationResult;
