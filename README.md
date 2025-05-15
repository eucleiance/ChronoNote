# ChronoNote

A modern note-taking application with time-travel capabilities. Built with React and TipTap editor, featuring persistent storage using IndexedDB.

Try it live at [chrononote.vercel.app](https://chrononote.vercel.app)

## Features

- Rich text editing powered by TipTap
- Automatic snapshot creation for time-travel
- Persistent storage using IndexedDB
- Storage usage tracking
- Snapshot replay functionality

## Implementation Details

### Editor Component

The editor is implemented using TipTap, a headless editor framework based on ProseMirror. The main components are:

#### Editor.tsx
- Uses `@tiptap/react` for the core editor functionality
- Implements the StarterKit extension for basic editing features
- Captures snapshots on content updates
- Maintains JSON-based content structure
- Provides a clean, focused editing interface

#### page.tsx
- Manages the main editor page layout
- Handles snapshot management and storage
- Tracks storage usage
- Provides replay functionality for time-travel
- Displays snapshot count and storage metrics

### Storage

The application uses IndexedDB for persistent storage, allowing:
- Efficient storage of editor snapshots
- Persistent data across browser sessions
- Storage usage monitoring
- Snapshot history management

## Tech Stack

- React 18
- TypeScript
- TipTap Editor
- IndexedDB
- Tailwind CSS

