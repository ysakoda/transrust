import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import {
  translateText,
  fetchTranslationHistory,
  updateTranslation,
  Translation as TranslationType,
} from '../store/slices/translationSlice';
import { RootState } from '../store/rootReducer';
import { fetchApiKeys, registerApiKey } from '../store/slices/apiKeySlice';
import TranslationForm from '../components/translation/TranslationForm';
import TranslationResult from '../components/translation/TranslationResult';
import ApiKeyForm from '../components/settings/ApiKeyForm';

const Translation: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentTranslation, loading, error } = useSelector(
    (state: RootState) => state.translation
  );
  const { apiKeys } = useSelector((state: RootState) => state.apiKeys);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);

  useEffect(() => {
    dispatch(fetchApiKeys());
    dispatch(fetchTranslationHistory());
  }, [dispatch]);

  const handleTranslate = (text: string, sourceLang: string | undefined, targetLang: string) => {
    dispatch(translateText({ text, sourceLang, targetLang }));
  };

  const handleSubmitApiKey = (provider: string, key: string) => {
    dispatch(registerApiKey({ provider, key }));
    setShowApiKeyForm(false);
  };

  const handleEditTranslation = (editedTranslation: TranslationType) => {
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
  };

  const hasDeeplApiKey = apiKeys.some(key => key.provider === 'deepl' && key.is_active);

  return (
    <div className="translation-page">
      {!hasDeeplApiKey && !showApiKeyForm ? (
        <div className="api-key-notice">
          <p>翻訳を使用するには、DeepL API キーを設定してください。</p>
          <button onClick={() => setShowApiKeyForm(true)}>API キーを設定する</button>
        </div>
      ) : showApiKeyForm ? (
        <ApiKeyForm onSubmit={handleSubmitApiKey} onCancel={() => setShowApiKeyForm(false)} />
      ) : (
        <>
          <div className="translation-header">
            <h2>翻訳</h2>
            <button className="settings-button" onClick={() => setShowApiKeyForm(true)}>
              API キー設定
            </button>
          </div>
          <TranslationForm onTranslate={handleTranslate} isLoading={loading} />
          {error && <div className="error-message">{error}</div>}
          {currentTranslation && (
            <TranslationResult translation={currentTranslation} onEdit={handleEditTranslation} />
          )}
        </>
      )}
    </div>
  );
};

export default Translation;
