# QuickSpin Dark Mode - Quick Reference

## Color Tokens

### Primary Colors
```tsx
// Use in components
className="bg-primary text-primary-foreground"
className="border-primary hover:border-primary/80"
className="text-primary hover:text-primary/90"
```

### Semantic Colors
```tsx
// Success
className="bg-success text-success-foreground"
className="text-success" // For badges/text

// Warning
className="bg-warning text-warning-foreground"
className="text-warning"

// Error
className="bg-error text-error-foreground"
className="text-error"

// Info
className="bg-info text-info-foreground"
className="text-info"
```

### Surface Colors
```tsx
// Card backgrounds
className="bg-card text-card-foreground"

// Muted backgrounds
className="bg-muted text-muted-foreground"

// Accent backgrounds
className="bg-accent text-accent-foreground"
```

## Commonly Used Utility Classes

### Glassmorphism
```tsx
className="glass-card" // Card with glass effect + hover
className="glass" // Basic glass effect
className="glass-light" // Lighter glass
className="glass-purple" // Purple-tinted glass
```

### Hover Effects
```tsx
className="hover-lift" // Lifts element on hover
className="hover-scale" // Scales element on hover
className="hover-glow" // Adds glow on hover
className="hover-glow-subtle" // Subtle glow
className="hover-border-glow" // Glowing border
```

### Transitions
```tsx
className="transition-theme" // 300ms smooth transition
className="transition-smooth" // 200ms smooth transition
className="transition-bounce" // Bouncy transition
```

### Gradients
```tsx
className="bg-gradient-primary" // Purple gradient
className="bg-gradient-success" // Green gradient
className="bg-gradient-warning" // Amber gradient
className="bg-gradient-info" // Blue gradient
className="text-gradient" // Gradient text
```

## Component Examples

### Button with Hover Effect
```tsx
<Button
  variant="default"
  className="hover-glow-subtle"
>
  Click Me
</Button>
```

### Card with Glass Effect
```tsx
<Card className="glass-card hover-lift">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Input with Proper Focus
```tsx
<Input
  placeholder="Enter text..."
  className="focus-visible:ring-2 focus-visible:ring-primary"
/>
```

### Badge with Semantic Color
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Error</Badge>
```

## Dark Mode Specific Styles

### Conditional Dark Mode Classes
```tsx
// Different backgrounds
className="bg-white dark:bg-card"

// Different text colors
className="text-gray-900 dark:text-foreground"

// Different borders
className="border-gray-200 dark:border-border"

// Different shadows
className="shadow-md dark:shadow-lg dark:shadow-primary/20"
```

### Common Dark Mode Patterns
```tsx
// Cards
className="bg-white dark:bg-card border dark:border-border
           shadow-sm dark:shadow-md"

// Buttons
className="bg-primary hover:bg-primary/90
           dark:shadow-primary/20 dark:hover:shadow-primary/30"

// Inputs
className="bg-white dark:bg-input border dark:border-border
           focus:border-primary dark:focus:border-primary"

// Text
className="text-gray-700 dark:text-foreground"
className="text-gray-500 dark:text-muted-foreground"
```

## Shadows

### Standard Shadows
```tsx
className="shadow-sm" // Subtle
className="shadow" // Default
className="shadow-md" // Medium
className="shadow-lg" // Large
className="shadow-xl" // Extra large
```

### Special Shadows
```tsx
className="shadow-colored" // Purple-tinted shadow
className="shadow-glass" // Glassmorphism shadow
```

## Focus States

### Accessibility-Compliant Focus
```tsx
className="focus-visible:outline-none
           focus-visible:ring-2
           focus-visible:ring-primary
           focus-visible:ring-offset-2"
```

## Responsive Dark Mode

### System Theme Detection
```tsx
// ThemeProvider automatically handles this
// Use next-themes useTheme hook:
const { theme, setTheme } = useTheme()
```

### Manual Theme Toggle
```tsx
import { ThemeToggle } from "@/components/ui/theme-toggle"

<ThemeToggle />
```

## Animation Classes

### Fade In
```tsx
className="animate-in"
```

### Slide Up
```tsx
className="animate-slide-up"
```

### Slide From Top
```tsx
className="animate-slide-in-from-top-2"
```

## Tips & Best Practices

1. **Always use semantic color tokens** instead of hardcoded colors
2. **Test in both light and dark modes** during development
3. **Use the `dark:` prefix** for dark mode specific styles
4. **Leverage utility classes** instead of custom CSS when possible
5. **Maintain 4.5:1 contrast ratio** for normal text (WCAG AA)
6. **Use `transition-all`** sparingly - prefer specific properties
7. **Add hover states** to all interactive elements
8. **Include focus indicators** for accessibility
9. **Test with keyboard navigation**
10. **Use reduced motion** media query for animations

## Common Patterns

### Interactive Card
```tsx
<Card className="glass-card hover-lift hover-border-glow cursor-pointer">
  {/* Content */}
</Card>
```

### Form Input
```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    className="transition-smooth"
  />
</div>
```

### Status Badge
```tsx
{status === 'running' && <Badge variant="success">Running</Badge>}
{status === 'stopped' && <Badge variant="error">Stopped</Badge>}
{status === 'pending' && <Badge variant="warning">Pending</Badge>}
```

### Modal with Dark Mode
```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Modal Title"
  size="lg"
  className="dark:border-primary/20"
>
  {/* Content */}
</Modal>
```

## Development Workflow

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Build for production:**
   ```bash
   npm run build
   ```

3. **Test theme switching:**
   - Click theme toggle in header
   - Check all components in both modes
   - Verify contrast ratios

4. **Accessibility testing:**
   - Use keyboard navigation (Tab, Enter, Escape)
   - Check focus indicators
   - Test with screen reader
   - Run Lighthouse audit

## Troubleshooting

### Styles not applying in dark mode?
- Check if you're using `dark:` prefix
- Verify ThemeProvider wraps your app
- Ensure `class` dark mode strategy in tailwind config

### Transitions not smooth?
- Add `transition-all duration-200` or similar
- Check for `!important` overrides
- Verify no conflicting transitions

### Colors look wrong?
- Use semantic tokens (e.g., `bg-card` not `bg-gray-900`)
- Check HSL values in globals.css
- Verify CSS variables are defined

### Focus indicators not showing?
- Use `focus-visible:` prefix
- Check outline is not set to `none`
- Verify ring colors are defined

## Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# Lint code
npm run lint
```

## Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Next.js Dark Mode](https://nextjs.org/docs/app/building-your-application/styling/css-modules#dark-mode)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Radix UI](https://www.radix-ui.com/)
