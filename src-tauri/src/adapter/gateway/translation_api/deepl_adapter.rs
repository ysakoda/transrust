use crate::domain::entity::translation::Translation;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::error::Error;
use std::time::SystemTime;

const DEEPL_API_URL: &str = "https://api-free.deepl.com/v2/translate";

#[derive(Serialize)]
struct DeepLRequest {
    text: Vec<String>,
    source_lang: Option<String>,
    target_lang: String,
}

#[derive(Deserialize)]
struct DeepLResponse {
    translations: Vec<DeepLTranslation>,
}

#[derive(Deserialize)]
struct DeepLTranslation {
    text: String,
    detected_source_language: String,
}

pub struct DeepLAdapter {
    client: Client,
    api_key: String,
}

impl DeepLAdapter {
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
        let request = DeepLRequest {
            text: vec![text.clone()],
            source_lang: source_lang.clone(),
            target_lang: target_lang.clone(),
        };

        let response = self
            .client
            .post(DEEPL_API_URL)
            .header("Authorization", format!("DeepL-Auth-Key {}", self.api_key))
            .json(&request)
            .send()
            .await?
            .json::<DeepLResponse>()
            .await?;

        if response.translations.is_empty() {
            return Err("DeepL APIからの応答に翻訳が含まれていません".into());
        }

        let translation = &response.translations[0];
        let source_language = source_lang.unwrap_or_else(|| translation.detected_source_language.clone());

        Ok(Translation {
            id: None,
            source_text: text,
            translated_text: translation.text.clone(),
            source_language,
            target_language: target_lang,
            created_at: SystemTime::now(),
            api_source: "DeepL".to_string(),
        })
    }
}
