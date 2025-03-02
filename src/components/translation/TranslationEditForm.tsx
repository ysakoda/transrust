import React, { useState } from 'react';
import { Translation } from '../../store/slices/translationSlice';

interface TranslationEditFormProps {
  translation: Translation;
  onSave: (editedTranslation: Translation) => void;
  onCancel: () => void;
}

const TranslationEditForm: React.FC<TranslationEditFormProps> = ({
  translation,
  onSave,
  onCancel,
}) => {
  const [editedSourceText, setEditedSourceText] = useState(translation.source_text);
  const [editedTranslatedText, setEditedTranslatedText] = useState(translation.translated_text);
  const [sourceLang, setSourceLang] = useState(translation.source_language);
  const [targetLang, setTargetLang] = useState(translation.target_language);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editedSourceText.trim() && editedTranslatedText.trim()) {
      const editedTranslation: Translation = {
        ...translation,
        source_text: editedSourceText,
        translated_text: editedTranslatedText,
        source_language: sourceLang,
        target_language: targetLang,
      };

      onSave(editedTranslation);
    }
  };

  return (
    <form className="translation-edit-form" onSubmit={handleSubmit}>
      <h3>翻訳の編集</h3>

      <div className="form-group">
        <label>ソース言語:</label>
        <select value={sourceLang} onChange={e => setSourceLang(e.target.value)} required>
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

      <div className="form-group">
        <label>元のテキスト:</label>
        <textarea
          value={editedSourceText}
          onChange={e => setEditedSourceText(e.target.value)}
          rows={4}
          required
        />
      </div>

      <div className="form-group">
        <label>ターゲット言語:</label>
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

      <div className="form-group">
        <label>翻訳テキスト:</label>
        <textarea
          value={editedTranslatedText}
          onChange={e => setEditedTranslatedText(e.target.value)}
          rows={4}
          required
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel}>
          キャンセル
        </button>
        <button type="submit">保存</button>
      </div>
    </form>
  );
};

export default TranslationEditForm;
