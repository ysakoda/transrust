use crate::domain::entity::translation::Translation;
use crate::domain::repository::translation_repository::TranslationRepository;
use crate::infrastructure::database::sqlite::Database;
use async_trait::async_trait;
use rusqlite::{params, Result as SqliteResult};
use std::sync::Arc;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

pub struct SqliteTranslationRepository {
    db: Arc<Database>,
}

impl SqliteTranslationRepository {
    pub fn new(db: Arc<Database>) -> Self {
        Self { db }
    }

    fn system_time_to_timestamp(time: SystemTime) -> i64 {
        time.duration_since(UNIX_EPOCH)
            .unwrap_or(Duration::from_secs(0))
            .as_secs() as i64
    }

    fn timestamp_to_system_time(timestamp: i64) -> SystemTime {
        UNIX_EPOCH + Duration::from_secs(timestamp as u64)
    }
}

#[async_trait]
impl TranslationRepository for SqliteTranslationRepository {
    async fn save(&self, translation: &Translation) -> Result<i64, String> {
        let connection = self.db.get_connection();
        let conn = connection.lock().unwrap();

        let timestamp = Self::system_time_to_timestamp(translation.created_at);

        let result: SqliteResult<i64> = conn.query_row(
            "INSERT INTO translations (
                source_text, translated_text, source_language,
                target_language, created_at, api_source
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6)
            RETURNING id",
            params![
                translation.source_text,
                translation.translated_text,
                translation.source_language,
                translation.target_language,
                timestamp,
                translation.api_source
            ],
            |row| row.get(0),
        );

        match result {
            Ok(id) => Ok(id),
            Err(e) => Err(format!("翻訳保存エラー: {}", e)),
        }
    }

    async fn find_by_id(&self, id: i64) -> Result<Option<Translation>, String> {
        let connection = self.db.get_connection();
        let conn = connection.lock().unwrap();

        let result = conn.query_row(
            "SELECT id, source_text, translated_text, source_language,
                    target_language, created_at, api_source
             FROM translations
             WHERE id = ?1",
            params![id],
            |row| {
                let timestamp: i64 = row.get(5)?;
                Ok(Translation {
                    id: Some(row.get(0)?),
                    source_text: row.get(1)?,
                    translated_text: row.get(2)?,
                    source_language: row.get(3)?,
                    target_language: row.get(4)?,
                    created_at: Self::timestamp_to_system_time(timestamp),
                    api_source: row.get(6)?,
                })
            },
        );

        match result {
            Ok(translation) => Ok(Some(translation)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(format!("翻訳検索エラー: {}", e)),
        }
    }

    async fn find_all(&self) -> Result<Vec<Translation>, String> {
        let connection = self.db.get_connection();
        let conn = connection.lock().unwrap();

        let mut stmt = conn
            .prepare(
                "SELECT id, source_text, translated_text, source_language,
                        target_language, created_at, api_source
                 FROM translations
                 ORDER BY created_at DESC",
            )
            .map_err(|e| format!("クエリ準備エラー: {}", e))?;

        let translation_iter = stmt
            .query_map([], |row| {
                let timestamp: i64 = row.get(5)?;
                Ok(Translation {
                    id: Some(row.get(0)?),
                    source_text: row.get(1)?,
                    translated_text: row.get(2)?,
                    source_language: row.get(3)?,
                    target_language: row.get(4)?,
                    created_at: Self::timestamp_to_system_time(timestamp),
                    api_source: row.get(6)?,
                })
            })
            .map_err(|e| format!("クエリ実行エラー: {}", e))?;

        let mut translations = Vec::new();
        for translation in translation_iter {
            translations.push(translation.map_err(|e| format!("行データ取得エラー: {}", e))?);
        }

        Ok(translations)
    }

    async fn find_by_text(&self, text: &str, limit: usize) -> Result<Vec<Translation>, String> {
        let connection = self.db.get_connection();
        let conn = connection.lock().unwrap();

        let search_pattern = format!("%{}%", text);

        let mut stmt = conn
            .prepare(
                "SELECT id, source_text, translated_text, source_language,
                        target_language, created_at, api_source
                 FROM translations
                 WHERE source_text LIKE ?1 OR translated_text LIKE ?1
                 ORDER BY created_at DESC
                 LIMIT ?2",
            )
            .map_err(|e| format!("クエリ準備エラー: {}", e))?;

        let translation_iter = stmt
            .query_map(params![search_pattern, limit as i64], |row| {
                let timestamp: i64 = row.get(5)?;
                Ok(Translation {
                    id: Some(row.get(0)?),
                    source_text: row.get(1)?,
                    translated_text: row.get(2)?,
                    source_language: row.get(3)?,
                    target_language: row.get(4)?,
                    created_at: Self::timestamp_to_system_time(timestamp),
                    api_source: row.get(6)?,
                })
            })
            .map_err(|e| format!("クエリ実行エラー: {}", e))?;

        let mut translations = Vec::new();
        for translation in translation_iter {
            translations.push(translation.map_err(|e| format!("行データ取得エラー: {}", e))?);
        }

        Ok(translations)
    }

    async fn delete(&self, id: i64) -> Result<bool, String> {
        let connection = self.db.get_connection();
        let conn = connection.lock().unwrap();

        let affected = conn
            .execute("DELETE FROM translations WHERE id = ?1", params![id])
            .map_err(|e| format!("翻訳削除エラー: {}", e))?;

        Ok(affected > 0)
    }
}
