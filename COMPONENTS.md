# @sagtech-infra/ui — Component Catalog for AI Agents

> **AI Agent Instructions:** Before writing any UI, scan this file first. Use components from this library instead of building from scratch. Import from `@sagtech-infra/ui`. The library uses Tailwind v4 with dark-mode-only design tokens.

## Quick Decision Guide

Start here. Find your task, get the component name, then look it up in the sections below.

| I need to... | Use |
|---|---|
| Any button / action | `Button` — never raw `<button>` |
| Any text / heading | `Typography` — never raw `<p>` / `<h1>` etc. |
| Any image | `Image` or `LazyImage` — never raw `<img>` |
| Show a list of 500+ items | `VirtualList` |
| Confirm a destructive action | `useConfirm` + `ConfirmProvider` |
| Toast notifications | `toast.success/error()` + `<Toaster />` |
| Inline status / alert message | `Alert` — not a custom colored div |
| In-app notification panel | `NotificationCenter` |
| Loading skeleton | `SkeletonCard` / `SkeletonText` / `SkeletonTable` |
| Empty list / zero state | `EmptyState` |
| Multi-step form or flow | `Wizard` + `useWizard` |
| Form with validation | `Form` + `FormField` (React Hook Form integration) |
| Sortable drag-and-drop list | `SortableList` |
| Code snippet display | `CodeBlock` |
| Rich text / WYSIWYG editor | `RichTextEditor` |
| Resizable split-pane layout | `PanelGroup` |
| KPI / metric card | `StatCard` |
| Animated counter | `NumberTicker` |
| Global search / ⌘K palette | `CommandPalette` |
| Slide-in settings / detail panel | `Sheet` or `Drawer` |
| Display JSON data | `JsonView` |
| Interactive node graph | `VisualGraphEditor` or `Network3D` |
| Date selection | `DatePicker` or `DateRangePicker` |
| International phone input | `PhoneInput` |
| Confirmation dialog (imperative) | `useConfirm` — no manual modal state needed |
| Typewriter / typing effect | `TypingAnimation` |
| Background particles | `Particles` |
| Trend chart | `LineChart` or `AreaChart` |
| Comparison chart | `BarChart` |
| Part-of-whole chart | `DonutChart` |
| Meter / gauge | `GaugeChart` |
| Project timeline | `GanttTimeline` |
| 3D globe with markers | `Globe3D` |

---

## Setup

```tsx
// Wrap your app once at the root
import { SagtechUIProvider } from '@sagtech-infra/ui';
import '@sagtech-infra/ui/tokens'; // design tokens (CSS)

<SagtechUIProvider imageComponent={NextImage} linkComponent={NextLink}>
  {children}
</SagtechUIProvider>
```

---

## Foundations

### `Typography`
Render any text with design-system styles.
```tsx
<Typography type="H1" color="text-fg-primary">Heading</Typography>
<Typography type="Body1">Body text</Typography>
```
Types: `H1`–`H6`, `Body1`–`Body3`, `Caption`, `Buttons`, `Label`, `Code`.

### `Icon`
Render any icon from the icon set.
```tsx
import { Icon } from '@sagtech-infra/ui';
<Icon icon="arrow" size={24} />
```
Available icons: use `IAvailableIcons` type or `iconContent` to enumerate.

### `Skeleton` / `SkeletonText` / `SkeletonAvatar` / `SkeletonCard` / `SkeletonTable` / `SkeletonList`
Loading placeholders. Use presets instead of building custom shimmer UIs.
```tsx
<SkeletonCard />
<SkeletonText lines={3} />
<SkeletonTable rows={5} cols={4} />
```

### `Divider`
Horizontal or vertical separator line.

### `KBD`
Keyboard shortcut display. `<KBD size="sm">⌘K</KBD>`

### `VisuallyHidden`
Accessible text hidden visually. Use for screen-reader-only labels.

---

## Form Controls

