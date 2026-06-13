// delayNode.js
// Delay component defined declaratively via BaseNode config schema
// ------------------------------------------------------------------

import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

const config = {
  title: 'Delay',
  handles: [
    { type: 'target', id: 'input', position: Position.Left },
    { type: 'source', id: 'output', position: Position.Right },
  ],
  fields: [
    {
      type: 'number',
      name: 'duration',
      label: 'Duration (ms)',
      defaultValue: 1000,
    },
  ],
};

export const DelayNode = ({ id, data }) => (
  <BaseNode id={id} data={data} config={config} />
);
