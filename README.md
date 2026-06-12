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

## How It Works

### App switching

- Use the application list to switch between `supertokens-golang`, `supertokens-java`, `supertokens-python`, `supertokens-ruby`, and `supertokens-go`.
- Changing the selected app updates Zustand state and causes TanStack Query to fetch `/apps/:appId/graph`.
- Each app has its own mocked graph data with nodes and edges.

### Connecting nodes

- Click `Add node` to create a new service node.
- Each node has two visible connection handles:
  - Blue dot on the right side: outgoing/source handle.
  - Green dot on the left side: incoming/target handle.
- Drag from a blue dot on one node to a green dot on another node to create a connection.
- ReactFlow calls `onConnect`, and the app adds the new edge with `addEdge`.

### Selecting and deleting nodes

- Click a node to select it.
- The selected node opens the inspector drawer/panel.
- Delete a selected node in either way:
  - Press `Delete` or `Backspace`.
  - Click `Delete selected node` in the inspector.
- Deleting a node also removes any edges connected to that node.

### Editing node data

- Select a node to open the Service Node inspector.
- In `Config`, edit the node name and description.
- In `Runtime`, change the traffic value with either the slider or numeric input.
- Slider and numeric input stay synced and write changes back to the selected ReactFlow node data.
- Created nodes, deleted nodes, moved nodes, new connections, and inspector edits are persisted per app in `localStorage`, so they survive browser refreshes.

### Mock API and error state

- `/apps` returns the application list.
- `/apps/:appId/graph` returns the graph for the selected app.
- Mock calls use simulated latency.
- Use the mock error toggle in the top bar to verify loading/error UI.
- Use the refetch action to invalidate TanStack Query cache and reload data.

## Known Limitations

- Mock API data is still local/in-memory; user graph changes are persisted in browser `localStorage`, not sent to a backend.
- The UI is aligned to the requested screenshot structure, but it is not intended to be pixel-perfect.
