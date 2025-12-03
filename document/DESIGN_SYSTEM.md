# Growth OS Design System

## 🎨 Overview

All Growth OS pages now share a consistent, modern blue/purple gradient design system using reusable layout components.

---

## 🏗️ Core Components

### 1. AppShell

**Location:** `apps/frontend/src/components/AppShell.tsx`

**Purpose:** Provides consistent page layout with gradient header.

**Usage:**
```tsx
import { AppShell } from '@/components/AppShell';

export default function MyPage() {
  return (
    <AppShell
      title="My Page Title"
      subtitle="Optional subtitle text"
    >
      {/* Your page content */}
    </AppShell>
  );
}
```

**Features:**
- Gradient header bar (indigo → purple → sky)
- Consistent page title styling
- Optional subtitle
- Max-width container (6xl)
- Responsive padding

### 2. PageCard

**Location:** `apps/frontend/src/components/PageCard.tsx`

**Purpose:** Provides consistent card styling with gradient background and optional badge/icon.

**Usage:**
```tsx
import { PageCard } from '@/components/PageCard';

<PageCard
  title="Generate Content"
  subtitle="Select options and generate"
  badgeLabel="AI Engine"
  iconSlot={
    <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg">
      {/* SVG icon */}
    </div>
  }
>
  {/* Your card content */}
</PageCard>
```

**Features:**
- Rounded-3xl with soft gradient background
- Optional badge label in top-left
- Optional icon slot in top-right
- Consistent header border
- Responsive layout

---

## 🎨 Color Palette

### Brand Gradients

**Primary Gradient** (Headers):
```css
from-indigo-500 via-purple-500 to-sky-500
```

**Button Gradient** (CTAs):
```css
from-indigo-600 via-purple-600 to-sky-500
```

**Card Background** (Soft):
```css
from-indigo-500/5 via-purple-500/10 to-sky-500/5
```

**Icon Background**:
```css
from-indigo-500 to-purple-500
```

### Accent Colors

**Success** (Green):
```css
from-green-500 to-emerald-500
```

**Warning** (Amber):
```css
bg-amber-50 border-amber-200 text-amber-800
```

**Error** (Red):
```css
bg-red-50 border-red-200 text-red-800
```

---

## 📐 Design Tokens

### Spacing
- Page padding: `px-4 py-8`
- Card spacing: `space-y-8`
- Form field spacing: `space-y-4`
- Section spacing: `space-y-6`

### Border Radius
- Cards: `rounded-3xl`
- Helper panels: `rounded-2xl`
- Badges: `rounded-full`
- Code blocks: `rounded-2xl`
- Buttons: `rounded-md` (default)

### Shadows
- Main cards: `shadow-xl`
- Helper panels: `shadow-sm`
- Icon containers: `shadow-lg`

### Typography
- Page title: `text-2xl font-semibold`
- Card title: `text-2xl font-semibold text-slate-900`
- Section heading: `font-semibold text-slate-900`
- Body text: `text-sm text-slate-600`
- Helper text: `text-xs text-slate-500`

---

## 🎯 Page-Specific Icons

All icons use inline SVG for zero dependencies:

### Personas
**Icon:** Users / Group
```tsx
<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
</svg>
```

### Messaging
**Icon:** Megaphone
```tsx
<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
</svg>
```

### Scripts
**Icon:** Film / Video
```tsx
<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
</svg>
```

### Blogs
**Icon:** FileText / Document
```tsx
<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
</svg>
```

### Success / Check
**Icon:** Checkmark
```tsx
<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
</svg>
```

---

## 🧩 Component Patterns

### Standard Page Structure

```tsx
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';
import { Button } from '@/components/ui/button';
// ... other imports

export default function MyPage() {
  return (
    <AppShell
      title="Page Name"
      subtitle="Brief description of what this page does"
    >
      {/* Main form/generation card */}
      <PageCard
        title="Primary Action"
        subtitle="Instructions for the user"
        badgeLabel="AI Engine Type"
        iconSlot={/* icon here */}
      >
        {/* Form fields */}
        {/* Generate button */}
      </PageCard>

      {/* Error alert (if needed) */}
      {error && <Alert variant="destructive">...</Alert>}

      {/* Result card */}
      {result && (
        <Card className="border-0 shadow-xl rounded-3xl">
          {/* Result display */}
        </Card>
      )}

      {/* Optional validation panel */}
      {result && <GlobalValidationPanel ... />}
    </AppShell>
  );
}
```

