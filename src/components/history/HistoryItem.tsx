import React from 'react';
import { Translation } from '../../store/slices/translationSlice';

interface HistoryItemProps {
  translation: Translation;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  translation,
  isSelected,
  onClick,
  onDelete,
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      className={`history-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="history-item-date">{formatDate(translation.created_at)}</div>
      <div className="history-item-languages">
        {translation.source_language} → {translation.target_language}
      </div>
      <div className="history-item-source">{truncateText(translation.source_text, 60)}</div>
      <div className="history-item-translation">{truncateText(translation.translated_text, 60)}</div>
      <div className="history-item-provider">{translation.api_source}</div>
      <button className="history-item-delete" onClick={handleDeleteClick}>
        削除
      </button>
    </div>
  );
};

export default HistoryItem;
