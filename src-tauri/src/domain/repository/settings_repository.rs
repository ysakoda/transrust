use crate::domain::entity::settings::Settings;
use std::result::Result;

#[async_trait::async_trait]
pub trait SettingsRepository: Send + Sync {
    async fn save(&self, settings: &Settings) -> Result<Settings, String>;
    async fn get(&self) -> Result<Settings, String>;
}