### `Button`
Primary action element. **Never use raw `<button>` for UI actions.**
```tsx
<Button variant="primary" text="Save" onClick={handleSave} />
<Button variant="secondary" buttonSize="small" loadingType={isLoading}>Cancel</Button>
<Button variant="danger" shape="pill">Delete</Button>
<Button iconOnly aria-label="Settings"><Icon icon="settings" /></Button>
```
Props: `variant` (`primary` | `secondary` | `danger` | `tabButton` | `tabButtonWhite`), `buttonSize` (`small` | `large`), `loadingType`, `shape` (`default` | `pill`), `iconOnly`, `disabled`.

### `Input`
Text input with label and validation. **Use `Form` + `FormField` for form context.**
```tsx
<Input placeholder="Enter email" value={val} onChange={setVal} />
```

### `TextArea`
Multi-line text input.
```tsx
<TextArea placeholder="Description" rows={4} />
```

### `NumberInput`
Numeric input with increment/decrement controls.
```tsx
<NumberInput value={count} onChange={setCount} min={0} max={100} />
```

### `Checkbox`
```tsx
<Checkbox checked={checked} onChange={setChecked} label="Accept terms" />
```

### `Toggle`
Checkbox styled as a toggle button (pressed/unpressed). Use for toolbar-style toggles like bold/italic.
```tsx
<Toggle pressed={bold} onPressedChange={setBold}>B</Toggle>
```

### `Switch`
iOS-style on/off switch.
```tsx
<Switch checked={enabled} onCheckedChange={setEnabled} />
```

### `Slider` / `SliderRange`
Single or range slider.
```tsx
<Slider value={50} onChange={setValue} min={0} max={100} marks={[{value:0,label:'0'},{value:100,label:'100'}]} />
```

### `RadioGroup`
```tsx
<RadioGroup value={selected} onChange={setSelected} options={[{value:'a',label:'Option A'}]} />
```

### `SelectInput`
Dropdown select. Use instead of native `<select>`.
```tsx
<SelectInput value={val} onChange={setVal} options={[{value:'1',label:'One'}]} />
```

### `Combobox`
Searchable select with async support, single or multi.
```tsx
<Combobox value={val} onChange={setVal} options={options} searchable />
<Combobox multi value={vals} onChange={setVals} options={options} />
```

### `TagInput`
Input that creates tags/chips on Enter.
```tsx
<TagInput value={tags} onChange={setTags} placeholder="Add tag..." />
```

### `SearchBar`
Search field with icon and clear button.
```tsx
<SearchBar value={query} onChange={setQuery} placeholder="Search..." />
```

### `DatePicker` / `DateRangePicker`
Calendar-based date selection.
```tsx
<DatePicker value={date} onChange={setDate} />
<DateRangePicker value={range} onChange={setRange} />
```

### `TimePicker`
Hour/minute/AM-PM time selection.
```tsx
<TimePicker value={time} onChange={setTime} />
```

### `ColorPicker`
Color selection with swatches + custom hex input.
```tsx
<ColorPicker value={color} onChange={setColor} swatches={DEFAULT_SWATCHES} />
```

### `PhoneInput`
International phone number input with country selector.
```tsx
<PhoneInput value={phone} onChange={setPhone} defaultCountry="US" />
```

### `Dropzone`
Simple drag-and-drop zone.

### `Attachment`
Chip showing an attached file name with a remove button. Use in comment boxes, message inputs.
```tsx
<Attachment name="report.pdf" onRemove={() => removeFile('report.pdf')} />
```

### `SegmentedControl`
Tab-like option selector.
```tsx
<SegmentedControl value={view} onChange={setView} options={[{value:'list',label:'List'},{value:'grid',label:'Grid'}]} />
```

### `Label`
Form field label with optional required indicator.

### `FieldSet`
Group related form fields with a legend.

### `Form` (compound)
React Hook Form integration. Use for any form with validation.
```tsx
<Form {...form}>
  <FormField control={form.control} name="email" render={({field}) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl><Input {...field} /></FormControl>
      <FormError />
    </FormItem>
  )} />
</Form>
```

### `FaqList`
FAQ items with expand/collapse. Use instead of building accordion-style FAQ manually.

