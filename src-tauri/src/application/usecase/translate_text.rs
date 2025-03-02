use crate::adapter::gateway::translation_api::deepl_adapter::DeepLAdapter;
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
    ) -> Result<Translation, String> {
        let api_key = self
            .api_key_repository
            .find_by_provider("deepl")
            .await?
            .ok_or_else(|| "DeepL API キーが設定されていません".to_string())?;

        if !api_key.is_active {
            return Err("DeepL API キーが無効になっています".to_string());
        }

        let deepl_adapter = DeepLAdapter::new(api_key.key);
        let translation = deepl_adapter
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
