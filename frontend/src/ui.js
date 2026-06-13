// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ReactFlow, { Controls, Background, MiniMap, MarkerType } from 'reactflow';
import { useStore } from './useStore';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { NumberNode } from './nodes/numberNode';
import { MergeNode } from './nodes/mergeNode';
import { DelayNode } from './nodes/delayNode';
import { FilterNode } from './nodes/filterNode';
import { NoteNode } from './nodes/noteNode';

import 'reactflow/dist/style.css';

const gridSize = 24;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  number: NumberNode,
  merge: MergeNode,
  delay: DelayNode,
  filter: FilterNode,
  note: NoteNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchError, setSearchError] = useState('');

    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(selector, shallow);

    const AVAILABLE_NODES = [
      { type: 'customInput', label: 'Input' },
      { type: 'llm', label: 'LLM' },
      { type: 'customOutput', label: 'Output' },
      { type: 'text', label: 'Text' },
      { type: 'number', label: 'Number' },
      { type: 'merge', label: 'Merge' },
      { type: 'delay', label: 'Delay' },
      { type: 'filter', label: 'Filter' },
      { type: 'note', label: 'Note' },
    ];

    // Global Key Listener for Cmd+P (Mac) or Ctrl+P
    useEffect(() => {
      const handleKeyDown = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
          e.preventDefault();
          setShowSearch((prev) => {
            if (!prev) {
              setSearchQuery('');
              setSearchError('');
            }
            return !prev;
          });
        }
        if (e.key === 'Escape') {
          setShowSearch(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const handleSearchCreate = (nodeType, nodeLabel) => {
      const rect = reactFlowWrapper.current?.getBoundingClientRect();
      let position = { x: 250, y: 250 };
      if (reactFlowInstance && rect) {
        position = reactFlowInstance.project({
          x: rect.width / 2 - 100,
          y: rect.height / 2 - 50,
        });
      }
      
      // Random offset to avoid exact stacking
      position.x += Math.random() * 40 - 20;
      position.y += Math.random() * 40 - 20;

      const nodeID = getNodeID(nodeType);
      const newNode = {
        id: nodeID,
        type: nodeType,
        position,
        data: getInitNodeData(nodeID, nodeType),
      };

      addNode(newNode);
      setShowSearch(false);
      setSearchQuery('');
      setSearchError('');
    };

    const handleSearchSubmit = (e) => {
      e.preventDefault();
      const query = searchQuery.trim().toLowerCase();
      if (!query) return;

      const exactMatch = AVAILABLE_NODES.find(n => n.label.toLowerCase() === query);
      const filtered = AVAILABLE_NODES.filter(n => n.label.toLowerCase().includes(query));

      const match = exactMatch || (filtered.length > 0 ? filtered[0] : null);

      if (match) {
        handleSearchCreate(match.type, match.label);
      } else {
        setSearchError('No such node present yet');
      }
    };

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance, addNode, getNodeID]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
        <div ref={reactFlowWrapper} className="w-full h-full relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapToGrid={true}
                snapGrid={[12, 12]}
                connectionRadius={30}
                connectionLineType="default"
                connectionLineStyle={{ stroke: '#818cf8', strokeWidth: 2 }}
                defaultEdgeOptions={{
                  type: 'default',
                  animated: true,
                  style: { stroke: '#6366f1', strokeWidth: 2 },
                  markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: '#6366f1'
                  }
                }}
            >
                <Background variant="cross" color="#1E1E24" gap={gridSize} size={1} />
                <Controls className="bg-[#141416] border border-[#232329] text-zinc-400 rounded-lg shadow-lg" />
                <MiniMap 
                  nodeStrokeColor={() => '#232329'}
                  nodeColor={() => '#1a1a1e'}
                  maskColor="rgba(0, 0, 0, 0.7)"
                  style={{
                    backgroundColor: '#141416',
                    border: '1px solid #232329',
                    borderRadius: '8px'
                  }}
                />
            </ReactFlow>

            {/* Command Palette Search Overlay */}
            {showSearch && createPortal(
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-28 p-4"
                onClick={() => setShowSearch(false)}
              >
                <div 
                  className="bg-[#141416] border border-[#232329] rounded-2xl w-full max-w-sm p-4 shadow-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-12 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-[#232329] pb-2 mb-1">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">Create Node</span>
                    <span className="text-[9px] bg-[#232329] text-zinc-400 px-1.5 py-0.5 rounded font-mono">ESC to close</span>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSearchSubmit} className="relative w-full">
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSearchError(''); // Clear error on typing
                      }}
                      placeholder="Search node types... (e.g. LLM, Text)"
                      className="w-full pl-8 pr-4 py-2 text-xs border border-[#232329] rounded-lg bg-[#0B0B0C] text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all font-mono"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-zinc-650">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </div>
                  </form>

                  {/* Error Message */}
                  {searchError && (
                    <div className="text-rose-400 text-[10px] font-semibold font-mono bg-rose-950/20 border border-rose-900/30 px-3 py-2 rounded-lg">
                      ⚠️ {searchError}
                    </div>
                  )}

                  {/* Matches List */}
                  <div className="flex flex-col gap-0.5 max-h-52 overflow-y-auto no-scrollbar mt-1">
                    {AVAILABLE_NODES.filter(n => n.label.toLowerCase().includes(searchQuery.trim().toLowerCase())).map((n) => (
                      <button
                        key={n.type}
                        onClick={() => handleSearchCreate(n.type, n.label)}
                        className="group flex items-center justify-between px-3 py-2 rounded-lg text-left text-zinc-400 hover:text-white hover:bg-[#1C1C21] border border-transparent hover:border-[#232329] transition-all font-mono text-[11px]"
                      >
                        <span>{n.label}</span>
                        <span className="text-[9px] text-zinc-600 group-hover:text-zinc-400 transition-colors">Click to add ↵</span>
                      </button>
                    ))}
                    {AVAILABLE_NODES.filter(n => n.label.toLowerCase().includes(searchQuery.trim().toLowerCase())).length === 0 && !searchError && (
                      <div className="text-zinc-650 text-center py-4 text-[10px] font-mono">
                        No matching nodes found
                      </div>
                    )}
                  </div>
                </div>
              </div>,
              document.body
            )}
        </div>
    )
}
