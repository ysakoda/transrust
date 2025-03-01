use crate::domain::entity::api_key::ApiKey;
use crate::domain::repository::api_key_repository::ApiKeyRepository;
use crate::infrastructure::database::sqlite::Database;
use async_trait::async_trait;
use rusqlite::{params, Result as SqliteResult};
use std::sync::Arc;

pub struct SqliteApiKeyRepository {
    db: Arc<Database>,
}

impl SqliteApiKeyRepository {
    pub fn new(db: Arc<Database>) -> Self {
        Self { db }
    }
}

#[async_trait]
impl ApiKeyRepository for SqliteApiKeyRepository {
    async fn save(&self, api_key: &ApiKey) -> Result<i64, String> {
        let connection = self.db.get_connection();
        let conn = connection.lock().unwrap();

        let result: SqliteResult<i64> = conn.query_row(
            "INSERT INTO api_keys (provider, key, is_active)
             VALUES (?1, ?2, ?3)
             RETURNING id",
            params![api_key.provider, api_key.key, api_key.is_active],
            |row| row.get(0),
        );

        match result {
            Ok(id) => Ok(id),
            Err(e) => Err(format!("APIキー保存エラー: {}", e)),
        }
    }

    async fn find_by_provider(&self, provider: &str) -> Result<Option<ApiKey>, String> {
        let connection = self.db.get_connection();
        let conn = connection.lock().unwrap();

        let result = conn.query_row(
            "SELECT id, provider, key, is_active FROM api_keys WHERE provider = ?1",
            params![provider],
            |row| {
                Ok(ApiKey {
                    id: Some(row.get(0)?),
                    provider: row.get(1)?,
                    key: row.get(2)?,
                    is_active: row.get(3)?,
                })
            },
        );

        match result {
            Ok(api_key) => Ok(Some(api_key)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(format!("APIキー検索エラー: {}", e)),
        }
    }

    async fn find_all(&self) -> Result<Vec<ApiKey>, String> {
        let connection = self.db.get_connection();
        let conn = connection.lock().unwrap();

        let mut stmt = conn
            .prepare("SELECT id, provider, key, is_active FROM api_keys")
            .map_err(|e| format!("クエリ準備エラー: {}", e))?;

        let api_key_iter = stmt
            .query_map([], |row| {
                Ok(ApiKey {
                    id: Some(row.get(0)?),
                    provider: row.get(1)?,
                    key: row.get(2)?,
                    is_active: row.get(3)?,
                })
            })
            .map_err(|e| format!("クエリ実行エラー: {}", e))?;

        let mut api_keys = Vec::new();
        for api_key in api_key_iter {
            api_keys.push(api_key.map_err(|e| format!("行データ取得エラー: {}", e))?);
        }

        Ok(api_keys)
    }

    async fn update(&self, api_key: &ApiKey) -> Result<bool, String> {
        let connection = self.db.get_connection();
        let conn = connection.lock().unwrap();

        let id = api_key
            .id
            .ok_or_else(|| "IDが指定されていません".to_string())?;

        let affected = conn
            .execute(
                "UPDATE api_keys SET provider = ?1, key = ?2, is_active = ?3 WHERE id = ?4",
                params![api_key.provider, api_key.key, api_key.is_active, id],
            )
            .map_err(|e| format!("APIキー更新エラー: {}", e))?;

        Ok(affected > 0)
    }

    async fn delete(&self, id: i64) -> Result<bool, String> {
        let connection = self.db.get_connection();
        let conn = connection.lock().unwrap();

        let affected = conn
            .execute("DELETE FROM api_keys WHERE id = ?1", params![id])
            .map_err(|e| format!("APIキー削除エラー: {}", e))?;

        Ok(affected > 0)
    }
}
