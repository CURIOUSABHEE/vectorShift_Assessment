// noteNode.js
// Note component defined declaratively via BaseNode config schema
// ----------------------------------------------------------------

import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

const config = {
  title: 'References',
  handles: [
    { type: 'source', id: 'output', position: Position.Right }
  ],
  glow: true,
  headerRight: <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />,
  fields: [
    {
      type: 'text',
      name: 'title',
      label: 'Title',
      defaultValue: 'Reference',
      placeholder: 'Note title',
    },
    {
      type: 'textarea',
      name: 'content',
      placeholder: 'Add reference notes here...',
    },
    {
      type: 'custom',
      name: 'preview',
      render: () => (
        <div className="relative w-full aspect-square bg-[#0B0B0C] border border-[#232329] rounded-lg overflow-hidden flex items-center justify-center p-2">
          <img 
            src="/character_preview.png" 
            alt="Reference Preview" 
            className="max-h-full max-w-full object-contain rounded"
            draggable={false}
          />
          <button 
            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/70 hover:bg-black/90 border border-[#232329] flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer shadow-md"
            title="Remove reference"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )
    },
    {
      type: 'text',
      name: 'tags',
      placeholder: 'tag1, tag2, tag3',
    },
    {
      type: 'select',
      name: 'priority',
      label: 'Priority',
      options: ['Low', 'Medium', 'High'],
      defaultValue: 'Medium',
    },
  ]
};

export const NoteNode = ({ id, data }) => (
  <BaseNode id={id} data={data} config={config} />
);
