use serde::{Deserialize, Serialize};
use std::time::SystemTime;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Translation {
    pub id: Option<i64>,
    pub source_text: String,
    pub translated_text: String,
    pub source_language: String,
    pub target_language: String,
    pub created_at: SystemTime,
    pub api_source: String,
}

impl Translation {
    #[allow(dead_code)]
    pub fn new(
        source_text: String,
        translated_text: String,
        source_language: String,
        target_language: String,
        api_source: String,
    ) -> Self {
        Self {
            id: None,
            source_text,
            translated_text,
            source_language,
            target_language,
            created_at: SystemTime::now(),
            api_source,
        }
    }
}
