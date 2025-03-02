use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApiKey {
    pub id: Option<i64>,
    pub provider: String,
    pub key: String,
    pub is_active: bool,
}

impl ApiKey {
    pub fn new(provider: String, key: String) -> Self {
        Self {
            id: None,
            provider,
            key,
            is_active: true,
        }
    }
}
