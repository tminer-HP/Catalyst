# Catalyst: Innovation Discovery Engine

## Overview

Catalyst is a B2B SaaS platform designed as a comprehensive directory and search engine for AEC (Architecture, Engineering, Construction) innovation solutions. It enables users to discover, compare, and connect with construction technology providers across various categories like robotics, AI, safety, sustainability, and productivity tools. The platform offers multiple discovery pathways, including browsing by vertical markets, exploring projects, searching by innovation categories, and AI-powered natural language search. Its aesthetic is inspired by leading enterprise platforms.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:** React 18 (TypeScript), Vite, Wouter (routing), TanStack Query (server state), Tailwind CSS, shadcn/ui (component library).

**Design System:** Custom theme with light/dark mode, Inter and Space Grotesk fonts, standardized spacing, border radii, and an elevation system.

**Component Architecture:** Reusable UI components (atomic design), page-level components for major views (Landing, VerticalMarket, ProjectExplorer, InnovationExplorer, AIExplorer, Dashboard, SolutionDetail), and shared components (NavHeader, SolutionCard, FilterSidebar).

**State Management:** Local component state, React Context for global selections (`SelectedSolutionsProvider`), localStorage for persistence (selections, search history), and URL-based state for shareable views.

### Backend Architecture

**Server Framework:** Express.js with TypeScript for HTTP server and routing.

**Storage Interface:** Abstract `IStorage` interface with an in-memory implementation (`MemStorage`) for development, designed for future database migration.

**API Design:** RESTful API (`/api` prefix) with JSON handling, request logging, and response capture.

### Data Model

**Core Entities:**
- **Solutions:** Construction technology products/services with extensive details including identification, media (images, videos, case studies), classification, company info, contact, metrics (cost, rating, projects used), and features.
- **Projects:** Construction projects utilizing solutions, including identification, classification, metrics, and solution relationships.
- **Users:** Designed for future authentication, including credentials.

**Data Organization:** Mock data in `shared/mockData.ts`, type definitions in `shared/solutions.ts` and `shared/schema.ts`, with Drizzle ORM schemas prepared for PostgreSQL.

### Search and Discovery

**AI-Powered Search:** Natural language query processing with multi-factor scoring based on name matches, category, vertical, use case, and feature relevance.

**Filter System:** Multi-dimensional filtering by categories, regions, and verticals, with combined logic and real-time URL state preservation.

**Discovery Pathways:**
1.  **Vertical Market (`/vertical-market`):** Browse by industry verticals (Datacenter, Hospital, Airport, Commercial, Industrial) to find projects and solutions.
2.  **Project Explorer (`/project-explorer`):** Search projects by name, code, or vertical to view details and associated solutions.
3.  **Innovation Explorer (`/innovation-explorer`):** Browse solutions by technology categories (Robotics, Safety, AI, etc.).
4.  **AI Explorer (`/ai-explore`):** Natural language search interface for intelligent solution discovery.

**Unified Solutions Page:** All discovery paths lead to a unified `/solutions` page featuring CSI division-based grouping, collapsible sections, selection checkboxes, a real-time filter sidebar, and AI search integration.

**Checkout Page (`/checkout`):** Manages selected solutions, displaying them by CSI division with contact information, action buttons (Share, Print, Export to CSV), and robust persistence via LocalStorage and URL parameters.

## External Dependencies

### UI Component Library
- **Radix UI:** Unstyled, accessible UI primitives (Dialog, Dropdown, Accordion, Checkbox, etc.).

### Styling and Design
- **Tailwind CSS:** Utility-first CSS framework.
- **class-variance-authority, clsx, tailwind-merge:** Utilities for conditional styling.
- **Google Fonts:** Inter and Space Grotesk.

### Data Management
- **Drizzle ORM:** TypeScript ORM.
- **Drizzle Zod:** Schema validation.
- **@neondatabase/serverless:** Serverless PostgreSQL driver.
- **connect-pg-simple:** PostgreSQL session store.

### Development Tools
- **Vite:** Build tool and dev server.
- **esbuild:** JavaScript bundler.
- **tsx:** TypeScript execution.
- **@replit/vite-plugin-***: Replit-specific enhancements.

### Utilities
- **date-fns:** Date manipulation.
- **nanoid:** Unique ID generation.
- **embla-carousel-react:** Carousel component.
- **react-hook-form:** Form state management.
- **@hookform/resolvers, zod:** Form validation.

### Future Integration Points
- PostgreSQL database.
- Authentication system.
- External construction tech APIs.
- Payment processing.