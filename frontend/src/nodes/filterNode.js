// filterNode.js
// Filter component defined declaratively via BaseNode config schema
// ------------------------------------------------------------------

import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

const config = {
  title: 'Filter',
  handles: [
    { type: 'target', id: 'input', position: Position.Left },
    { type: 'source', id: 'pass', position: Position.Right, style: { top: '25%' } },
    { type: 'source', id: 'fail', position: Position.Right, style: { top: '75%' } },
  ],
  fields: [
    {
      type: 'select',
      name: 'operator',
      label: 'Condition',
      options: ['equals', 'gt', 'lt', 'contains', 'not empty'],
      defaultValue: 'equals',
    },
    {
      type: 'text',
      name: 'threshold',
      label: 'Value',
      defaultValue: '',
    },
  ],
};

export const FilterNode = ({ id, data }) => (
  <BaseNode id={id} data={data} config={config} />
);
