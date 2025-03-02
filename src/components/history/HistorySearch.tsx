import React, { useState, useEffect } from 'react';

interface HistorySearchProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

const HistorySearch: React.FC<HistorySearchProps> = ({ onSearch, initialValue = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  useEffect(() => {
    setSearchQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <form className="history-search" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="翻訳履歴を検索..."
        className="history-search-input"
      />
      <button type="submit" className="history-search-button">
        検索
      </button>
      {searchQuery && (
        <button
          type="button"
          className="history-search-clear"
          onClick={handleClear}
        >
          クリア
        </button>
      )}
    </form>
  );
};

export default HistorySearch;
