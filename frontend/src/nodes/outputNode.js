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
      options: ['Text', 'Image', 'File', 'JSON', 'Markdown'],
      defaultValue: 'Text',
    },
    {
      type: 'select',
      name: 'format',
      label: 'Format',
      options: ['Raw', 'Pretty Print', 'Summarized'],
      defaultValue: 'Raw',
    },
    {
      type: 'select',
      name: 'saveToMemory',
      label: 'Save to Memory',
      options: ['Yes', 'No'],
      defaultValue: 'No',
    },
  ],
};

export const OutputNode = ({ id, data }) => (
  <BaseNode id={id} data={data} config={config} />
);
