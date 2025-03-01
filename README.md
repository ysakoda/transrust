# PolyglotDesk

PolyglotDesk is a desktop translation application built with Tauri (Rust) and React. It allows users to translate text using registered translation APIs like DeepL and Google Translate.

## Features

- Clean architecture implementation in Rust and TypeScript
- Multiple translation API support (DeepL initially, with extension planned)
- Translation history and caching
- Secure API key management
- Multi-language support: Japanese, English, Korean, and more

## Project Structure

```
polyglotdesk/
├── src/                   # React frontend
│   ├── components/        # UI components
│   ├── pages/             # Page layouts
│   ├── store/             # Redux state management
│   └── ...
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── adapter/       # Interface adapters layer
│   │   ├── application/   # Application layer (use cases)
│   │   ├── domain/        # Domain layer (core business logic)
│   │   └── infrastructure/ # Infrastructure layer (external services)
│   └── ...
└── ...
```

## Development

### Prerequisites

- Node.js (v18+)
- Rust (stable)
- Optional build dependencies based on platform:
  - Windows: Microsoft Visual C++ Build Tools
  - macOS: Xcode Command Line Tools
  - Linux: Various libraries (see Tauri documentation)

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/polyglotdesk.git
   cd polyglotdesk
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   npm run tauri dev
   ```

### Building

To build the app for production:

```bash
npm run tauri build
```

## API Keys

PolyglotDesk requires translation API keys to function. Currently supported:

- DeepL API (free or pro plans)
- Google Translate API (planned)

You can register your API keys through the application interface.

## License

MIT License
