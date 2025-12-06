# Planning Guide

An interactive educational web app that serves as both a comprehensive cheat sheet for statistical hypothesis testing and a hands-on T-test visualization tool, designed to help students understand and apply hypothesis testing concepts through interactive exploration.

**Experience Qualities**:
1. **Educational** - Clear, structured presentation of complex statistical concepts with visual aids that make abstract ideas concrete and memorable
2. **Interactive** - Hands-on T-test calculator with real-time visualizations that respond to user inputs, encouraging experimentation and discovery
3. **Professional** - Clean, organized layout with academic credibility that students can reference for assignments and exams

**Complexity Level**: Light Application (multiple features with basic state)
- The app combines static reference content (cheat sheet) with interactive tools (T-test calculator), managing state for user inputs and dynamically generating visualizations

## Essential Features

**Statistical Concepts Cheat Sheet**
- Functionality: Displays organized sections covering all syllabus topics (Type I/II errors, one/two-sided tests, single/two sample tests, goodness of fit)
- Purpose: Provides quick reference material students can use during assignments and exam preparation
- Trigger: Available on initial load in dedicated section/tab
- Progression: User opens app → views organized topic cards → clicks to expand details → reads definitions and formulas → references during work
- Success criteria: All syllabus topics covered with clear definitions, formulas, and examples

**Interactive T-Test Calculator**
- Functionality: Allows users to input either raw sample data OR summary statistics (mean, SD, n), calculates t-statistic, p-value, and displays distribution visualization
- Purpose: Transforms abstract statistical concepts into tangible, visual understanding through experimentation; supports both raw data analysis and textbook problem solving
- Trigger: User enters sample data/statistics or selects test type
- Progression: User selects test type (one-sample/two-sample/paired) → chooses input mode (raw data or summary stats) → enters values → sets significance level → views calculated t-statistic → sees visual distribution with critical regions → interprets results
- Success criteria: Accurate calculations for both input modes, real-time updates, clear distribution visualization showing test statistic and critical values

**Distribution Visualization**
- Functionality: Renders t-distribution curve with shaded critical regions, test statistic marker, and p-value representation
- Purpose: Helps students visualize where their test statistic falls relative to critical values and understand rejection regions
- Trigger: Updates automatically when user changes inputs or test parameters
- Progression: Data entered → distribution renders → critical regions shade (one/two-tailed) → test statistic plots on curve → p-value highlights → decision displays
- Success criteria: Clear, accurate visualization that updates smoothly and helps users understand test outcomes

**Hypothesis Decision Helper**
- Functionality: Shows step-by-step decision logic: null/alternative hypotheses, test statistic, p-value comparison, and conclusion
- Purpose: Guides students through proper hypothesis testing procedure and conclusion writing
- Trigger: Automatically updates as user inputs data
- Progression: Test configured → hypotheses display → calculation shows → comparison to alpha → decision stated → interpretation provided
- Success criteria: Clear, educational presentation of the decision-making process with proper statistical language

## Edge Case Handling

- **Empty/Invalid Data**: Display helpful validation messages guiding users to correct input formats (both for raw data and summary statistics)
- **Insufficient Sample Size**: Warn when sample size is too small for reliable results (n < 2)
- **Invalid Summary Stats**: Validate that standard deviation is positive and sample size is a positive integer
- **Division by Zero**: Handle cases with zero variance by displaying appropriate error message
- **Extreme Values**: Gracefully handle very large or small numbers without breaking calculations
- **Missing Inputs**: Disable calculation until all required fields are completed

## Design Direction

The design should evoke academic professionalism combined with modern digital learning - think of a digital textbook that came alive. It should feel authoritative yet approachable, using color strategically to distinguish different concept types and highlight important information without overwhelming.

## Color Selection

A sophisticated academic palette with strategic accent colors for visual hierarchy and concept differentiation.

- **Primary Color**: Deep academic blue (oklch(0.45 0.15 250)) - conveys trust, intelligence, and statistical rigor
- **Secondary Colors**: Slate gray (oklch(0.55 0.01 250)) for supporting text and subtle elements; soft cream (oklch(0.97 0.01 85)) for card backgrounds providing visual separation
- **Accent Color**: Vibrant coral (oklch(0.68 0.19 25)) - draws attention to critical regions, rejection zones, and important decisions
- **Foreground/Background Pairings**:
  - Primary Blue (oklch(0.45 0.15 250)): White text (oklch(1 0 0)) - Ratio 7.8:1 ✓
  - Background (oklch(0.98 0.005 250)): Dark text (oklch(0.25 0.01 250)) - Ratio 12.1:1 ✓
  - Accent Coral (oklch(0.68 0.19 25)): White text (oklch(1 0 0)) - Ratio 5.2:1 ✓
  - Muted Slate (oklch(0.85 0.01 250)): Dark text (oklch(0.3 0.01 250)) - Ratio 8.4:1 ✓

