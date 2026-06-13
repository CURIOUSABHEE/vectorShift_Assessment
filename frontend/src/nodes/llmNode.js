// llmNode.js
// LLM component defined declaratively via BaseNode config schema
// ---------------------------------------------------------------

import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

const getProviderDetails = (modelName) => {
  if (modelName.startsWith('claude')) {
    return { name: 'Anthropic (Claude)', grad: ['#F59E0B', '#D97706'] };
  }
  if (modelName.startsWith('gpt')) {
    return { name: 'OpenAI (GPT)', grad: ['#10A37F', '#0D8E6C'] };
  }
  if (modelName.startsWith('gemini')) {
    return { name: 'Google (Gemini)', grad: ['#3B82F6', '#8B5CF6'] };
  }
  if (modelName.startsWith('grok')) {
    return { name: 'xAI (Grok)', grad: ['#E2E8F0', '#1E293B'] };
  }
  if (modelName.startsWith('deepseek') || modelName.startsWith('glm') || modelName.startsWith('kimi')) {
    return { name: 'Chinese Labs', grad: ['#0052CC', '#36B37E'] };
  }
  return { name: 'AI Model', grad: ['#38BDF8', '#F472B6'] };
};

const ModelLogo = ({ grad }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C12 2 12.5 9.5 12.5 9.5C12.5 9.5 20 10 20 10C20 10 12.5 10.5 12.5 10.5C12.5 10.5 12 18 12 18C12 18 11.5 10.5 11.5 10.5C11.5 10.5 4 10 4 10C4 10 11.5 9.5 11.5 9.5C11.5 9.5 12 2 12 2Z" fill="url(#starGradDynamic)" />
    <defs>
      <linearGradient id="starGradDynamic" x1="4" y1="2" x2="20" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={grad[0]} />
        <stop offset="100%" stopColor={grad[1]} />
      </linearGradient>
    </defs>
  </svg>
);

const config = {
  title: 'AI Models',
  handles: [
    { type: 'target', id: 'system', position: Position.Left, style: { top: '25%' } },
    { type: 'target', id: 'prompt', position: Position.Left, style: { top: '75%' } },
    { type: 'source', id: 'output', position: Position.Right }
  ],
  style: { width: '210px' },
  fields: [
    {
      type: 'custom',
      name: 'modelBanner',
      render: (values) => {
        const provider = getProviderDetails(values.modelName || 'claude-opus-4.8');
        return (
          <div className="flex items-center gap-2 bg-[#1A1A1E] border border-[#232329] p-1.5 rounded-xl w-full justify-between shadow-sm">
            <div className="w-7 h-7 rounded-lg bg-[#0B0B0C] flex items-center justify-center border border-[#232329] flex-shrink-0">
              <ModelLogo grad={provider.grad} />
            </div>
            <span className="text-[9px] font-bold text-zinc-400 tracking-wider mr-auto pl-1">
              {provider.name}
            </span>
          </div>
        );
      }
    },
    {
      type: 'select',
      name: 'modelName',
      defaultValue: 'claude-opus-4.8',
      options: [
        {
          label: 'Anthropic (Claude)',
          options: [
            { value: 'claude-opus-4.8', label: 'Claude Opus 4.8' },
            { value: 'claude-opus-4.7', label: 'Claude Opus 4.7' },
            { value: 'claude-sonnet-4.6', label: 'Claude Sonnet 4.6' }
          ]
        },
        {
          label: 'OpenAI (GPT)',
          options: [
            { value: 'gpt-5.5', label: 'GPT-5.5' }
          ]
        },
        {
          label: 'Google (Gemini)',
          options: [
            { value: 'gemini-3.1-pro', label: 'Gemini 3.1 Pro' }
          ]
        },
        {
          label: 'xAI (Grok)',
          options: [
            { value: 'grok-4.3', label: 'Grok 4.3' }
          ]
        },
        {
          label: 'Chinese Labs',
          options: [
            { value: 'deepseek-v4', label: 'DeepSeek V4' },
            { value: 'glm-5', label: 'GLM-5 (Zhipu AI)' },
            { value: 'kimi-k2.5-claw', label: 'Kimi K2.5 / Kimi Claw' }
          ]
        }
      ]
    },
    {
      type: 'number',
      name: 'temperature',
      label: 'Temperature',
      defaultValue: 0.7,
    },
    {
      type: 'number',
      name: 'maxTokens',
      label: 'Max Tokens',
      defaultValue: 1024,
    },
    {
      type: 'textarea',
      name: 'systemPrompt',
      placeholder: 'You are a helpful assistant...',
    },
    {
      type: 'select',
      name: 'stream',
      label: 'Stream',
      options: ['Yes', 'No'],
      defaultValue: 'No',
    },
  ]
};

export const LLMNode = ({ id, data }) => (
  <BaseNode id={id} data={data} config={config} />
);
