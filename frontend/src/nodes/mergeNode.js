// mergeNode.js
// Merge component defined declaratively via BaseNode config schema
// ------------------------------------------------------------------

import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

const StarIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-rose-500 flex-shrink-0">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const ScissorsIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-amber-500 flex-shrink-0">
    <circle cx="6" cy="6" r="3"></circle>
    <circle cx="6" cy="18" r="3"></circle>
    <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
    <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
    <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
  </svg>
);

const LightningIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-500 flex-shrink-0">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const VoiceIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-purple-500 flex-shrink-0">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
    <path d="M19 10v1a7 7 0 0 1-14 0v-1"></path>
    <line x1="12" y1="19" x2="12" y2="22"></line>
  </svg>
);

const MusicIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-sky-500 flex-shrink-0">
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
  </svg>
);

const config = {
  title: 'Settings',
  handles: [
    { type: 'target', id: 'input-a', position: Position.Left, style: { top: '35%' } },
    { type: 'target', id: 'input-b', position: Position.Left, style: { top: '65%' } },
    { type: 'source', id: 'output', position: Position.Right },
  ],
  style: { width: '235px' },
  headerRight: (
    <button className="text-zinc-500 hover:text-zinc-300 font-medium text-sm transition-colors">+</button>
  ),
  fields: [
    { type: 'select-row', name: 'mode', label: 'Mode', icon: StarIcon, options: ['Fun', 'Pro', 'Creative', 'Standard'], defaultValue: 'Fun', syncKey: 'settings' },
    { type: 'select-row', name: 'trim', label: 'Trim', icon: ScissorsIcon, options: ['Auto', 'Manual', 'Off'], defaultValue: 'Auto', syncKey: 'settings' },
    { type: 'select-row', name: 'think', label: 'Think', icon: LightningIcon, options: ['Fast', 'Deep', 'Precise'], defaultValue: 'Fast', syncKey: 'settings' },
    { type: 'select-row', name: 'voice', label: 'Voice', icon: VoiceIcon, options: ['Happy', 'Sad', 'Neutral', 'Excited'], defaultValue: 'Happy', syncKey: 'settings' },
    { type: 'select-row', name: 'music', label: 'Music', icon: MusicIcon, options: ['Piano', 'Guitar', 'Synth', 'None'], defaultValue: 'Piano', syncKey: 'settings' },
  ],
};

export const MergeNode = ({ id, data }) => (
  <BaseNode id={id} data={data} config={config} />
);
