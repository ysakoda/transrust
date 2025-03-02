import React, { useState } from 'react';
import { Translation } from '../../store/slices/translationSlice';
import TranslationEditForm from './TranslationEditForm';

interface TranslationResultProps {
  translation: Translation;
  onEdit?: (editedTranslation: Translation) => void;
}

const TranslationResult: React.FC<TranslationResultProps> = ({ translation, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (editedTranslation: Translation) => {
    if (onEdit) {
      onEdit(editedTranslation);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <TranslationEditForm
        translation={translation}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="translation-result">
      <div className="result-header">
        <h3>翻訳結果</h3>
        {onEdit && (
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            編集
          </button>
        )}
      </div>
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
