# QuickSpin Design System

## Color Palette

### Primary - Dark Purple
The primary color is dark purple `#2E0249`, representing sophistication, innovation, and reliability.

```css
/* Hex Values */
--primary-50: #F5F0FF
--primary-100: #EBE0FF
--primary-200: #D6C1FF
--primary-300: #B894FF
--primary-400: #9966FF
--primary-500: #7B3FF2
--primary-600: #5E2ECC
--primary-700: #4521A6
--primary-800: #2E0249 /* Primary */
--primary-900: #1F0133
--primary-950: #0F0019
```

### Secondary - White
White `#FFFFFF` serves as the secondary color for contrast and clarity.

### Light Mode Theme
- **Background**: Pure white (#FFFFFF)
- **Foreground**: Dark purple tint (#2E0249 area)
- **Cards**: White with purple-tinted shadows
- **Borders**: Light purple (#EBE0FF)

### Dark Mode Theme
- **Background**: Deep purple cosmos (#1a0f2e)
- ** Foreground**: Purple-tinted white (#f5f0ff)
- **Cards**: Rich violet (#261952)
- **Primary Accent**: Electric purple (#c77dff)

## Typography

### Font Families
- **Sans**: Inter (body text)
- **Display**: Outfit (headings)
- **Mono**: Roboto Mono (code)

### Type Scale (8px Grid System)
```css
text-xs: 12px (0.75rem)
text-sm: 14px (0.875rem)
text-base: 16px (1rem)
text-lg: 18px (1.125rem)
text-xl: 20px (1.25rem)
text-2xl: 24px (1.5rem)
text-3xl: 30px (1.875rem)
text-4xl: 36px (2.25rem)
text-5xl: 48px (3rem)
```

## Spacing System (8px Grid)

```css
1: 8px
2: 16px
3: 24px
4: 32px
5: 40px
6: 48px
8: 64px
10: 80px
12: 96px
16: 128px
20: 160px
```

## Border Radius

```css
--radius-sm: 12px
--radius-md: 14px
--radius-lg: 16px
--radius-xl: 20px
--radius-2xl: 24px
--radius-full: 9999px
```

## Shadows

### Light Mode
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow: 0 2px 8px 0 rgb(46 2 73 / 0.1)
--shadow-md: 0 4px 12px 0 rgb(46 2 73 / 0.15)
--shadow-lg: 0 10px 20px -5px rgb(46 2 73 / 0.2)
--shadow-xl: 0 20px 30px -10px rgb(46 2 73 / 0.25)
```

### Dark Mode
```css
--shadow: 0 2px 10px 0 rgb(157 78 221 / 0.25)
--shadow-md: 0 4px 16px 0 rgb(157 78 221 / 0.3)
--shadow-lg: 0 10px 24px -5px rgb(157 78 221 / 0.4)
--shadow-colored: 0 10px 50px -10px rgba(199, 125, 255, 0.6)
```

## Gradients

### Primary Gradient
```css
background: linear-gradient(135deg, #2E0249 0%, #5E2ECC 100%);
```

### Light Gradient
```css
background: linear-gradient(135deg, #EBE0FF 0%, #D6C1FF 100%);
```

### Success Gradient
```css
background: linear-gradient(135deg, #10b981 0%, #059669 100%);
```

## Component Guidelines

### Buttons

#### Primary Button
- Background: Dark purple (#2E0249) or gradient
- Text: White
- Hover: Slight lift and shadow increase
- Focus: Ring (2px purple)
- Disabled: 50% opacity

#### Secondary Button
- Background: Transparent with border
- Border: 1px purple
- Text: Purple
- Hover: Fill with light purple background

#### Ghost Button
- Background: Transparent
- Text: Purple
- Hover: Light purple background (10% opacity)

### Cards

-  Background: White (light) / #261952 (dark)
- Border: 1px #EBE0FF (light) / #4a2f7a (dark)
- Border Radius: 16px (lg)
- Padding: 24px (6)
- Shadow: md
- Hover: Increase shadow to xl, slight translate up

### Forms

#### Input Fields
- Background: White (light) / #281854 (dark)
- Border: 1px #EBE0FF (light) / #4a2f7a (dark)
- Border Radius: 12px (md)
- Padding: 12px 16px
- Focus: Ring (2px purple), border color to primary

#### Labels
- Font Weight: 500 (medium)
- Color: Foreground
- Margin Bottom: 8px

### Navigation

#### Sidebar
- Background: #2E0249 (light) / #180a2e (dark)
- Width: 256px (desktop), Full width (mobile)
- Items: 48px height
- Active: Bright purple background
- Hover: Lighter purple

## Accessibility Standards

### Contrast Ratios (WCAG 2.1 AA)
-  Normal text: Minimum 4.5:1
- Large text (18px+): Minimum 3:1
- UI Components: Minimum 3:1

### Color Contrast Examples
```
#2E0249 on #FFFFFF: 12.5:1 ✓
#9966FF on #FFFFFF: 3.8:1 ✓ (large text only)
#2E0249 on #F5F0FF: 11.2:1 ✓
```

### Focus Indicators
- Always visible
- 2px solid outline
- 2px offset
- Color: Primary (#2E0249)

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Animations

### Duration
```css
--duration-fast: 150ms
--duration-base: 200ms
--duration-slow: 300ms
--duration-slower: 400ms
```

### Easing
```css
--ease-default: cubic-bezier(0.4, 0, 0.2, 1)
--ease-in: cubic-bezier(0.4, 0, 1, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

### Common Animations

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

#### Slide Up
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Hover Lift
```css
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}
```

## Glassmorphism

### Standard Glass Effect
```css
.glass {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.8); /* light */
  background: rgba(38, 25, 82, 0.6); /* dark */
  border: 1px solid rgba(255, 255, 255, 0.3); /* light */
  border: 1px solid rgba(199, 125, 255, 0.2); /* dark */
  box-shadow: var(--shadow-glass);
}
```

## Icons

- Library: Lucide React
- Size: 16px (sm), 20px (md), 24px (lg)
- Stroke Width: 2px
- Color: Inherit from parent

## Loading States

### Skeleton
- Background: Light purple gradient (#F5F0FF to #EBE0FF)
- Animation: Pulse (2s)
- Border Radius: Match component

### Spinner
- Color: Primary purple
- Size: 20px (sm), 32px (md), 48px (lg)
- Animation: Spin (1s linear infinite)

## Empty States

- Illustration: Optional (use purple-tinted graphics)
- Heading: 20px, semi-bold
- Description: 16px, muted foreground
- CTA Button: Primary style

## Dark/Light Mode Toggle

- Always visible in header
- Icon: Sun (light mode) / Moon (dark mode)
- Persist preference in localStorage
- Smooth transition: 300ms
- Both modes maintain purple theming

## Responsive Breakpoints

```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

## Usage Examples

### Creating a Card Component
```tsx
<div className="glass-card hover-lift">
  <h3 className="text-xl font-semibold text-foreground mb-2">
    Card Title
  </h3>
  <p className="text-muted-foreground">
    Card description content goes here.
  </p>
</div>
```

### Creating a Button
```tsx
<button className="bg-gradient-primary text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
  Get Started
</button>
```

### Creating an Input
```tsx
<div>
  <label className="block text-sm font-medium text-foreground mb-2">
    Email
  </label>
  <input
    type="email"
    className="w-full px-4 py-3 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary"
    placeholder="you@example.com"
  />
</div>
```

## Best Practices

1. **Consistency**: Always use design tokens (CSS variables) instead of hardcoded values
2. **Accessibility**: Test with keyboard navigation and screen readers
3. **Performance**: Use CSS transforms for animations (not top/left)
4. **Responsiveness**: Design mobile-first, enhance for larger screens
5. **Theming**: Test all components in both light and dark modes
6. **Spacing**: Follow the 8px grid system for all margins and paddings
7. **Typography**: Use semantic HTML headings (h1-h6) for proper structure

## Further Reading

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
