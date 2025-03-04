use super::deepl_adapter::DeepLAdapter;
use super::google_adapter::GoogleTranslateAdapter;
use super::provider_trait::TranslationProvider;
use std::sync::Arc;

pub enum ProviderType {
    DeepL,
    Google,
}

pub struct TranslationProviderFactory;

impl TranslationProviderFactory {
    pub fn create_provider(
        provider_type: ProviderType,
        api_key: String,
    ) -> Arc<dyn TranslationProvider> {
        match provider_type {
            ProviderType::DeepL => Arc::new(DeepLAdapter::new(api_key)),
            ProviderType::Google => Arc::new(GoogleTranslateAdapter::new(api_key)),
        }
    }
}
