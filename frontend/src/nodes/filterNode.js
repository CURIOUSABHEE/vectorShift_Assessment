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
      type: 'text',
      name: 'filterField',
      placeholder: 'Field to evaluate e.g. score',
    },
    {
      type: 'select',
      name: 'operator',
      label: 'Condition',
      options: ['equals', 'not equals', 'greater than', 'less than', 'contains', 'not contains', 'is empty', 'is not empty'],
      defaultValue: 'equals',
    },
    {
      type: 'text',
      name: 'threshold',
      placeholder: 'Value to compare against',
    },
    {
      type: 'select',
      name: 'caseSensitive',
      label: 'Case Sensitive',
      options: ['Yes', 'No'],
      defaultValue: 'No',
    },
    {
      type: 'select',
      name: 'onEmpty',
      label: 'On Empty',
      options: ['Pass', 'Fail', 'Skip'],
      defaultValue: 'Fail',
    },
  ],
};

export const FilterNode = ({ id, data }) => (
  <BaseNode id={id} data={data} config={config} />
);
