// outputNode.js
// Output component defined declaratively via BaseNode config schema
// ------------------------------------------------------------------

import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

const config = {
  title: 'Output',
  handles: [
    { type: 'target', id: 'value', position: Position.Left },
  ],
  fields: [
    {
      type: 'text',
      name: 'outputName',
      label: 'Name',
      defaultValue: (id) => id.replace('customOutput-', 'output_'),
    },
    {
      type: 'select',
      name: 'outputType',
      label: 'Type',
      options: ['Text', 'Image'],
      defaultValue: 'Text',
    },
  ],
};

export const OutputNode = ({ id, data }) => (
  <BaseNode id={id} data={data} config={config} />
);
