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
        // DeepL API キーを取得
        let api_key = self
            .api_key_repository
            .find_by_provider("deepl")
            .await?
            .ok_or_else(|| "DeepL API キーが設定されていません".to_string())?;

        if !api_key.is_active {
            return Err("DeepL API キーが無効になっています".to_string());
        }

        // DeepLアダプターを使用して翻訳
        let deepl_adapter = DeepLAdapter::new(api_key.key);
        let translation = deepl_adapter
            .translate(text, source_lang, target_lang)
            .await
            .map_err(|e| format!("翻訳エラー: {}", e))?;

        // 翻訳結果を保存
        let id = self.translation_repository.save(&translation).await?;

        // IDを設定した翻訳結果を返す
        let mut result = translation;
        result.id = Some(id);

        Ok(result)
    }
}
