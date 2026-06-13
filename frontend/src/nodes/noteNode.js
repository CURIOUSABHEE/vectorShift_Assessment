// noteNode.js
// Note component defined declaratively via BaseNode config schema
// ----------------------------------------------------------------

import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

const config = {
  title: 'Note',
  handles: [
    { type: 'source', id: 'output', position: Position.Right }
  ],
  glow: true,
  fields: [
    {
      type: 'textarea',
      name: 'content',
      placeholder: 'Write your note here...',
    },
  ]
};

export const NoteNode = ({ id, data }) => (
  <BaseNode id={id} data={data} config={config} />
);
