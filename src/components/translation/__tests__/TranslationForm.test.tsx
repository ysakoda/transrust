import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../../test/test-utils';
import TranslationForm from '../TranslationForm';

describe('TranslationForm', () => {
  it('renders with basic elements', () => {
    const preloadedState = {
      apiKeys: {
        apiKeys: [{ id: 1, provider: 'deepl', key: 'test-key', is_active: true }],
        loading: false,
        error: null,
      },
    };

    renderWithProviders(<TranslationForm onTranslate={() => {}} isLoading={false} />, {
      preloadedState,
    });

    const button = document.querySelector('button');
    expect(button).not.toBeNull();
  });
});
