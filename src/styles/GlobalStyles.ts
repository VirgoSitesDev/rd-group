import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  *, 
  *::before, 
  *::after {
    font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.default};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
    width: 100%;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    line-height: 1.2;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize.xxl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }

  h4 {
    font-size: ${({ theme }) => theme.typography.fontSize.md};
  }

  h5 {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }

  h6 {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  a {
    color: white;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: white;
      text-decoration: underline;
    }
  }

  button {
    font-family: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Scrollbar customization */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.paper};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.text.primary};
  }

  /* Focus styles */
  *:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.main};
    outline-offset: 2px;
  }

  /* Selection styles */
  ::selection {
    background-color: ${({ theme }) => theme.colors.primary.main};
    color: white;
  }

  /* Loading animation keyframes */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideInUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideInDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* Mobile Font Size Adjustments */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    body {
      font-size: 1rem !important; /* 16px base */
    }

    h1 {
      font-size: 1.75rem !important; /* 28px */
    }

    h2 {
      font-size: 1.5rem !important; /* 24px */
    }

    h3 {
      font-size: 1.25rem !important; /* 20px */
    }

    h4 {
      font-size: 1.125rem !important; /* 18px */
    }

    h5 {
      font-size: 1rem !important; /* 16px */
    }

    h6 {
      font-size: 0.875rem !important; /* 14px */
    }

    p {
      font-size: 1rem !important; /* 16px */
    }

    /* Override ALL elements with maximum specificity */
    * {
      font-size: 1rem !important; /* 16px default for all */
    }

    /* Then allow specific elements to have their sizes */
    h1 { font-size: 1.75rem !important; }
    h2 { font-size: 1.5rem !important; }
    h3 { font-size: 1.25rem !important; }
    h4 { font-size: 1.125rem !important; }
    h5 { font-size: 1rem !important; }
    h6 { font-size: 0.875rem !important; }

    /* Override styled-components with attribute selector */
    [class*="sc-"] {
      font-size: 1rem !important;
    }

    /* Force all divs, spans, and paragraphs */
    div, span, p, li, td, th, label {
      font-size: 1rem !important;
    }

    /* Buttons and form elements */
    button, input, select, textarea {
      font-size: 1rem !important;
    }

    /* Links */
    a {
      font-size: 1rem !important;
    }

    /* Small text exceptions */
    small, .small-text {
      font-size: 0.875rem !important;
    }

    /* Target styled components by common patterns */
    [class*="Text"], 
    [class*="text"],
    [class*="Description"],
    [class*="description"], {
      font-size: 1rem !important;
    }

    /* Target styled components by common patterns */
    [class*="Title"],
    [class*="title"] {
      font-size: 1rem !important;
      letter-spacing: 1px;
    }
  }

  /* Utility classes */
  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  .slide-in-up {
    animation: slideInUp 0.3s ease-in-out;
  }

  .slide-in-down {
    animation: slideInDown 0.3s ease-in-out;
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;