import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import {
  translateText,
  fetchTranslationHistory
} from '../store/slices/translationSlice';
import { RootState } from '../store/rootReducer';
import {
  fetchApiKeys,
  registerApiKey
} from '../store/slices/apiKeySlice';
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

  const handleTranslate = (
    text: string,
    sourceLang: string | undefined,
    targetLang: string
  ) => {
    dispatch(translateText({ text, sourceLang, targetLang }));
  };

  const handleSubmitApiKey = (provider: string, key: string) => {
    dispatch(registerApiKey({ provider, key }));
    setShowApiKeyForm(false);
  };

  const hasDeeplApiKey = apiKeys.some(key => key.provider === 'deepl' && key.is_active);

  return (
    <div className="translation-page">
      {!hasDeeplApiKey && !showApiKeyForm ? (
        <div className="api-key-notice">
          <p>翻訳を使用するには、DeepL API キーを設定してください。</p>
          <button onClick={() => setShowApiKeyForm(true)}>
            API キーを設定する
          </button>
        </div>
      ) : showApiKeyForm ? (
        <ApiKeyForm
          onSubmit={handleSubmitApiKey}
          onCancel={() => setShowApiKeyForm(false)}
        />
      ) : (
        <>
          <TranslationForm onTranslate={handleTranslate} isLoading={loading} />
          {error && <div className="error-message">{error}</div>}
          {currentTranslation && <TranslationResult translation={currentTranslation} />}
        </>
      )}
    </div>
  );
};

export default Translation;
