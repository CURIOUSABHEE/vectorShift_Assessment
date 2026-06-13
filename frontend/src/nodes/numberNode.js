// numberNode.js
// Number component defined declaratively via BaseNode config schema
// ------------------------------------------------------------------

import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

const config = {
  title: 'Number',
  handles: [
    { type: 'source', id: 'value', position: Position.Right },
  ],
  fields: [
    {
      type: 'number',
      name: 'value',
      label: 'Value',
      defaultValue: 0,
    },
  ],
};

export const NumberNode = ({ id, data }) => (
  <BaseNode id={id} data={data} config={config} />
);