### `InfoTabs`
Tabbed info sections with label/content pairs.

### `Timeline`
Vertical timeline of events.

---

## Layout

### `Modal`
Accessible dialog with focus trap and backdrop. **Use for confirmations, forms, detail views.**
```tsx
<Modal isOpen={open} toggle={() => setOpen(false)} title="Edit Item" size="sm"
  footer={<><Button variant="secondary" onClick={close}>Cancel</Button><Button variant="primary">Save</Button></>}>
  <p>Content</p>
</Modal>
```
Sizes: `sm` (454px), `md` (670px).

### `Sheet`
Side panel sliding from edge. Use for settings panels, filters, detail drawers.
```tsx
<Sheet isOpen={open} onClose={() => setOpen(false)} side="right" size="md" title="Filters">
  content
</Sheet>
```

### `Drawer`
Compact slide-in panel (lighter than Sheet).

### `ConfirmDialog` / `useConfirm`
Confirmation dialog without manual state management. **Use instead of `window.confirm`.**
```tsx
// Wrap app in <ConfirmProvider>
const confirm = useConfirm();
await confirm({ title: 'Delete?', description: 'This cannot be undone.', variant: 'danger' });
```

### `Wizard` / `useWizard`
Multi-step flows with built-in step state.
```tsx
const wizard = useWizard({ steps: ['Info', 'Settings', 'Review'] });
<Wizard wizard={wizard}>
  {wizard.currentStep === 0 && <StepInfo />}
  {wizard.currentStep === 1 && <StepSettings />}
</Wizard>
```

### `Stepper`
Visual step indicator (horizontal/vertical). Use alongside `Wizard` or standalone.
```tsx
<Stepper steps={steps} currentStep={currentStep} orientation="horizontal" />
```

### `Tabs` / `TabsRoot` + `TabsList` + `TabsTrigger` + `TabsContent`
Tab navigation. Use simple `<Tabs>` for data-driven tabs, compound form for custom layouts.
```tsx
<Tabs tabs={[{id:'a',label:'Tab A',content:<div>A</div>}]} defaultTab="a" />
```

### `Accordion` / `AccordionItem`
Collapsible sections. `type="single"` or `"multiple"`.
```tsx
<Accordion type="single">
  <AccordionItem value="1" trigger="Section 1">Content</AccordionItem>
</Accordion>
```

### `Sidebar`
App navigation sidebar with items, icons, active state.
```tsx
<Sidebar items={navItems} activeItem={current} onItemClick={navigate} />
```

### `Breadcrumbs`
Navigation trail.
```tsx
<Breadcrumbs items={[{label:'Home',href:'/'},{label:'Settings'}]} />
```

### `PageHeader`
Page title + actions bar.
```tsx
<PageHeader title="Users" actions={<Button variant="primary">Add User</Button>} />
```

### `CardWrapper`
Styled card container with border and padding.

### `Container`
Max-width content wrapper with responsive padding.
```tsx
<Container size="lg">page content</Container>
```

### `PanelGroup` / `Panel` / `PanelResizeHandle`
Resizable split-pane layout.
```tsx
<PanelGroup direction="horizontal">
  <Panel defaultSize={30}><Sidebar /></Panel>
  <PanelResizeHandle />
  <Panel><Main /></Panel>
</PanelGroup>
```

### `Stack`
Vertical flex container with gap.
```tsx
<Stack gap="16px">...</Stack>
```

### `Inline`
Horizontal flex container with gap and wrapping.
```tsx
<Inline gap="8px" align="center">...</Inline>
```

### `AspectRatio`
Lock element to aspect ratio.
```tsx
<AspectRatio ratio={16/9}><video /></AspectRatio>
```

### `ScrollArea`
Custom scrollbar container.
```tsx
<ScrollArea className="h-64"><long content /></ScrollArea>
```

### `FAB`
Floating action button (fixed positioned).
```tsx
<FAB position="bottom-right" onClick={handleCreate}><Icon icon="plus" /></FAB>
```