## Font Selection

Typography should convey academic precision while maintaining readability for complex mathematical content and formulas.

- **Primary Font**: IBM Plex Sans - modern, technical, and highly readable for both body text and mathematical notation
- **Code/Formula Font**: JetBrains Mono - for displaying formulas, statistical notation, and numerical values

- **Typographic Hierarchy**:
  - H1 (Main Title): IBM Plex Sans Bold/36px/tight letter spacing/-0.02em
  - H2 (Section Headers): IBM Plex Sans SemiBold/24px/normal letter spacing
  - H3 (Topic Headers): IBM Plex Sans Medium/18px/normal letter spacing
  - Body Text: IBM Plex Sans Regular/16px/line-height 1.6
  - Formulas/Stats: JetBrains Mono Medium/14px/line-height 1.5
  - Labels: IBM Plex Sans Medium/14px/uppercase letter-spacing 0.05em

## Animations

Animations should reinforce the educational experience - revealing information progressively and drawing attention to cause-and-effect relationships in statistical calculations.

- **Subtle Functionality**: Smooth transitions when switching between test types (200ms), gentle fade-ins for calculation results, accordion-style expansions for cheat sheet sections
- **Moments of Delight**: Distribution curve animates in with smooth path drawing, test statistic marker drops onto the curve with a subtle bounce, critical regions fade in with color highlighting

## Component Selection

- **Components**:
  - **Tabs** (shadcn): Switch between "Cheat Sheet" and "T-Test Calculator" views
  - **Accordion** (shadcn): Expandable sections for different hypothesis testing topics in cheat sheet
  - **Card** (shadcn): Container for each statistical concept, calculator sections, and results
  - **Input** (shadcn): For entering sample data, significance levels, and test parameters
  - **Select** (shadcn): Dropdown for choosing test type (one-sample, two-sample, paired)
  - **Button** (shadcn): Primary actions like "Calculate" and "Clear", styled with primary color
  - **Badge** (shadcn): Tag important concepts like "Type I Error", "Two-tailed", etc.
  - **Separator** (shadcn): Visual division between cheat sheet sections
  - **Label** (shadcn): Form field labels for calculator inputs

- **Customizations**:
  - **SVG Distribution Visualization**: Custom D3-based component for rendering t-distribution curves with dynamic shading
  - **Formula Display Component**: Custom component for rendering mathematical notation with proper styling
  - **Result Panel**: Custom component showing hypothesis test decision with color-coded outcome

- **States**:
  - Inputs: Clear focus states with primary blue ring, error states with red border for validation
  - Buttons: Hover brightens by 10%, active state scales down slightly (0.98), disabled state at 50% opacity
  - Cards: Subtle shadow on hover (shadow-md to shadow-lg transition)
  - Accordion: Smooth height animation with chevron rotation

- **Icon Selection**:
  - ChartBar (Phosphor): Represents statistical analysis and calculator tab
  - BookOpen (Phosphor): Cheat sheet reference section
  - Calculator (Phosphor): T-test calculator operations
  - Question (Phosphor): Help tooltips for complex concepts
  - CheckCircle/XCircle (Phosphor): Hypothesis test decisions (accept/reject)
  - CaretDown (Phosphor): Accordion expansion indicators

- **Spacing**:
  - Page margins: px-6 md:px-12 for breathing room
  - Card padding: p-6 for comfortable content spacing
  - Section gaps: gap-8 for major sections, gap-4 for related elements
  - Input groups: gap-3 for form field spacing
  - Grid layouts: gap-6 for card grids

- **Mobile**:
  - Tabs convert to full-width buttons with icons
  - Two-column cheat sheet grid collapses to single column
  - Calculator inputs stack vertically with full width
  - Distribution visualization scales responsively, may show simplified version on very small screens
  - Font sizes scale down slightly (H1: 28px, Body: 15px)
  - Padding reduces to p-4 on cards for more screen real estate
