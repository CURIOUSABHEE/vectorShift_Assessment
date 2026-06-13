// useStore.js
// Zustand store exposing named selectors for component state access
// ------------------------------------------------------------------

import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},
  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },
  addNode: (node) => {
    set({
      nodes: [...get().nodes, node]
    });
  },
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    const sourceNode = get().nodes.find(n => n.id === connection.source);
    let strokeColor = '#52525b';
    if (sourceNode?.type === 'text') strokeColor = '#FBBF24';
    else if (sourceNode?.type === 'note') strokeColor = '#38BDF8';

    set({
      edges: addEdge({
        ...connection,
        type: 'default',
        style: { stroke: strokeColor, strokeWidth: 1.5 }
      }, get().edges),
    });
  },
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, [fieldName]: fieldValue }
          };
        }
        return node;
      }),
    });
  },
}));

// Clean, named selectors
export const useNodes = () => useStore((state) => state.nodes);
export const useEdges = () => useStore((state) => state.edges);
export const useGetNodeID = () => useStore((state) => state.getNodeID);
export const useAddNode = () => useStore((state) => state.addNode);
export const useOnNodesChange = () => useStore((state) => state.onNodesChange);
export const useOnEdgesChange = () => useStore((state) => state.onEdgesChange);
export const useOnConnect = () => useStore((state) => state.onConnect);
export const useUpdateNodeField = () => useStore((state) => state.updateNodeField);
