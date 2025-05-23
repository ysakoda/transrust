use crate::application::usecase::translate_text::TranslateTextUseCase;
use crate::domain::entity::translation::Translation;
use crate::domain::repository::translation_repository::TranslationRepository;
use std::sync::Arc;
use tauri::State;

#[tauri::command]
pub async fn translate(
    text: String,
    source_lang: Option<String>,
    target_lang: String,
    provider: Option<String>,
    use_case: State<'_, Arc<TranslateTextUseCase>>,
) -> Result<Translation, String> {
    use_case
        .execute(text, source_lang, target_lang, provider)
        .await
}

#[tauri::command]
pub async fn get_translation_history(
    repository: State<'_, Arc<dyn TranslationRepository>>,
) -> Result<Vec<Translation>, String> {
    repository.find_all().await
}

#[tauri::command]
pub async fn get_translation_by_id(
    id: i64,
    repository: State<'_, Arc<dyn TranslationRepository>>,
) -> Result<Option<Translation>, String> {
    repository.find_by_id(id).await
}

#[tauri::command]
pub async fn search_translations(
    text: String,
    limit: usize,
    repository: State<'_, Arc<dyn TranslationRepository>>,
) -> Result<Vec<Translation>, String> {
    repository.find_by_text(&text, limit).await
}

#[tauri::command]
pub async fn delete_translation(
    id: i64,
    repository: State<'_, Arc<dyn TranslationRepository>>,
) -> Result<bool, String> {
    repository.delete(id).await
}

#[tauri::command]
pub async fn update_translation(
    id: i64,
    source_text: String,
    translated_text: String,
    source_lang: String,
    target_lang: String,
    use_case: State<'_, Arc<TranslateTextUseCase>>,
) -> Result<bool, String> {
    use_case
        .update_translation(id, source_text, translated_text, source_lang, target_lang)
        .await
}
