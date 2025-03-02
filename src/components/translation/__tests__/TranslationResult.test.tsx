import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TranslationResult from '../TranslationResult';
import { Translation } from '../../../store/slices/translationSlice';

describe('TranslationResult', () => {
  it('renders translation results correctly', () => {
    const mockTranslation: Translation = {
      source_text: 'こんにちは',
      translated_text: 'Hello',
      source_language: 'JA',
      target_language: 'EN',
      created_at: new Date().toISOString(),
      api_source: 'DeepL',
    };

    render(<TranslationResult translation={mockTranslation} />);

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText(/ソース言語: JA/)).toBeInTheDocument();
    expect(screen.getByText(/翻訳プロバイダー: DeepL/)).toBeInTheDocument();
  });
});
