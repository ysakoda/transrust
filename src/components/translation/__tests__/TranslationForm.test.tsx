import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import TranslationForm from '../TranslationForm';

describe('TranslationForm', () => {
  it('renders with basic elements', () => {
    render(<TranslationForm onTranslate={() => {}} isLoading={false} />);

    const button = document.querySelector('button');
    expect(button).not.toBeNull();
  });
});
