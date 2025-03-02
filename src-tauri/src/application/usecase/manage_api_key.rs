use crate::domain::entity::api_key::ApiKey;
use crate::domain::repository::api_key_repository::ApiKeyRepository;
use std::sync::Arc;

pub struct ManageApiKeyUseCase {
    api_key_repository: Arc<dyn ApiKeyRepository>,
}

impl ManageApiKeyUseCase {
    pub fn new(api_key_repository: Arc<dyn ApiKeyRepository>) -> Self {
        Self { api_key_repository }
    }

    pub async fn register_api_key(&self, provider: String, key: String) -> Result<i64, String> {
        let api_key = ApiKey::new(provider.clone(), key);

        // 既存のキーがあるか確認
        if let Some(existing_key) = self.api_key_repository.find_by_provider(&provider).await? {
            // 既存のキーを更新
            let mut updated_key = existing_key;
            updated_key.key = api_key.key;
            updated_key.is_active = true;

            self.api_key_repository.update(&updated_key).await?;
            return Ok(updated_key.id.unwrap());
        }

        // 新しいキーを保存
        self.api_key_repository.save(&api_key).await
    }

    pub async fn get_api_key(&self, provider: &str) -> Result<Option<ApiKey>, String> {
        self.api_key_repository.find_by_provider(provider).await
    }

    pub async fn get_all_api_keys(&self) -> Result<Vec<ApiKey>, String> {
        self.api_key_repository.find_all().await
    }

    pub async fn toggle_api_key_status(&self, id: i64, active: bool) -> Result<bool, String> {
        // IDからAPIキーを検索
        let api_keys = self.api_key_repository.find_all().await?;
        let api_key = api_keys
            .iter()
            .find(|k| k.id == Some(id))
            .ok_or_else(|| format!("ID: {}のAPIキーが見つかりません", id))?;

        // ステータスを更新
        let mut updated_key = api_key.clone();
        updated_key.is_active = active;

        self.api_key_repository.update(&updated_key).await
    }

    pub async fn delete_api_key(&self, id: i64) -> Result<bool, String> {
        self.api_key_repository.delete(id).await
    }
}
