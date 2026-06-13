# VectorShift Pipeline Builder

A visual pipeline builder with a React Flow frontend and FastAPI backend. Drag, connect, and validate directed acyclic graphs (DAGs).

## Architecture

```
front-assessment/
├── frontend/          # React 18 + React Flow + Zustand + Tailwind CSS
│   ├── src/
│   │   ├── nodes/     # Node components (all powered by BaseNode config pattern)
│   │   ├── useStore.js    # Single zustand store with named selectors
│   │   ├── ui.js          # Main canvas with React Flow + search overlay
│   │   ├── submit.js      # Pipeline submission + results modal
│   │   ├── dagUtils.js    # DAG validation via Kahn's algorithm
│   │   ├── draggableNode.js
│   │   └── toolbar.js
│   └── public/
├── backend/           # FastAPI server
│   └── main.py        # /pipelines/parse endpoint with DAG detection
└── README.md
```

All 9 node types (Input, LLM, Output, Text, Number, Merge, Delay, Filter, Note) share a single `BaseNode` abstraction — adding a new node is a config object, not a new component.

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn python-multipart
uvicorn main:app --reload
```

Runs on `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm start
```

Runs on `http://localhost:3000`.

### Production Build

```bash
cd frontend
npm run build
```

Serves optimized output from `frontend/build/`.

## How It Works

| Action | What Happens |
|---|---|
| Drag a node from toolbar | Node appears on canvas at drop position |
| Type `{{ variableName }}` in Text node | Left-side handle auto-creates per unique variable |
| Delete variable text | Corresponding handle is removed |
| Connect nodes via handles | Edge is drawn; color varies by source node type |
| Click Submit | POSTs `{ nodes, edges }` to `/pipelines/parse`; shows `num_nodes`, `num_edges`, `is_dag` |
| `Cmd+P` / `Ctrl+P` | Quick-search node palette |

## Node Config Pattern

Every node is defined as a declarative config object:

```js
const config = {
  title: 'My Node',
  handles: [{ type: 'source', id: 'output', position: Position.Right }],
  fields: [{ type: 'text', name: 'myField', label: 'Field', defaultValue: '' }],
};
export const MyNode = ({ id, data }) => <BaseNode id={id} data={data} config={config} />;
```

Built-in field types: `text`, `number`, `textarea`, `select`, `select-row`, `custom`.
