use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Settings {
    pub id: Option<i64>,
    pub theme: String,
    pub default_source_language: Option<String>,
    pub default_target_language: String,
    pub default_provider: String,
    pub history_limit: i32,
    pub cache_enabled: bool,
}

impl Settings {
    pub fn default() -> Self {
        Self {
            id: None,
            theme: "dark".to_string(),
            default_source_language: None,
            default_target_language: "EN".to_string(),
            default_provider: "deepl".to_string(),
            history_limit: 100,
            cache_enabled: true,
        }
    }
}
