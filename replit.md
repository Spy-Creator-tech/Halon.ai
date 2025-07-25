# Halon AI Assistant

## Overview

Halon is a modern AI-powered desktop assistant application built with a full-stack TypeScript architecture. The application features a futuristic UI with voice interaction capabilities (in supported browsers) and various AI-powered functionalities including chat, content generation, and web service integration. Originally conceived as a mobile assistant, it has been adapted as a web-based desktop application.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a clean separation between client and server with shared schemas and utilities:

- **Frontend**: React with TypeScript using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM (configured but minimal usage)
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI Integration**: OpenAI API for chat and content generation
- **Voice Features**: Web Speech API for recognition and synthesis

## Key Components

### Frontend Structure
- **React SPA**: Single-page application using Wouter for routing
- **Component Library**: shadcn/ui components for consistent UI
- **State Management**: React Query for server state, local state with hooks
- **Voice Integration**: Custom hooks for speech recognition and text-to-speech
- **UI Theme**: Dark futuristic theme with cyan/purple gradient accents

### Backend Architecture
- **Express Server**: RESTful API with middleware for logging and error handling
- **AI Services**: OpenAI integration for chat responses and content generation
- **Storage**: PostgreSQL database with Drizzle ORM for persistent chat history and user data
- **Development Setup**: Vite integration for hot reloading in development

### Database Schema
The application now uses PostgreSQL with Drizzle ORM for persistent data storage. Key database tables include:

- **chat_messages**: Stores all user and AI conversations with session tracking
- **quick_actions**: Logs all quick action executions with parameters
- **users**: Basic user management (prepared for future authentication)

All chat conversations are automatically saved and loaded on app startup, providing continuity between sessions.

## Data Flow

1. **Voice Input**: User speaks "Ok Halon" followed by commands
2. **Speech Processing**: Web Speech API converts speech to text
3. **AI Processing**: Text sent to OpenAI API for response generation
4. **Response Handling**: AI response converted back to speech and displayed in chat
5. **Quick Actions**: Direct device control simulation through predefined actions

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components
- **tailwindcss**: Utility-first CSS framework
- **express**: Web server framework
- **openai**: Official OpenAI API client

### UI and Styling
- **shadcn/ui**: Pre-built React components
- **class-variance-authority**: Component variant management
- **clsx** and **tailwind-merge**: Conditional styling utilities
- **lucide-react**: Icon library

### Voice and Audio
- Web Speech API (native browser APIs)
- Text-to-Speech synthesis (native browser APIs)

## Deployment Strategy

The application is configured for deployment with:

- **Build Process**: Vite builds the client, esbuild bundles the server
- **Production Setup**: Serves static files from built client
- **Environment Variables**: OpenAI API key and database URL configuration
- **Database Migrations**: Drizzle Kit for schema management

### Development vs Production
- Development uses Vite dev server with hot reloading
- Production serves pre-built static files
- Replit-specific development tools and banners in dev mode

The architecture supports easy scaling and feature additions while maintaining clean separation of concerns between the AI service layer, API routes, and React frontend.