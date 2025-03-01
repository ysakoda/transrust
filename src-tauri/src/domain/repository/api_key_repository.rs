// src-tauri/src/domain/repository/api_key_repository.rs
// APIキーリポジトリのインターフェース
use crate::domain::entity::api_key::ApiKey;
use std::result::Result;

#[async_trait::async_trait]
pub trait ApiKeyRepository: Send + Sync {
    async fn save(&self, api_key: &ApiKey) -> Result<i64, String>;
    async fn find_by_provider(&self, provider: &str) -> Result<Option<ApiKey>, String>;
    async fn find_all(&self) -> Result<Vec<ApiKey>, String>;
    async fn update(&self, api_key: &ApiKey) -> Result<bool, String>;
    async fn delete(&self, id: i64) -> Result<bool, String>;
}
