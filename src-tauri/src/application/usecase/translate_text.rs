use crate::adapter::gateway::translation_api::provider_factory::{
    ProviderType, TranslationProviderFactory,
};
use crate::domain::entity::translation::Translation;
use crate::domain::repository::api_key_repository::ApiKeyRepository;
use crate::domain::repository::translation_repository::TranslationRepository;
use std::sync::Arc;

pub struct TranslateTextUseCase {
    translation_repository: Arc<dyn TranslationRepository>,
    api_key_repository: Arc<dyn ApiKeyRepository>,
}

impl TranslateTextUseCase {
    pub fn new(
        translation_repository: Arc<dyn TranslationRepository>,
        api_key_repository: Arc<dyn ApiKeyRepository>,
    ) -> Self {
        Self {
            translation_repository,
            api_key_repository,
        }
    }

    pub async fn execute(
        &self,
        text: String,
        source_lang: Option<String>,
        target_lang: String,
        provider_name: Option<String>,
    ) -> Result<Translation, String> {
        let provider_name = provider_name.unwrap_or_else(|| "deepl".to_string());

        let provider_type = match provider_name.to_lowercase().as_str() {
            "google" => ProviderType::Google,
            _ => ProviderType::DeepL,
        };

        let api_key = self
            .api_key_repository
            .find_by_provider(&provider_name)
            .await?
            .ok_or_else(|| format!("{} API キーが設定されていません", provider_name))?;

        if !api_key.is_active {
            return Err(format!("{} API キーが無効になっています", provider_name));
        }

        let provider = TranslationProviderFactory::create_provider(provider_type, api_key.key);

        let translation = provider
            .translate(text, source_lang, target_lang)
            .await
            .map_err(|e| format!("翻訳エラー: {}", e))?;

        let id = self.translation_repository.save(&translation).await?;

        let mut result = translation;
        result.id = Some(id);

        Ok(result)
    }

    pub async fn update_translation(
        &self,
        id: i64,
        source_text: String,
        translated_text: String,
        source_lang: String,
        target_lang: String,
    ) -> Result<bool, String> {
        let existing = self
            .translation_repository
            .find_by_id(id)
            .await?
            .ok_or_else(|| format!("ID: {}の翻訳が見つかりません", id))?;

        let updated = Translation {
            id: Some(id),
            source_text,
            translated_text,
            source_language: source_lang,
            target_language: target_lang,
            created_at: existing.created_at,
            api_source: existing.api_source,
        };

        self.translation_repository.update(&updated).await
    }
}