### Form Field Pattern

```tsx
<div className="space-y-2">
  <Label htmlFor="field-id" className="text-sm font-medium text-slate-800">
    Field Label
  </Label>
  <Select
    id="field-id"
    value={value}
    onValueChange={setValue}
  >
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
  </Select>
</div>
```

### Helper Info Pattern

```tsx
<div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
  <p className="text-sm font-medium text-slate-800">
    Title or Heading
  </p>
  <p className="text-xs text-slate-600 mt-1">
    Supporting text or description
  </p>
</div>
```

### Action Button Pattern

```tsx
<Button
  onClick={handleAction}
  disabled={loading}
  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 text-white shadow-md hover:brightness-110"
  size="lg"
>
  {loading ? 'Processing...' : 'Primary Action'}
</Button>
```

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: Default (< 768px)
- **Tablet**: `md:` (>= 768px)
- **Desktop**: `lg:` (>= 1024px)

### Patterns

**Hide on mobile, show on desktop:**
```tsx
<div className="hidden md:flex">
  {/* Desktop-only content */}
</div>
```

**Grid layouts:**
```tsx
{/* 1 column mobile, 2 columns desktop */}
<div className="grid gap-8 md:grid-cols-[2fr,1.4fr]">
  <div>{/* Main content */}</div>
  <div>{/* Sidebar */}</div>
</div>
```

---

## ✨ Special Effects

### Gradient Button Hover

```tsx
<Button className="bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 text-white shadow-md hover:brightness-110 transition-all">
  Button Text
</Button>
```

The `hover:brightness-110` creates a smooth brightening effect on hover.

### Glass Card Effect

```tsx
<div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm">
  {/* Content */}
</div>
```

### Success Badge

```tsx
<div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
  <svg>{/* checkmark */}</svg>
</div>
```

---

## 🎭 Visual Hierarchy

### Level 1: Page Header
- Gradient background
- White text
- Bold title + subtle subtitle

### Level 2: Main Card
- Soft gradient background
- Large rounded corners
- Badge + Icon + Title

### Level 3: Result Cards
- White background
- Success badge/icon
- Clear content sections

### Level 4: Helper Panels
- Light background
- Smaller corners
- Supportive information

---

## 📊 Layout Grid

```
┌─────────────────────────────────────────────┐
│  Gradient Header (indigo → purple → sky)    │
│  Page Title • Subtitle                      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  PageCard (soft gradient background)        │
│  ┌─────────────────┬───────────────────┐   │
│  │ Form Fields     │ Helper Info Panel │   │
│  │                 │                   │   │
│  │ [Generate]      │ What to expect   │   │
│  └─────────────────┴───────────────────┘   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Result Card (white, rounded-3xl)           │
│  ✓ Generated Content                        │
│                                             │
│  Content sections...                        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Validation Panel (if applicable)           │
└─────────────────────────────────────────────┘
```

---

## 🔧 Customization

### Change Brand Colors

Edit the gradient classes in `AppShell.tsx` and `PageCard.tsx`:

```tsx
// From:
bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500

// To (example):
bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500
```

### Change Card Style

Edit `PageCard.tsx`:

```tsx
// Current:
className="border-0 shadow-xl rounded-3xl bg-gradient-to-br from-indigo-500/5 via-purple-500/10 to-sky-500/5"

// Alternative (flat):
className="border shadow-md rounded-2xl"
```

### Change Button Style

```tsx
// Current gradient:
className="bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500"

// Alternative solid:
className="bg-indigo-600 hover:bg-indigo-700"
```

---

## 📦 Pages Using Design System

### ✅ Implemented
- `/personas` - Persona generation
- `/messaging` - Messaging generation
- `/scripts` - Video script generation
- `/blogs` - Blog outline generation

