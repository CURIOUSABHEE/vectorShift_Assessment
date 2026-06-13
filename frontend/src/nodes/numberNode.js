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
    {
      type: 'number',
      name: 'min',
      label: 'Min',
      defaultValue: 0,
    },
    {
      type: 'number',
      name: 'max',
      label: 'Max',
      defaultValue: 100,
    },
    {
      type: 'number',
      name: 'step',
      label: 'Step',
      defaultValue: 1,
    },
    {
      type: 'text',
      name: 'label',
      label: 'Label',
      defaultValue: 'value',
      placeholder: 'Variable name',
    },
    {
      type: 'select',
      name: 'format',
      label: 'Format',
      options: ['Integer', 'Float', 'Percentage', 'Currency'],
      defaultValue: 'Integer',
    },
  ],
};

export const NumberNode = ({ id, data }) => (
  <BaseNode id={id} data={data} config={config} />
);
