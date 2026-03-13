// ============================================================
// PICKY EATERS — Design Tokens
// tokens.js — Single source of truth for all design decisions
// Import this file anywhere in the project for consistent styling
// ============================================================

export const tokens = {

  // ─────────────────────────────────────────────
  // COLORS
  // ─────────────────────────────────────────────
  colors: {

    // Backgrounds
    bg: {
      main:       '#FAF9F6',   // App main background
      white:      '#FFFFFF',   // Cards, modals, sheets
      contrast:   '#ECEAE4',   // Input fields, dividers, skeleton loaders
    },

    // Accent / Brand
    accent: {
      orange:     '#FE8F20',   // Primary — titles, main CTA buttons
      yellow:     '#FFD400',   // Highlights, gamification badges
      yellowAlt:  '#FFBB00',   // Secondary highlights, hover states
      green:      '#0D735A',   // Success, "love" indicator, positive states
      lime:       '#CCDD20',   // Tags, streak indicators, energetic accents
    },

    // Text
    text: {
      dark:       '#1A1A1A',   // Card titles, H4, high-emphasis text
      body:       '#636363',   // Body copy, UI text
      muted:      '#9B9B9B',   // Captions, metadata, placeholders
      inverse:    '#FFFFFF',   // Text on dark/colored backgrounds
    },

    // Semantic States
    state: {
      love:       '#0D735A',   // ✅ Love / strongly like
      like:       '#CCDD20',   // 👍 Like
      neutral:    '#ECEAE4',   // 😐 Neutral / indifferent
      dislike:    '#FFBB00',   // 👎 Dislike
      hate:       '#FE8F20',   // ❌ Hate
      allergy:    '#D93025',   // ⚠️ Allergy — red for safety/urgency
    },

    // Compatibility Traffic Light (AI group feature)
    compatibility: {
      good:       '#0D735A',   // 🟢 All good
      warning:    '#FFBB00',   // 🟡 Minor conflict
      bad:        '#D93025',   // 🔴 Problem
    },

    // UI Utility
    border:       '#ECEAE4',
    shadow:       'rgba(0, 0, 0, 0.08)',
    overlay:      'rgba(0, 0, 0, 0.40)',
    transparent:  'transparent',
  },

  // ─────────────────────────────────────────────
  // TYPOGRAPHY
  // ─────────────────────────────────────────────
  typography: {

    // Font Families
    fonts: {
      display: "'EB Garamond', Georgia, serif",        // Titles, hero text
      ui:      "'Work Sans', system-ui, sans-serif",   // Buttons, labels, section headers
      body:    "'Open Sans', system-ui, sans-serif",   // Body text, descriptions
    },

    // Font Sizes (px — mobile-first)
    sizes: {
      h1:      '36px',
      h2:      '32px',
      h3:      '20px',
      h4:      '17px',
      bodyL:   '16px',
      bodyM:   '14px',
      bodyS:   '12px',
      label:   '11px',
      button:  '15px',
      caption: '11px',
    },

    // Font Weights
    weights: {
      light:      300,
      regular:    400,
      medium:     500,
      semibold:   600,
      bold:       700,
      extrabold:  800,
    },

    // Line Heights
    lineHeights: {
      tight:    1.2,   // H1, H2 display text
      snug:     1.35,  // H3, H4
      normal:   1.5,   // Body text
      relaxed:  1.65,  // Long-form descriptions
    },

    // Letter Spacing
    letterSpacing: {
      tight:  '-0.02em',  // Large display titles
      normal: '0em',
      wide:   '0.05em',   // Labels, tags (uppercase)
      wider:  '0.08em',   // Badges
    },

    // ── Pre-built text styles ──────────────────
    styles: {
      h1: {
        fontFamily:    "'EB Garamond', Georgia, serif",
        fontSize:      '36px',
        fontWeight:    800,
        lineHeight:    1.2,
        letterSpacing: '-0.02em',
        color:         '#FE8F20',
      },
      h2: {
        fontFamily:    "'EB Garamond', Georgia, serif",
        fontSize:      '32px',
        fontWeight:    700,
        lineHeight:    1.2,
        letterSpacing: '-0.01em',
        color:         '#FE8F20',
      },
      h3: {
        fontFamily:    "'Work Sans', system-ui, sans-serif",
        fontSize:      '20px',
        fontWeight:    700,
        lineHeight:    1.35,
        letterSpacing: '0em',
        color:         '#FE8F20',
      },
      h4: {
        fontFamily:    "'Work Sans', system-ui, sans-serif",
        fontSize:      '17px',
        fontWeight:    600,
        lineHeight:    1.35,
        letterSpacing: '0em',
        color:         '#1A1A1A',
      },
      bodyL: {
        fontFamily:    "'Open Sans', system-ui, sans-serif",
        fontSize:      '16px',
        fontWeight:    400,
        lineHeight:    1.5,
        color:         '#636363',
      },
      bodyM: {
        fontFamily:    "'Open Sans', system-ui, sans-serif",
        fontSize:      '14px',
        fontWeight:    400,
        lineHeight:    1.5,
        color:         '#636363',
      },
      bodyS: {
        fontFamily:    "'Open Sans', system-ui, sans-serif",
        fontSize:      '12px',
        fontWeight:    300,
        lineHeight:    1.5,
        color:         '#636363',
      },
      label: {
        fontFamily:    "'Work Sans', system-ui, sans-serif",
        fontSize:      '11px',
        fontWeight:    600,
        lineHeight:    1.2,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color:         '#636363',
      },
      button: {
        fontFamily:    "'Work Sans', system-ui, sans-serif",
        fontSize:      '15px',
        fontWeight:    700,
        lineHeight:    1.2,
        letterSpacing: '0.01em',
        color:         '#FFFFFF',
      },
      caption: {
        fontFamily:    "'Open Sans', system-ui, sans-serif",
        fontSize:      '11px',
        fontWeight:    400,
        fontStyle:     'italic',
        lineHeight:    1.5,
        color:         '#9B9B9B',
      },
    },
  },

  // ─────────────────────────────────────────────
  // SPACING
  // ─────────────────────────────────────────────
  spacing: {
    '0':    '0px',
    '1':    '4px',
    '2':    '8px',
    '3':    '12px',
    '4':    '16px',
    '5':    '20px',
    '6':    '24px',
    '8':    '32px',
    '10':   '40px',
    '12':   '48px',
    '16':   '64px',
    '20':   '80px',
    // Semantic aliases
    xs:     '4px',
    sm:     '8px',
    md:     '16px',
    lg:     '24px',
    xl:     '32px',
    xxl:    '48px',
    // Layout
    pagePadding:    '20px',   // Horizontal screen padding
    sectionGap:     '32px',   // Between major sections
    cardPadding:    '16px',   // Inside cards
    cardGap:        '12px',   // Between cards in a list
    navHeight:      '60px',   // Bottom navigation bar
    headerHeight:   '56px',   // Top header bar
  },

  // ─────────────────────────────────────────────
  // BORDER RADIUS
  // ─────────────────────────────────────────────
  radius: {
    none:   '0px',
    xs:     '4px',
    sm:     '8px',
    md:     '12px',
    lg:     '16px',
    xl:     '24px',
    xxl:    '32px',
    full:   '9999px',   // Pills, avatars, badges
    card:   '16px',     // Standard card radius
    button: '12px',     // Standard button radius
    input:  '10px',     // Input fields
    avatar: '9999px',   // Circular avatars
    tag:    '9999px',   // Food tags, badges
  },

  // ─────────────────────────────────────────────
  // SHADOWS
  // ─────────────────────────────────────────────
  shadows: {
    none:   'none',
    xs:     '0 1px 2px rgba(0,0,0,0.06)',
    sm:     '0 2px 8px rgba(0,0,0,0.08)',
    md:     '0 4px 16px rgba(0,0,0,0.10)',
    lg:     '0 8px 32px rgba(0,0,0,0.12)',
    card:   '0 2px 12px rgba(0,0,0,0.08)',
    modal:  '0 16px 64px rgba(0,0,0,0.16)',
    button: '0 4px 12px rgba(254,143,32,0.30)',   // Orange glow for primary CTA
  },

  // ─────────────────────────────────────────────
  // TRANSITIONS
  // ─────────────────────────────────────────────
  transitions: {
    fast:    '150ms ease',
    normal:  '250ms ease',
    slow:    '400ms ease',
    spring:  '300ms cubic-bezier(0.34, 1.56, 0.64, 1)',  // Bouncy for gamification
  },

  // ─────────────────────────────────────────────
  // Z-INDEX
  // ─────────────────────────────────────────────
  zIndex: {
    base:     0,
    raised:   10,
    dropdown: 100,
    sticky:   200,
    overlay:  300,
    modal:    400,
    toast:    500,
    tooltip:  600,
  },

  // ─────────────────────────────────────────────
  // BREAKPOINTS (for web — mobile-first)
  // ─────────────────────────────────────────────
  breakpoints: {
    sm:  '480px',   // Large phones
    md:  '768px',   // Tablets
    lg:  '1024px',  // Desktop
    xl:  '1280px',  // Wide desktop
  },

  // ─────────────────────────────────────────────
  // ICONS
  // ─────────────────────────────────────────────
  icons: {
    library: 'phosphor-react',       // UI icons
    emoji:   'noto-emoji (Google)',  // Food items
    sizes: {
      xs:  16,
      sm:  20,
      md:  24,
      lg:  32,
      xl:  40,
    },
  },

  // ─────────────────────────────────────────────
  // FOOD PREFERENCE RATINGS
  // Color + emoji mapping for food preference states
  // ─────────────────────────────────────────────
  preferences: {
    love:    { label: 'Love',    emoji: '❤️',  color: '#0D735A', bg: '#E8F5F1' },
    like:    { label: 'Like',    emoji: '👍',  color: '#CCDD20', bg: '#F7FAE8' },
    neutral: { label: 'Neutral', emoji: '😐',  color: '#9B9B9B', bg: '#ECEAE4' },
    dislike: { label: 'Dislike', emoji: '👎',  color: '#FFBB00', bg: '#FFF8E1' },
    hate:    { label: 'Hate',    emoji: '❌',  color: '#FE8F20', bg: '#FEF3E8' },
    allergy: { label: 'Allergy', emoji: '⚠️',  color: '#D93025', bg: '#FDECEA' },
  },

};

export default tokens;