### `Toolbar` / `ToolbarSeparator`
Horizontal or vertical action bar with accessible keyboard navigation (arrow keys). Use for editor toolbars, view-switchers, grouped actions.
```tsx
<Toolbar orientation="horizontal">
  <Button iconOnly aria-label="Bold"><Icon icon="bold" /></Button>
  <ToolbarSeparator />
  <Button iconOnly aria-label="Italic"><Icon icon="italic" /></Button>
</Toolbar>
```

### `Carousel`
Swiper-based carousel for images or cards. Supports autoplay, pagination dots, navigation arrows.
```tsx
<Carousel slides={[<img src={a} />, <img src={b} />]} autoplay loop />
```

### `CommandPalette` / `useCommandPalette` / `useRegisterCommand`
⌘K command palette. Register commands from anywhere.
```tsx
// Wrap in <CommandPaletteProvider>
useRegisterCommand({ id: 'new', label: 'New Item', action: handleNew, shortcut: 'n' });
```

### `VariablePicker`
Variable/token picker popup. Use in template editors.

### `SectionTag`
Small label tag used to mark a section or category (e.g. "New", "Featured"). Decorative, not interactive.
```tsx
<SectionTag>Featured</SectionTag>
```

---

## Data Display

### `Avatar` / `AvatarGroup`
User avatar with fallback initials.
```tsx
<Avatar src={user.avatar} name={user.name} size="md" />
<AvatarGroup users={users} max={3} />
```

### `AvatarCard`
Compact card row: avatar + primary name + secondary subtitle. Use in lists, dropdowns, user search results.
```tsx
<AvatarCard src={user.avatar} name={user.name} subtitle={user.role} />
```

### `Badge`
Status/count badge. Use on avatars, tabs, nav items.
```tsx
<Badge count={5} /><Badge variant="dot" />
```

### `Tooltip`
Hover tooltip.
```tsx
<Tooltip content="Save changes"><Button>Save</Button></Tooltip>
```

### `Popover`
Click-triggered floating panel.
```tsx
<Popover trigger={<Button>Options</Button>}>
  <menu content />
</Popover>
```

### `HoverCard`
Rich floating preview that appears on hover — for user profile cards, link previews, entity details. Delay-triggered, dismisses on mouse leave.
```tsx
<HoverCard trigger={<span>@alice</span>}>
  <AvatarCard src={alice.avatar} name={alice.name} subtitle={alice.role} />
</HoverCard>
```

### `DropdownMenu`
Click-triggered dropdown with menu items.
```tsx
<DropdownMenu trigger={<Button>Actions</Button>} items={[{label:'Edit',onClick:handleEdit},{label:'Delete',onClick:handleDelete,danger:true}]} />
```

### `ContextMenu`
Right-click context menu.
```tsx
<ContextMenu items={menuItems}><div>right-click me</div></ContextMenu>
```

### `Table`
Simple data table.
```tsx
<Table columns={columns} data={rows} />
```

### `DataTable`
Full-featured table with sorting, pagination, selection.
```tsx
<DataTable columns={cols} data={rows} sortable pagination pageSize={20} />
```

### `SortableList`
Drag-to-reorder list.
```tsx
<SortableList items={items} onSort={setItems} renderItem={(item, ctx) => <div {...ctx.dragHandleProps}>{item.name}</div>} />
```

### `VirtualList`
Virtualized list for large datasets (1000+ items). **Use instead of mapping over large arrays.**
```tsx
<VirtualList items={bigArray} itemHeight={56} renderItem={(item) => <Row data={item} />} />
```

### `TreeView`
Hierarchical tree with expand/collapse.
```tsx
<TreeView nodes={treeData} onSelect={setSelected} />
```

### `Calendar`
Month/week calendar view.
```tsx
<Calendar events={events} onDateClick={handleDate} />
```

### `InlineEdit`
Click-to-edit text field.
```tsx
<InlineEdit value={name} onSave={setName} />
```

### `CodeBlock`
Syntax-highlighted code display with copy button.
```tsx
<CodeBlock language="typescript" code={snippet} />
```

