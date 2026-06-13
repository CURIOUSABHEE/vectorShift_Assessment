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
      label: 'Duration',
      defaultValue: 1000,
    },
    {
      type: 'select',
      name: 'unit',
      label: 'Unit',
      options: ['ms', 'seconds', 'minutes'],
      defaultValue: 'ms',
    },
    {
      type: 'select',
      name: 'mode',
      label: 'Mode',
      options: ['Fixed', 'Random'],
      defaultValue: 'Fixed',
    },
    {
      type: 'custom',
      name: 'randomMin',
      render: (values, id, setRandomMin) => values.mode === 'Random'
        ? (
          <label className="flex flex-col gap-1 w-full">
            <span className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider font-mono">Random Min</span>
            <input
              type="number"
              value={values.randomMin ?? 500}
              onChange={(e) => setRandomMin(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs border border-[#232329] rounded-lg bg-[#0B0B0C] text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-5 transition-all"
            />
          </label>
        )
        : null,
    },
    {
      type: 'select',
      name: 'retryOnFail',
      label: 'Retry on Fail',
      options: ['Yes', 'No'],
      defaultValue: 'No',
    },
  ],
};

export const DelayNode = ({ id, data }) => (
  <BaseNode id={id} data={data} config={config} />
);