### 🔲 Can Be Added
- `/validate` - Validation page
- `/social` - Social analytics (different layout, can be customized)
- `/` - Homepage/dashboard

---

## 🎯 Design Principles

### 1. Consistency
- All pages use same header
- All main actions use same card
- All results use same display pattern

### 2. Clarity
- Clear visual hierarchy
- Color-coded feedback (green = success, amber = warning, red = error)
- Obvious primary actions

### 3. Modern
- Gradients instead of flat colors
- Rounded corners (rounded-3xl)
- Soft shadows (shadow-xl)
- Smooth hover effects

### 4. Responsive
- Mobile-first design
- Progressive enhancement for larger screens
- Hidden elements on mobile (icons, helper panels)

---

## 🖼️ Visual Examples

### Header Bar
```
┌──────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓ Gradient ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │
│                                          │
│ Growth OS · Page Name                    │
│ Subtitle text in lighter color           │
└──────────────────────────────────────────┘
```

### Main Card
```
┌──────────────────────────────────────────┐
│  [AI Engine]                        [📷] │
│                                          │
│  Generate Content                        │
│  Instructions for the user               │
│ ─────────────────────────────────────    │
│  Form fields here...                     │
│                                          │
│  [Generate Button with Gradient]         │
└──────────────────────────────────────────┘
```

### Result Card
```
┌──────────────────────────────────────────┐
│  [✓] Content Generated                   │
│      For Persona · Product               │
│ ─────────────────────────────────────    │
│  Section 1                               │
│  Content...                              │
│                                          │
│  Section 2                               │
│  Content...                              │
└──────────────────────────────────────────┘
```

---

## 💡 Best Practices

### Do's ✅
- Use AppShell for all content pages
- Use PageCard for main actions
- Use gradient buttons for primary CTAs
- Use inline SVG icons
- Maintain consistent spacing

### Don'ts ❌
- Don't mix different gradient colors on same page
- Don't use lucide-react or other icon libraries (use inline SVG)
- Don't use flat colors for primary buttons
- Don't skip the AppShell wrapper
- Don't create custom page headers

---

## 🔄 Migration Guide

### Before (Old Style)
```tsx
export default function MyPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Title</h1>
      <p className="text-muted-foreground mb-8">Subtitle</p>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Form Title</CardTitle>
        </CardHeader>
        <CardContent>
          {/* form */}
        </CardContent>
      </Card>
    </div>
  );
}
```

### After (New Style)
```tsx
import { AppShell } from '@/components/AppShell';
import { PageCard } from '@/components/PageCard';

export default function MyPage() {
  return (
    <AppShell title="Title" subtitle="Subtitle">
      <PageCard
        title="Form Title"
        subtitle="Instructions"
        badgeLabel="Engine Type"
        iconSlot={/* icon */}
      >
        {/* form */}
      </PageCard>
    </AppShell>
  );
}
```

---

## 📈 Benefits

### For Users
- **Professional look** - Modern, polished interface
- **Easy navigation** - Consistent layout reduces cognitive load
- **Clear hierarchy** - Know where to look for actions and results
- **Brand cohesion** - All pages feel like one unified product

### For Developers
- **Faster development** - Reusable components = less code
- **Consistency** - Can't accidentally create different layouts
- **Maintainability** - Update one component, all pages update
- **Type-safe** - Full TypeScript support

---

## 🎨 Future Enhancements

### Dark Mode
- Add theme toggle to AppShell
- Use CSS variables for colors
- Support `dark:` Tailwind classes

### Animations
- Page transitions
- Card entry animations
- Button ripple effects

### Advanced Gradients
- Animated gradients
- Mesh gradients
- 3D card effects

---

## 📚 Related Documentation

- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Full project overview
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Setup instructions
- shadcn/ui docs - Component API reference

---

## ✅ Summary

**All Growth OS pages now share:**
- ✅ Consistent gradient header
- ✅ Modern card styling
- ✅ Blue/purple brand colors
- ✅ Responsive layouts
- ✅ Professional look and feel

**The design system is complete and production-ready!** 🎉

---

**Created:** December 2024  
**Status:** Complete ✅

