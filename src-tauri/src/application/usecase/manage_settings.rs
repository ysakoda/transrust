use crate::domain::entity::settings::Settings;
use crate::domain::repository::settings_repository::SettingsRepository;
use std::sync::Arc;

pub struct ManageSettingsUseCase {
    settings_repository: Arc<dyn SettingsRepository>,
}

impl ManageSettingsUseCase {
    pub fn new(settings_repository: Arc<dyn SettingsRepository>) -> Self {
        Self {
            settings_repository,
        }
    }

    pub async fn get_settings(&self) -> Result<Settings, String> {
        self.settings_repository.get().await
    }

    pub async fn save_settings(&self, settings: Settings) -> Result<Settings, String> {
        self.settings_repository.save(&settings).await
    }
}
