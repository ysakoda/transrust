use crate::domain::entity::translation::Translation;
use std::result::Result;

#[async_trait::async_trait]
pub trait TranslationRepository: Send + Sync {
    async fn save(&self, translation: &Translation) -> Result<i64, String>;
    async fn find_by_id(&self, id: i64) -> Result<Option<Translation>, String>;
    async fn find_all(&self) -> Result<Vec<Translation>, String>;
    async fn find_by_text(&self, text: &str, limit: usize) -> Result<Vec<Translation>, String>;
    async fn update(&self, translation: &Translation) -> Result<bool, String>;
    async fn delete(&self, id: i64) -> Result<bool, String>;
}
