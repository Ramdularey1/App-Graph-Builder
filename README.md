# App Graph Builder

Frontend intern take-home implementation for a responsive ReactFlow canvas.

## Setup

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run typecheck
npm run lint
npm run build
```

## Key Decisions

- Vite + React + strict TypeScript are used for the app foundation.
- ReactFlow (`@xyflow/react`) owns the canvas interactions: drag, select, delete, zoom, pan, fit view, nodes, and edges.
- TanStack Query fetches mock `/apps` and `/apps/:appId/graph` data from in-memory promise APIs with simulated latency.
- Zustand stores only non-server UI state: selected app, selected node, mobile panel visibility, active inspector tab, and the mock error toggle.
- shadcn/ui-style primitives are implemented locally with Radix UI where needed for tabs and slider.

## Features

- Top bar, left icon rail, right app/inspector panel, and dotted graph canvas.
- Responsive right panel drawer on small screens.
- Three-node graphs with two edges per mock app.
- Service node inspector with status badge, tabs, editable name/description, and synced slider/numeric input.
- Mock error toggle and refetch action for loading/error/cached query states.
- Bonus: add-node and fit-view controls.

## Known Limitations

- Mock API data is in-memory only; inspector edits persist in the current ReactFlow state but are not saved back to the mock API.
- The UI is aligned to the requested screenshot structure, but it is not intended to be pixel-perfect.
