mod adapter;
mod application;
mod domain;
mod infrastructure;

use adapter::controller::{
    api_key_controller::{
        delete_api_key, get_all_api_keys, get_api_key, register_api_key, toggle_api_key_status,
    },
    translation_controller::{
        delete_translation, get_translation_by_id, get_translation_history, search_translations,
        translate,
    },
};
use application::usecase::{
    manage_api_key::ManageApiKeyUseCase, translate_text::TranslateTextUseCase,
};
use infrastructure::{
    database::sqlite::Database,
    repository::{
        sqlite_api_key_repository::SqliteApiKeyRepository,
        sqlite_translation_repository::SqliteTranslationRepository,
    },
};
use std::sync::Arc;
use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let config = app.config();

            let db = Arc::new(Database::new(&config).expect("データベースの初期化に失敗しました"));

            let translation_repo = Arc::new(SqliteTranslationRepository::new(db.clone()));
            let api_key_repo = Arc::new(SqliteApiKeyRepository::new(db.clone()));

            let manage_api_key_use_case = Arc::new(ManageApiKeyUseCase::new(api_key_repo.clone()));
            let translate_text_use_case = Arc::new(TranslateTextUseCase::new(
                translation_repo.clone(),
                api_key_repo.clone(),
            ));

            app.manage(
                translation_repo
                    as Arc<dyn domain::repository::translation_repository::TranslationRepository>,
            );
            app.manage(
                api_key_repo as Arc<dyn domain::repository::api_key_repository::ApiKeyRepository>,
            );
            app.manage(manage_api_key_use_case);
            app.manage(translate_text_use_case);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            register_api_key,
            get_api_key,
            get_all_api_keys,
            toggle_api_key_status,
            delete_api_key,
            translate,
            get_translation_history,
            get_translation_by_id,
            search_translations,
            delete_translation
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
