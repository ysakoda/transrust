use crate::application::usecase::manage_api_key::ManageApiKeyUseCase;
use crate::domain::entity::api_key::ApiKey;
use std::sync::Arc;
use tauri::State;

#[tauri::command]
pub async fn register_api_key(
    provider: String,
    key: String,
    use_case: State<'_, Arc<ManageApiKeyUseCase>>,
) -> Result<i64, String> {
    use_case.register_api_key(provider, key).await
}

#[tauri::command]
pub async fn get_api_key(
    provider: String,
    use_case: State<'_, Arc<ManageApiKeyUseCase>>,
) -> Result<Option<ApiKey>, String> {
    use_case.get_api_key(&provider).await
}

#[tauri::command]
pub async fn get_all_api_keys(
    use_case: State<'_, Arc<ManageApiKeyUseCase>>,
) -> Result<Vec<ApiKey>, String> {
    use_case.get_all_api_keys().await
}

#[tauri::command]
pub async fn toggle_api_key_status(
    id: i64,
    active: bool,
    use_case: State<'_, Arc<ManageApiKeyUseCase>>,
) -> Result<bool, String> {
    use_case.toggle_api_key_status(id, active).await
}

#[tauri::command]
pub async fn delete_api_key(
    id: i64,
    use_case: State<'_, Arc<ManageApiKeyUseCase>>,
) -> Result<bool, String> {
    use_case.delete_api_key(id).await
}