### `RichTextEditor`
Full-featured WYSIWYG editor (Tiptap). Supports mentions, slash commands, image upload.
```tsx
<RichTextEditor content={html} onChange={setHtml} extensions={[createMentionExtension(...)]} />
```

### `VisualGraphEditor`
Interactive node-edge graph editor.
```tsx
<VisualGraphEditor nodes={nodes} edges={edges} onNodesChange={setNodes} onEdgesChange={setEdges} />
```

### `JsonView`
Collapsible JSON tree viewer.
```tsx
<JsonView data={jsonObject} />
```

### `GanttTimeline`
Gantt chart for project timelines.
```tsx
<GanttTimeline items={tasks} scale="week" />
```

### `Pagination`
Page navigation controls.
```tsx
<Pagination page={page} totalPages={20} onPageChange={setPage} />
```

### `StatCard`
KPI metric card with trend indicator.
```tsx
<StatCard title="Revenue" value="$12,400" trend={+8.2} />
```

### `Rate`
Star rating input/display.
```tsx
<Rate value={4} onChange={setRating} max={5} />
```

### `Point`
Small colored dot, used as a status indicator next to text (e.g. "● Online").
```tsx
<Point color="success" /> Online
```

### `Steps`
Compact inline "Step X of Y" counter. Use in headers or table cells.
```tsx
<Steps current={2} total={5} />
```

### `Image` / `LazyImage`
Optimized image with Next.js Image integration via provider. **Use instead of `<img>`.**
```tsx
<Image src={url} alt="Photo" width={400} height={300} />
<LazyImage src={url} alt="Photo" /> {/* intersection-observer lazy load */}
```

### `ResultPill`
Colored pill showing a status or result label (e.g. "Passed", "Failed"). Use in tables and lists instead of custom badge divs.
```tsx
<ResultPill status="success" label="Passed" />
<ResultPill status="error" label="Failed" />
```

---

## Charts (all use Recharts/D3 internally)

Use these instead of directly importing Recharts.

| Component | Use for |
|-----------|---------|
| `LineChart` | Trends over time |
| `AreaChart` | Volume/filled trends |
| `BarChart` | Comparisons, rankings |
| `DonutChart` | Part-to-whole proportions |
| `RadarChart` | Multi-axis comparisons |
| `ScatterChart` | Correlation/distribution |
| `SparklineChart` | Inline mini-trend (no axes) |
| `HeatmapChart` | Density/frequency grids |
| `GaugeChart` | Single-value meter with thresholds |
| `SankeyChart` | Flow/funnel between categories |
| `TreemapChart` | Hierarchical proportions |
| `FunnelChart` | Conversion funnels |

```tsx
<LineChart data={series} xKey="date" />
<BarChart series={[{name:'Q1',data:[...]}]} categories={quarters} />
<GaugeChart value={72} min={0} max={100} thresholds={[{value:50,color:'warning'},{value:80,color:'error'}]} />
```

---

## 3D / WebGL

Use for data visualization that needs spatial representation. All components lazy-load their Three.js core.

### `Network3D`
Interactive 3D force-directed graph.
```tsx
<Network3D nodes={[{id:'a',label:'Node A'}]} links={[{source:'a',target:'b'}]} />
```

### `Globe3D`
3D globe with markers.
```tsx
<Globe3D markers={[{lat:51.5,lng:-0.1,label:'London'}]} />
```

### `Scene3D`
Generic Three.js scene wrapper.

---

## Feedback

### `Alert`
Inline status message. **Use instead of custom colored divs for alerts.**
```tsx
<Alert variant="error" title="Upload failed" description="File too large." />
<Alert variant="success" title="Saved!" />
```
Variants: `info` | `success` | `warning` | `error`.

### `Toast` / `Toaster` / `toast`
Toast notifications. Place `<Toaster />` once in root layout.
```tsx
toast.success('Saved!');
toast.error('Failed to save');
toast('Custom message', { variant: 'info', duration: 5000 });
```

