use crate::adapter::gateway::translation_api::provider_trait::TranslationProvider;
use crate::domain::entity::translation::Translation;
use async_trait::async_trait;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::error::Error;
use std::time::SystemTime;

const GOOGLE_TRANSLATE_API_URL: &str = "https://translation.googleapis.com/v2/translate";

#[derive(Serialize)]
struct GoogleTranslateRequest {
    q: Vec<String>,
    source: Option<String>,
    target: String,
    format: String,
    key: String,
}

#[derive(Deserialize)]
struct GoogleTranslateResponse {
    data: GoogleTranslateData,
}

#[derive(Deserialize)]
struct GoogleTranslateData {
    translations: Vec<GoogleTranslation>,
}

#[derive(Deserialize)]
struct GoogleTranslation {
    translated_text: String,
    detected_source_language: Option<String>,
}

pub struct GoogleTranslateAdapter {
    client: Client,
    api_key: String,
}

impl GoogleTranslateAdapter {
    pub fn new(api_key: String) -> Self {
        Self {
            client: Client::new(),
            api_key,
        }
    }

    pub async fn translate(
        &self,
        text: String,
        source_lang: Option<String>,
        target_lang: String,
    ) -> Result<Translation, Box<dyn Error>> {
        // Google APIは言語コードを小文字で期待するため、変換
        // as_ref()を使用して参照を取得
        let source = source_lang.as_ref().map(|s| s.to_lowercase());
        let target = target_lang.to_lowercase();

        let request = GoogleTranslateRequest {
            q: vec![text.clone()],
            source,
            target,
            format: "text".to_string(),
            key: self.api_key.clone(),
        };

        let response = self
            .client
            .post(GOOGLE_TRANSLATE_API_URL)
            .json(&request)
            .send()
            .await?
            .json::<GoogleTranslateResponse>()
            .await?;

        if response.data.translations.is_empty() {
            return Err("Google Translate APIからの応答に翻訳が含まれていません".into());
        }

        let translation = &response.data.translations[0];
        let source_language = source_lang.unwrap_or_else(|| {
            translation
                .detected_source_language
                .clone()
                .unwrap_or_else(|| "auto".to_string())
        });

        Ok(Translation {
            id: None,
            source_text: text,
            translated_text: translation.translated_text.clone(),
            source_language,
            target_language: target_lang,
            created_at: SystemTime::now(),
            api_source: "Google".to_string(),
        })
    }
}

#[async_trait]
impl TranslationProvider for GoogleTranslateAdapter {
    async fn translate(
        &self,
        text: String,
        source_lang: Option<String>,
        target_lang: String,
    ) -> Result<Translation, Box<dyn Error>> {
        self.translate(text, source_lang, target_lang).await
    }
}
