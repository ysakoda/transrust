import React from 'react';
import { Translation } from '../../store/slices/translationSlice';
import HistoryItem from './HistoryItem';

interface HistoryListProps {
  translations: Translation[];
  isLoading: boolean;
  onSelect: (translation: Translation) => void;
  onDelete: (id: number) => void;
  selectedId?: number;
}

const HistoryList: React.FC<HistoryListProps> = ({
  translations,
  isLoading,
  onSelect,
  onDelete,
  selectedId,
}) => {
  if (isLoading) {
    return <div className="history-loading">読み込み中...</div>;
  }

  if (translations.length === 0) {
    return <div className="history-empty">翻訳履歴がありません</div>;
  }

  return (
    <div className="history-list">
      {translations.map((translation) => (
        <HistoryItem
          key={translation.id}
          translation={translation}
          isSelected={translation.id === selectedId}
          onClick={() => onSelect(translation)}
          onDelete={() => translation.id && onDelete(translation.id)}
        />
      ))}
    </div>
  );
};

export default HistoryList;
