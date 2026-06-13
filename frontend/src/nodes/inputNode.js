// inputNode.js
// Input component defined declaratively via BaseNode config schema
// ------------------------------------------------------------------

import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

const config = {
  title: 'Input',
  handles: [
    { type: 'source', id: 'value', position: Position.Right },
  ],
  fields: [
    {
      type: 'text',
      name: 'inputName',
      label: 'Name',
      defaultValue: (id) => id.replace('customInput-', 'input_'),
    },
    {
      type: 'select',
      name: 'inputType',
      label: 'Type',
      options: ['Text', 'Number', 'File', 'Image', 'Boolean'],
      defaultValue: 'Text',
    },
    {
      type: 'select',
      name: 'required',
      label: 'Required',
      options: ['Yes', 'No'],
      defaultValue: 'No',
    },
    {
      type: 'textarea',
      name: 'description',
      placeholder: 'Describe this input...',
    },
  ],
};

export const InputNode = ({ id, data }) => (
  <BaseNode id={id} data={data} config={config} />
);
