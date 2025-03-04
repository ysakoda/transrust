use crate::domain::entity::settings::Settings;
use crate::domain::repository::settings_repository::SettingsRepository;
use crate::infrastructure::database::sqlite::Database;
use async_trait::async_trait;
use rusqlite::params;
use std::sync::Arc;

pub struct SqliteSettingsRepository {
    db: Arc<Database>,
}

impl SqliteSettingsRepository {
    pub fn new(db: Arc<Database>) -> Self {
        Self { db }
    }
}

#[async_trait]
impl SettingsRepository for SqliteSettingsRepository {
    async fn save(&self, settings: &Settings) -> Result<Settings, String> {
        let connection = self.db.get_connection();
        let conn = connection.lock().unwrap();

        conn.execute(
            "CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                theme TEXT NOT NULL,
                default_source_language TEXT,
                default_target_language TEXT NOT NULL,
                default_provider TEXT NOT NULL,
                history_limit INTEGER NOT NULL,
                cache_enabled INTEGER NOT NULL
            )",
            [],
        )
        .map_err(|e| format!("設定テーブル作成エラー: {}", e))?;

        let count: i64 = conn
            .query_row("SELECT COUNT(*) FROM settings WHERE id = 1", [], |row| {
                row.get(0)
            })
            .map_err(|e| format!("設定確認エラー: {}", e))?;

        if count == 0 {
            conn.execute(
                "INSERT INTO settings (
                    id, theme, default_source_language, default_target_language,
                    default_provider, history_limit, cache_enabled
                ) VALUES (1, ?1, ?2, ?3, ?4, ?5, ?6)",
                params![
                    settings.theme,
                    settings.default_source_language,
                    settings.default_target_language,
                    settings.default_provider,
                    settings.history_limit,
                    settings.cache_enabled as i32
                ],
            )
            .map_err(|e| format!("設定保存エラー: {}", e))?;
        } else {
            conn.execute(
                "UPDATE settings SET
                    theme = ?1,
                    default_source_language = ?2,
                    default_target_language = ?3,
                    default_provider = ?4,
                    history_limit = ?5,
                    cache_enabled = ?6
                WHERE id = 1",
                params![
                    settings.theme,
                    settings.default_source_language,
                    settings.default_target_language,
                    settings.default_provider,
                    settings.history_limit,
                    settings.cache_enabled as i32
                ],
            )
            .map_err(|e| format!("設定更新エラー: {}", e))?;
        }

        let mut result = settings.clone();
        result.id = Some(1);
        Ok(result)
    }

    async fn get(&self) -> Result<Settings, String> {
        let connection = self.db.get_connection();
        let conn = connection.lock().unwrap();

        conn.execute(
            "CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                theme TEXT NOT NULL,
                default_source_language TEXT,
                default_target_language TEXT NOT NULL,
                default_provider TEXT NOT NULL,
                history_limit INTEGER NOT NULL,
                cache_enabled INTEGER NOT NULL
            )",
            [],
        )
        .map_err(|e| format!("設定テーブル作成エラー: {}", e))?;

        let count: i64 = conn
            .query_row("SELECT COUNT(*) FROM settings WHERE id = 1", [], |row| {
                row.get(0)
            })
            .map_err(|e| format!("設定確認エラー: {}", e))?;

        if count == 0 {
            let default_settings = Settings::default();
            conn.execute(
                "INSERT INTO settings (
                    id, theme, default_source_language, default_target_language,
                    default_provider, history_limit, cache_enabled
                ) VALUES (1, ?1, ?2, ?3, ?4, ?5, ?6)",
                params![
                    default_settings.theme,
                    default_settings.default_source_language,
                    default_settings.default_target_language,
                    default_settings.default_provider,
                    default_settings.history_limit,
                    default_settings.cache_enabled as i32
                ],
            )
            .map_err(|e| format!("デフォルト設定保存エラー: {}", e))?;

            let mut result = default_settings;
            result.id = Some(1);
            return Ok(result);
        }

        let result = conn.query_row(
            "SELECT
                id, theme, default_source_language, default_target_language,
                default_provider, history_limit, cache_enabled
            FROM settings
            WHERE id = 1",
            [],
            |row| {
                Ok(Settings {
                    id: Some(row.get(0)?),
                    theme: row.get(1)?,
                    default_source_language: row.get(2)?,
                    default_target_language: row.get(3)?,
                    default_provider: row.get(4)?,
                    history_limit: row.get(5)?,
                    cache_enabled: row.get::<_, i32>(6)? != 0,
                })
            },
        );

        match result {
            Ok(settings) => Ok(settings),
            Err(e) => Err(format!("設定取得エラー: {}", e)),
        }
    }
}
