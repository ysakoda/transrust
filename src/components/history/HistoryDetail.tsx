import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { Translation, updateTranslation } from '../../store/slices/translationSlice';
import TranslationEditForm from '../translation/TranslationEditForm';

interface HistoryDetailProps {
  translation: Translation;
  onClose: () => void;
  onDelete: () => void;
}

const HistoryDetail: React.FC<HistoryDetailProps> = ({
  translation,
  onClose,
  onDelete,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);

  // 日付フォーマット
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (editedTranslation: Translation) => {
    if (editedTranslation.id) {
      dispatch(
        updateTranslation({
          id: editedTranslation.id,
          source_text: editedTranslation.source_text,
          translated_text: editedTranslation.translated_text,
          source_language: editedTranslation.source_language,
          target_language: editedTranslation.target_language,
        })
      );
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="history-detail editing">
        <div className="history-detail-header">
          <h3>翻訳の編集</h3>
          <button onClick={handleCancelEdit} className="history-detail-close">
            キャンセル
          </button>
        </div>
        <TranslationEditForm
          translation={translation}
          onSave={handleSave}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  return (
    <div className="history-detail">
      <div className="history-detail-header">
        <h3>翻訳詳細</h3>
        <button onClick={onClose} className="history-detail-close">
          閉じる
        </button>
      </div>
      <div className="history-detail-content">
        <div className="history-detail-meta">
          <div>
            <span className="detail-label">翻訳日時:</span>
            <span>{formatDate(translation.created_at)}</span>
          </div>
          <div>
            <span className="detail-label">翻訳サービス:</span>
            <span>{translation.api_source}</span>
          </div>
          <div>
            <span className="detail-label">言語:</span>
            <span>
              {translation.source_language} → {translation.target_language}
            </span>
          </div>
        </div>

        <div className="history-detail-source">
          <h4>元のテキスト:</h4>
          <div className="detail-text">{translation.source_text}</div>
        </div>

        <div className="history-detail-translation">
          <h4>翻訳テキスト:</h4>
          <div className="detail-text">{translation.translated_text}</div>
        </div>

        <div className="history-detail-actions">
          <button onClick={handleEdit} className="edit-button">
            編集
          </button>
          <button onClick={onDelete} className="delete-button">
            削除
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetail;
