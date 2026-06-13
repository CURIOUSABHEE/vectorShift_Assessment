// textNode.js
// Text component defined declaratively via BaseNode config schema
// ----------------------------------------------------------------

import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

const config = {
  title: 'Ideas',
  handles: [
    { type: 'source', id: 'output', position: Position.Right },
  ],
  hasVariables: true,
  variableFieldName: 'text',
  autoWidth: true,
  headerRight: (
    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-[#2E2E38] bg-[#1C1C21] text-zinc-400">
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    </div>
  ),
  fields: [
    {
      type: 'textarea',
      name: 'text',
      defaultValue: '{{input}}',
      autoResize: true,
      placeholder: 'Describe your ideas...',
    },
  ],
};

export const TextNode = ({ id, data }) => (
  <BaseNode id={id} data={data} config={config} />
);
