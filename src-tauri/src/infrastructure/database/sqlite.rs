use rusqlite::{Connection, Result};
use std::fs;
use std::path::Path;
use std::sync::{Arc, Mutex};
use tauri::Config;

pub struct Database {
    connection: Arc<Mutex<Connection>>,
}

impl Database {
    pub fn new(config: &Config) -> Result<Self, String> {
        let app_name = config
            .product_name
            .clone()
            .unwrap_or_else(|| "PolyglotDesk".to_string());
        let app_data_dir = dirs::data_dir()
            .ok_or_else(|| "アプリデータディレクトリを取得できませんでした".to_string())?
            .join(app_name);

        if !app_data_dir.exists() {
            fs::create_dir_all(&app_data_dir)
                .map_err(|e| format!("アプリデータディレクトリを作成できませんでした: {}", e))?;
        }

        let db_path = app_data_dir.join("polyglot.db");
        let should_init = !Path::new(&db_path).exists();

        let connection =
            Connection::open(db_path).map_err(|e| format!("データベース接続エラー: {}", e))?;

        let db = Self {
            connection: Arc::new(Mutex::new(connection)),
        };

        if should_init {
            db.init_schema()?;
        }

        Ok(db)
    }

    fn init_schema(&self) -> Result<(), String> {
        let conn = self.connection.lock().unwrap();

        conn.execute(
            "CREATE TABLE IF NOT EXISTS api_keys (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                provider TEXT NOT NULL UNIQUE,
                key TEXT NOT NULL,
                is_active INTEGER NOT NULL DEFAULT 1
            )",
            [],
        )
        .map_err(|e| format!("APIキーテーブル作成エラー: {}", e))?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS translations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                source_text TEXT NOT NULL,
                translated_text TEXT NOT NULL,
                source_language TEXT NOT NULL,
                target_language TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                api_source TEXT NOT NULL
            )",
            [],
        )
        .map_err(|e| format!("翻訳テーブル作成エラー: {}", e))?;

        Ok(())
    }

    pub fn get_connection(&self) -> Arc<Mutex<Connection>> {
        self.connection.clone()
    }
}
