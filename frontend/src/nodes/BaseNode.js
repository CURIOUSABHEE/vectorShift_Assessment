// BaseNode.js
// General-purpose abstract node component that renders node UI dynamically based on a config schema
// --------------------------------------------------------------------------------------------------

import { useState, useEffect, useMemo, useRef } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { useOnNodesChange, useUpdateNodeField, useStore } from '../useStore';
import { NodeFields } from './NodeFields';

export const BaseNode = ({ id, data, config }) => {
  const onNodesChange = useOnNodesChange();
  const updateNodeField = useUpdateNodeField();
  const textareaRef = useRef(null);

  const [values, setValues] = useState(() => {
    const initial = {};
    config.fields?.forEach(field => {
      let val;
      if (field.syncKey) {
        val = data?.[field.syncKey]?.[field.name];
      } else {
        val = data?.[field.name];
      }
      if (val === undefined) {
        val = typeof field.defaultValue === 'function' 
          ? field.defaultValue(id) 
          : field.defaultValue;
      }
      initial[field.name] = val;
    });
    return initial;
  });

  const onChange = (name, val) => {
    setValues(prev => ({ ...prev, [name]: val }));
  };

  // Sync state to the store (debounced for inputs, immediate for selects)
  useEffect(() => {
    const timers = [];
    config.fields?.forEach(field => {
      const val = values[field.name];
      const isImmediate = field.type === 'select' || field.type === 'select-row' || field.immediate;
      
      const performUpdate = () => {
        if (field.syncKey) {
          const currentGroup = data?.[field.syncKey] || {};
          if (currentGroup[field.name] !== val) {
            updateNodeField(id, field.syncKey, { ...currentGroup, [field.name]: val });
          }
        } else {
          if (data?.[field.name] !== val) {
            updateNodeField(id, field.name, val);
          }
        }
      };

      if (isImmediate) {
        performUpdate();
      } else {
        const timer = setTimeout(performUpdate, 250);
        timers.push(timer);
      }
    });
    return () => timers.forEach(clearTimeout);
  }, [values, id, data, config.fields, updateNodeField]);

  // Reverse sync: pull external store updates into local state
  useEffect(() => {
    setValues(prev => {
      const next = { ...prev };
      let changed = false;
      config.fields?.forEach(field => {
        const storeValue = field.syncKey ? data?.[field.syncKey]?.[field.name] : data?.[field.name];
        if (storeValue !== undefined && prev[field.name] !== storeValue) {
          next[field.name] = storeValue;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [data, config.fields]);

  // Height auto-resize logic for textareas
  useEffect(() => {
    config.fields?.forEach(field => {
      if (field.type === 'textarea' && field.autoResize && textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    });
  }, [values, config.fields]);

  // Variable detection (e.g. {{variableName}})
  const variables = useMemo(() => {
    if (!config.hasVariables) return [];
    const textValue = values[config.variableFieldName || 'text'] || '';
    const varRegex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const found = [];
    let match;
    while ((match = varRegex.exec(textValue)) !== null) {
      const varName = match[1];
      if (!found.includes(varName)) {
        found.push(varName);
      }
    }
    return found;
  }, [values, config.hasVariables, config.variableFieldName]);

  // Prune orphan edges when variables are removed
  const { setEdges } = useReactFlow();
  const prevVars = useRef([]);
  useEffect(() => {
    if (!config.hasVariables) return;
    const removed = prevVars.current.filter(v => !variables.includes(v));
    prevVars.current = variables;
    if (removed.length === 0) return;
    setEdges((currentEdges) =>
      currentEdges.filter((edge) => {
        const handleId = edge.target === id ? edge.targetHandle
                        : edge.source === id ? edge.sourceHandle : null;
        if (!handleId) return true;
        return !removed.some(v => handleId === `${id}-${v}`);
      })
    );
  }, [variables, id, config.hasVariables, setEdges]);

  // Auto-create Input nodes for {{ variable }} handles
  const prevAutoVarsRef = useRef([]);
  useEffect(() => {
    if (!config.hasVariables) return;

    const currentVars = variables;
    const prevVars = prevAutoVarsRef.current;
    prevAutoVarsRef.current = currentVars;

    const removedVars = prevVars.filter(v => !currentVars.includes(v));
    const addedVars = currentVars.filter(v => !prevVars.includes(v));

    if (removedVars.length > 0) {
      const s = useStore.getState();
      for (const varName of removedVars) {
        s.onNodesChange([{ type: 'remove', id: `input-auto-${varName}` }]);
        s.onEdgesChange([{ type: 'remove', id: `edge-auto-${varName}` }]);
      }
    }

    if (addedVars.length > 0) {
      const s = useStore.getState();
      const textNode = s.nodes.find(n => n.id === id);
      const textPos = textNode?.position || { x: 400, y: 250 };
      const existingAutoCount = s.nodes.filter(n => n.data?.isAutoCreated).length;
      let createdCount = 0;

      for (const varName of addedVars) {
        const sn = useStore.getState();
        if (sn.nodes.find(n => n.id === `input-auto-${varName}`)) continue;

        const yOffset = (existingAutoCount + createdCount) * 120;
        createdCount++;

        sn.addNode({
          id: `input-auto-${varName}`,
          type: 'customInput',
          position: { x: textPos.x - 250, y: textPos.y + yOffset },
          data: { inputName: varName, inputType: 'Text', isAutoCreated: true },
        });

        sn.onConnect({
          source: `input-auto-${varName}`,
          sourceHandle: `input-auto-${varName}-value`,
          target: id,
          targetHandle: `${id}-${varName}`,
        });
      }
    }
  }, [variables, id, config.hasVariables]);

  // Dynamic handles (including variables mapped to left target handles)
  const dynamicHandles = useMemo(() => {
    const list = [...(config.handles || [])];
    if (config.hasVariables) {
      variables.forEach((varName, idx) => {
        const total = variables.length;
        const topOffset = `${(idx + 1) * (100 / (total + 1))}%`;
        list.push({
          type: 'target',
          id: `${id}-${varName}`,
          position: Position.Left,
          style: { top: topOffset }
        });
      });
    }
    return list;
  }, [id, variables, config.handles, config.hasVariables]);

  // Width auto-resize logic
  const nodeStyle = useMemo(() => {
    let style = { ...config.style };
    if (config.autoWidth) {
      const textValue = values[config.variableFieldName || 'text'] || '';
      const lines = textValue.split('\n');
      const longestLineLen = lines.reduce((max, line) => Math.max(max, line.length), 0);
      const calculatedWidth = Math.min(Math.max(longestLineLen * 7.5 + 90, 240), 450);
      style.width = `${calculatedWidth}px`;
    }
    return style;
  }, [values, config.style, config.autoWidth, config.variableFieldName]);

  const handleDelete = () => {
    onNodesChange([{ id, type: 'remove' }]);
  };

  const getHandleStyle = (type, handleData = {}) => {
    const bg = type === 'target' ? '#38BDF8' : '#FBBF24';
    return {
      backgroundColor: bg,
      border: 'none',
      width: '8px',
      height: '8px',
      ...handleData,
    };
  };

  const glowClass = config.glow 
    ? 'ring-1 ring-[#06B6D4]/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] border-[#06B6D4]/30' 
    : 'border-[#232329] hover:border-[#383842]';

  return (
    <div 
      className={`group min-w-[220px] bg-[#141416] border rounded-xl text-xs shadow-xl transition-all duration-150 focus-within:border-zinc-500/50 select-none ${glowClass} ${config.className || ''}`}
      style={nodeStyle}
    >
      {/* Node Header */}
      {config.title && (
        <div className="relative flex items-center px-3 py-2 bg-[#1A1A1E] rounded-t-xl border-b border-[#232329] h-8">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest font-mono">
            {config.title}
          </span>
          <div className="ml-auto flex items-center gap-2">
            {config.headerRight ? (
              config.headerRight
            ) : (
              <button
                onClick={handleDelete}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-white/5 text-zinc-500 hover:text-rose-400 transition-all duration-150"
                title="Delete node"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="px-3.5 py-3 flex flex-col gap-2 text-zinc-300">
        <NodeFields 
          fields={config.fields || []} 
          values={values} 
          id={id} 
          onChange={onChange} 
          textareaRef={textareaRef} 
        />
      </div>

      {/* Footer Dots */}
      <div className="flex justify-center pb-2 pt-0.5">
        <div className="flex gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
          <span className="w-1 h-1 rounded-full bg-zinc-500" />
          <span className="w-1 h-1 rounded-full bg-zinc-500" />
          <span className="w-1 h-1 rounded-full bg-zinc-500" />
        </div>
      </div>

      {/* Handles */}
      {dynamicHandles.map((handle) => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          id={handle.id.startsWith(id) ? handle.id : `${id}-${handle.id}`}
          style={getHandleStyle(handle.type, handle.style || {})}
        />
      ))}
    </div>
  );
};
