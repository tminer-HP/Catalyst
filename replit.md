# Diverge Connect: Innovation Discovery Engine

## Overview

Diverge Connect is a construction technology discovery platform that serves as a comprehensive directory and search engine for AEC (Architecture, Engineering, Construction) innovation solutions. The platform enables users to discover, compare, and connect with construction technology providers across multiple categories including robotics, AI, safety, sustainability, and productivity tools.

The application provides multiple discovery pathways: browsing by vertical markets (datacenters, hospitals, airports), exploring specific projects, searching by innovation categories, and AI-powered natural language search. It's designed as a sophisticated B2B SaaS platform with enterprise aesthetics inspired by ProductHunt, Linear, and Clutch.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management
- Tailwind CSS for utility-first styling
- shadcn/ui component library built on Radix UI primitives

**Design System:**
- Custom theme system using CSS variables for light/dark mode support
- Typography hierarchy using Inter (UI/body) and Space Grotesk (display) fonts from Google Fonts
- Standardized spacing primitives (2, 4, 6, 8, 12, 16 units)
- Consistent border radius values (sm: 3px, md: 6px, lg: 9px)
- Elevation system for hover/active states using CSS custom properties

**Component Architecture:**
- Reusable UI components following atomic design patterns
- Page-level components for major views:
  - `Landing.tsx` - Multi-path discovery entry point with 4 navigation cards
  - `VerticalMarket.tsx` - Industry vertical browsing and drill-down
  - `ProjectExplorer.tsx` - Project search and solution mapping
  - `InnovationExplorer.tsx` - Category-based solution discovery
  - `AIExplorer.tsx` - Natural language search interface
  - `Dashboard.tsx` - Legacy dashboard with sidebar filters (still accessible)
  - `SolutionDetail.tsx` - Individual solution detail pages
- Shared components for common patterns (NavHeader, SolutionCard, FilterSidebar)
- Example components demonstrating usage patterns

**State Management:**
- Local component state for UI interactions (filters, search, selections)
- URL-based state for shareable views (search queries, selected items)
- Query client configuration with disabled refetching for stable data

### Backend Architecture

**Server Framework:**
- Express.js for HTTP server and routing
- TypeScript for type safety across the stack
- Module-based architecture separating routes, storage, and server setup

**Development Setup:**
- Vite middleware integration for HMR (Hot Module Replacement)
- Custom error overlay for development
- Replit-specific plugins for development tooling

**Storage Interface:**
- Abstract IStorage interface defining CRUD operations
- In-memory storage implementation (MemStorage) for current development
- Designed for easy migration to database-backed storage

**API Design:**
- RESTful API structure with /api prefix
- JSON request/response handling
- Request logging with duration tracking
- Response capture for debugging

### Data Model

**Core Entities:**

1. **Solutions** - Construction technology products/services
   - Identification: id, name, tagline, description
   - Media: logo
   - Classification: categories, verticals, regions
   - Company info: location, founded, teamSize, website
   - Details: features, useCases
   - Relations: relatedIds

2. **Projects** - Construction projects using solutions
   - Identification: id, name, code
   - Classification: vertical, location
   - Metrics: value, status
   - Relations: solutionIds
   - Description: project details

3. **Users** - Platform users (authentication ready)
   - Credentials: id, username, password
   - Designed for future auth implementation

**Data Organization:**
- Mock data stored in shared/mockData.ts for development
- Type definitions in shared/solutions.ts and shared/schema.ts
- Drizzle ORM schemas prepared for PostgreSQL migration

### Search and Discovery

**AI-Powered Search:**
- Natural language query processing
- Keyword mapping for intelligent matching
- Multi-factor scoring system considering:
  - Direct name matches (highest priority)
  - Category relevance
  - Vertical market alignment
  - Use case matching
  - Feature descriptions

**Filter System:**
- Multi-dimensional filtering:
  - Categories (Robotics, Safety, AI, etc.)
  - Regions (North America, Europe, Asia Pacific, etc.)
  - Verticals (Commercial, Datacenter, Hospital, etc.)
- Combined filter logic with AI search integration
- Real-time filter updates with URL state preservation

**Discovery Pathways:**

The application features a multi-path navigation landing page with 4 distinct discovery methods:

1. **Vertical Market** (`/vertical-market`) - Browse by industry verticals
   - Select from verticals: Datacenter, Hospital, Airport, Commercial, Industrial
   - Drill down to see active projects and available solutions for each vertical
   - View project metadata and which solutions are deployed on each project

2. **Project Explorer** (`/project-explorer`) - Browse by active construction projects
   - Search projects by name, code, or vertical
   - View project details including location, value, status, and vertical
   - See all solutions currently being used on each project
   - 6 mock projects across different verticals

3. **Innovation Explorer** (`/innovation-explorer`) - Browse by technology categories
   - Browse by categories: Robotics, Safety, AI, Layout, Estimating, Productivity, Scheduling
   - Filter solutions by innovation category
   - View solutions with category tags and vertical applicability

4. **AI Explorer** (`/ai-explore`) - Natural language search interface
   - Enter queries in plain language (e.g., "layout robotics for hospitals")
   - AI-powered relevance scoring based on keywords, categories, and verticals
   - Query parameters preserved in URL for shareability
   - Suggestion prompts to guide user queries

## External Dependencies

### UI Component Library
- **Radix UI** - Comprehensive set of unstyled, accessible UI primitives including:
  - Dialog, Dropdown, Popover for overlays
  - Accordion, Tabs, Collapsible for content organization
  - Select, Checkbox, Radio for form inputs
  - Toast, Alert Dialog for notifications
  - Navigation Menu, Context Menu for navigation

### Styling and Design
- **Tailwind CSS** - Utility-first CSS framework
- **class-variance-authority** - Component variant management
- **clsx & tailwind-merge** - Conditional class name utilities
- **Google Fonts** - Inter and Space Grotesk font families

### Data Management
- **Drizzle ORM** - TypeScript ORM for database operations
- **Drizzle Zod** - Schema validation integration
- **@neondatabase/serverless** - Serverless PostgreSQL driver
- **connect-pg-simple** - PostgreSQL session store (prepared for auth)

### Development Tools
- **Vite** - Build tool and dev server
- **esbuild** - JavaScript bundler for production builds
- **tsx** - TypeScript execution for development
- **@replit/vite-plugin-*** - Replit-specific development enhancements

### Utilities
- **date-fns** - Date manipulation library
- **nanoid** - Unique ID generation
- **embla-carousel-react** - Carousel component
- **react-hook-form** - Form state management
- **@hookform/resolvers** - Form validation resolvers
- **zod** - Schema validation

### Future Integration Points
- PostgreSQL database (Drizzle configured, pending provisioning)
- Authentication system (user schema and session store ready)
- External construction tech APIs for real-time data
- Payment processing for premium features