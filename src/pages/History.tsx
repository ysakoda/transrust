import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { RootState } from '../store/rootReducer';
import {
  fetchTranslationHistory,
  deleteTranslation,
  searchTranslations,
  Translation,
} from '../store/slices/translationSlice';
import HistoryList from '../components/history/HistoryList';
import HistorySearch from '../components/history/HistorySearch';
import HistoryDetail from '../components/history/HistoryDetail';
import '../styles/History.css';

const History: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { history, loading, error } = useSelector((state: RootState) => state.translation);
  const [selectedTranslation, setSelectedTranslation] = useState<Translation | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    dispatch(fetchTranslationHistory());
  }, [dispatch]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      dispatch(searchTranslations({ text: query, limit: 100 }));
    } else {
      dispatch(fetchTranslationHistory());
    }
  };

  const handleSelectTranslation = (translation: Translation) => {
    setSelectedTranslation(translation);
  };

  const handleDeleteTranslation = (id: number) => {
    if (window.confirm('この翻訳履歴を削除してもよろしいですか？')) {
      dispatch(deleteTranslation(id));
      if (selectedTranslation?.id === id) {
        setSelectedTranslation(null);
      }
    }
  };

  const handleCloseDetail = () => {
    setSelectedTranslation(null);
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <h2>翻訳履歴</h2>
      </div>

      <HistorySearch onSearch={handleSearchChange} initialValue={searchQuery} />

      {error && <div className="error-message">{error}</div>}

      <div className="history-content">
        <div className="history-list-container">
          <HistoryList
            translations={history}
            isLoading={loading}
            onSelect={handleSelectTranslation}
            onDelete={handleDeleteTranslation}
            selectedId={selectedTranslation?.id}
          />
        </div>

        {selectedTranslation && (
          <div className="history-detail-container">
            <HistoryDetail
              translation={selectedTranslation}
              onClose={handleCloseDetail}
              onDelete={() => selectedTranslation.id && handleDeleteTranslation(selectedTranslation.id)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