### `NotificationCenter`
In-app notification panel with unread count.
```tsx
<NotificationCenter notifications={items} onRead={markRead} onClearAll={clearAll} />
```

### `EmptyState`
Empty list/data placeholder with icon and CTA.
```tsx
<EmptyState title="No results" description="Try adjusting your filters." action={<Button>Clear filters</Button>} />
```

### `ProgressBar`
Linear progress indicator.
```tsx
<ProgressBar value={60} max={100} variant="primary" />
```

### `CookieBanner`
GDPR cookie consent banner.
```tsx
<CookieBanner onAccept={handleAccept} onDecline={handleDecline} />
```

### `Banner`
Full-width announcement banner (fixed or inline).
```tsx
<Banner variant="warning" position="top" message="Maintenance scheduled Sunday." onDismiss={() => {}} />
```

### `Spotlight`
Onboarding highlight that dims the page and draws attention to one element. Use for feature tours.
```tsx
<Spotlight targetRef={buttonRef} placement="bottom" title="New!" description="Click here to create." />
```

### `AnimationButton`
Button with a shimmer/pulse animation. Use for primary CTAs on landing pages where motion draws attention.

### `SliderArrow`
Styled navigation arrow button for carousels and custom sliders. Use with `Carousel` or any custom slider implementation.
```tsx
<SliderArrow onClick={prev} isReversed /> {/* left arrow */}
<SliderArrow onClick={next} />           {/* right arrow */}
```

---

## Motion Primitives

### `NumberTicker`
Animated number count-up.
```tsx
<NumberTicker value={1247} duration={1.5} />
```

### `TypingAnimation`
Typewriter text animation.
```tsx
<TypingAnimation text="Hello, world!" speed={50} />
```

### `Particles`
Background particle canvas effect.
```tsx
<Particles count={80} color="pr_purple" className="absolute inset-0" />
```

---

## Hooks

| Hook | Use for |
|------|---------|
| `useWindowSize()` | Responsive logic based on window dimensions |
| `useDeviceType()` | `'mobile'` \| `'tablet'` \| `'desktop'` |
| `useIntersectionObserver(ref, opts)` | Detect when element enters viewport |
| `useOutsideClick(ref, handler)` | Close panels on outside click |
| `useModals()` | Track open modal state |
| `useStatusColor(status)` | Map status string → design-token color |
| `useThemeColors()` | Access current theme color values |
| `useRovingTabindex(items)` | Keyboard arrow-key navigation in lists |
| `useTypeahead(items)` | Typeahead keyboard search in lists |
| `useTheme()` | Read/set current theme |
| `useLocale()` | Read/set locale and text direction |

---

## Utilities

| Function | Use for |
|----------|---------|
| `formatDate(date, opts)` | Consistent date formatting |
| `formatRelativeTime(date)` | "2 hours ago" |
| `formatAbsoluteTime(date)` | "Jun 3, 2026 at 14:30" |
| `formatSalary(amount, currency)` | Salary display with currency |
| `getCurrencySymbol(code)` | `'USD'` → `'$'` |
| `validateEmail(str)` | Email format check |
| `validatePhone(str)` | Phone format check |
| `validateLink(str)` | URL format check |
| `detectCountry()` | Detect user country from timezone/language |
| `scrollToAnchor(id)` | Smooth scroll to element |
| `hideDocumentScroll(bool)` | Lock body scroll (modals) |
| `mergeRefs(...refs)` | Merge multiple React refs |
| `Portal` | Render children in document.body |

---

## Motion Presets

```tsx
import { fadeIn, slideUp, scaleIn, popIn, useMotionPreset } from '@sagtech-infra/ui';
// Use with framer-motion
<motion.div {...fadeIn()} />
<motion.div {...slideUp({ delay: 0.2 })} />
```

---

## Design Tokens

```ts
import { tokens } from '@sagtech-infra/ui';
tokens.colors.pr_purple  // '#...'
tokens.spacing['24px']   // '24px'
```

Token CSS variables available everywhere: `--color-pr_purple`, `--spacing-24px`, `--font-orbitron`, etc.

