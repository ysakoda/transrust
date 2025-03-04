use crate::application::usecase::manage_settings::ManageSettingsUseCase;
use crate::domain::entity::settings::Settings;
use std::sync::Arc;
use tauri::State;

#[tauri::command]
pub async fn get_settings(
    use_case: State<'_, Arc<ManageSettingsUseCase>>,
) -> Result<Settings, String> {
    use_case.get_settings().await
}

#[tauri::command]
pub async fn save_settings(
    settings: Settings,
    use_case: State<'_, Arc<ManageSettingsUseCase>>,
) -> Result<Settings, String> {
    use_case.save_settings(settings).await
}
