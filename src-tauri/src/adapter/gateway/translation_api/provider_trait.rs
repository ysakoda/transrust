use crate::domain::entity::translation::Translation;
use async_trait::async_trait;
use std::error::Error;

#[async_trait]
pub trait TranslationProvider: Send + Sync {
    async fn translate(
        &self,
        text: String,
        source_lang: Option<String>,
        target_lang: String,
    ) -> Result<Translation, Box<dyn Error>>;
}
