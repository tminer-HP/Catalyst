# Diverge Connect: Innovation Discovery Engine - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from modern discovery and directory platforms like ProductHunt, Linear, and Clutch, combined with enterprise B2B SaaS aesthetics. The design emphasizes credibility, innovation, and easy navigation while maintaining a professional AEC industry tone.

**Core Principle**: Create a sophisticated, trustworthy platform that showcases cutting-edge construction technology through clean visual hierarchy and intuitive discovery patterns.

---

## Typography System

**Font Stack**: 
- Primary: Inter (Google Fonts) - for UI elements, body text, and descriptions
- Display: Space Grotesk (Google Fonts) - for headlines and section titles

**Hierarchy**:
- Hero Headline: text-5xl md:text-6xl lg:text-7xl, font-bold, leading-tight
- Section Titles: text-3xl md:text-4xl, font-bold, tracking-tight
- Card Titles: text-xl md:text-2xl, font-semibold
- Body Text: text-base md:text-lg, font-normal, leading-relaxed
- Captions/Labels: text-sm, font-medium, uppercase tracking-wide
- Filter/Tag Text: text-sm, font-medium

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, and 16 for consistent rhythm
- Component padding: p-4, p-6, p-8
- Section spacing: py-12, py-16, py-20
- Element gaps: gap-4, gap-6, gap-8
- Margins: m-2, m-4, m-8

**Container Strategy**:
- Full-width sections with inner max-w-7xl mx-auto px-6 lg:px-8
- Dashboard content grid: max-w-7xl
- Detail pages: max-w-4xl for content focus

**Grid Systems**:
- Solution cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Related technologies: grid-cols-2 md:grid-cols-4 gap-4
- Filter chips: flex flex-wrap gap-2

---

## Landing Page Structure

**Hero Section** (60-70vh):
- Full-width hero with gradient overlay treatment
- Centered content layout with max-w-4xl
- Headline + tagline + dual CTA buttons (blurred background for buttons)
- Trust indicator bar below hero (e.g., "500+ Solutions Indexed | 50+ Countries | Trusted by Industry Leaders")

**Featured Solutions Section**:
- Grid of 6-8 highlighted solution cards
- Each card: company logo (h-12), name, one-line description, category tags
- Hover state: subtle lift (transform translate-y-[-4px])

**How It Works Section**:
- Three-column layout (Search → Compare → Connect)
- Icon + title + description for each step
- Centered layout with max-w-5xl

**Categories Overview**:
- Horizontal scrolling or grid of category cards
- Each category: icon, name, solution count
- Visual distinction using iconography from Heroicons

**CTA Section**:
- Centered layout with compelling copy
- Primary action button + secondary text link
- Background treatment (subtle pattern or gradient)

---

## Dashboard View

**Header**:
- Sticky navigation with logo, search bar (w-full max-w-2xl), and account menu
- Height: h-16 md:h-20
- Search bar: rounded-full with icon, placeholder "Search innovations..."

**Filter Sidebar** (desktop) / Top Bar (mobile):
- Fixed left sidebar (w-64) on desktop, collapsible on mobile
- Category chips with count badges
- Additional filters: Location, Maturity Stage, Use Case
- Clear all filters option

**Main Content Area**:
- Breadcrumb navigation (text-sm)
- Results count and sorting dropdown (right-aligned)
- Solution cards grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6)
- Pagination or infinite scroll indicator

**Solution Card Design**:
- Aspect ratio: aspect-[4/3] or fixed h-72
- Card structure:
  - Company logo (top, h-16)
  - Company name (text-xl font-semibold)
  - One-sentence description (text-sm line-clamp-2)
  - Category tags (bottom, flex gap-2)
  - Subtle border with hover shadow effect

---

## Detail Page Structure

**Header Section**:
- Return to dashboard link (top-left)
- Company logo (large, h-24 md:h-32)
- Company name (text-4xl font-bold)
- Category tags and location badge

**Main Content** (two-column on desktop):
- Left Column (2/3 width):
  - Company description (max-w-prose)
  - Key features list with checkmark icons
  - Use cases section
- Right Column (1/3 width):
  - Contact/Connect CTA card (sticky)
  - Quick stats (Founded, HQ, Team Size)
  - Website link

**Related Technologies Section**:
- Horizontal scrolling or grid layout
- Smaller card format showing logo + name
- "View All" link if more than displayed

**Visual Separator**: Use subtle divider lines (border-t) between major sections

---

## Component Library

**Navigation Bar**:
- Horizontal flex layout with space-between
- Logo (h-8 md:h-10), nav links (hidden md:flex gap-8), CTA button

**Search Bar**:
- Input with rounded-full, pl-12 (for icon), h-12
- Magnifying glass icon (Heroicons) positioned absolute left-4

**Category Filter Chips**:
- Inline-flex items-center gap-2, rounded-full, px-4 py-2
- Active state: distinct styling (not color-based)
- Includes count badge (text-xs, rounded-full px-2)

**Solution Cards**:
- Rounded-xl with subtle border
- Padding: p-6
- Flex flex-col layout with space-between
- Logo container: flex items-center justify-center h-16

**CTA Buttons**:
- Primary: rounded-full px-8 py-3 text-base font-semibold
- Secondary: rounded-full px-8 py-3 border-2 font-semibold
- Buttons on images: backdrop-blur-md bg-white/10 border border-white/20

**Tag/Badge Components**:
- Rounded-full px-3 py-1 text-xs font-medium
- Subtle background treatment (not color-specific)

**Info Cards** (stats, features):
- Rounded-lg p-6
- Icon (h-10 w-10), title (text-lg font-semibold), description

---

## Images

**Hero Image**: Full-width background image showing modern construction site with technology integration (drones, robots, workers with tablets). Overlay with gradient for text readability. Height: 60-70vh.

**Solution Logos**: Use actual company logos or placeholder logo boxes (aspect-square, max-h-16). Ensure proper padding and centered alignment.

**Category Icons**: Use Heroicons library - wrench-screwdriver (Robotics), shield-check (Safety), cpu-chip (AI), leaf (Sustainability), chart-bar (Productivity).

**Decorative Elements**: Abstract geometric patterns or grid overlays for section backgrounds (subtle, low opacity).

---

## Animations & Interactions

**Minimal Animation Strategy**:
- Card hover: subtle shadow increase + transform translate-y-[-4px], transition-all duration-200
- Button hover: scale-[1.02], transition-transform duration-150
- Page transitions: None - instant navigation for prototype clarity
- Search/filter interactions: Instant feedback (no loading states needed for prototype)

**No scroll animations or complex transitions** - focus on instant, responsive feel.

---

## Accessibility & Polish

- Maintain touch target sizes: min-h-[44px] for all interactive elements
- Clear focus states for keyboard navigation (outline with appropriate offset)
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text placeholders for all images
- ARIA labels for icon-only buttons
- Consistent interactive element styling across all pages

---

This design creates a professional, modern discovery platform that positions Diverge Connect as a credible industry resource while maintaining clarity and ease of navigation for the prototype demonstration.