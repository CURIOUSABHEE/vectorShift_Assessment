// NodeFields.js
// Handles rendering of form input fields inside node components
// --------------------------------------------------------------

const GrabHandle = (
  <div className="text-zinc-600 select-none flex flex-col gap-0.5 pl-1.5 cursor-grab">
    <div className="flex gap-0.5"><span className="w-0.5 h-0.5 rounded-full bg-zinc-600"/><span className="w-0.5 h-0.5 rounded-full bg-zinc-600"/></div>
    <div className="flex gap-0.5"><span className="w-0.5 h-0.5 rounded-full bg-zinc-600"/><span className="w-0.5 h-0.5 rounded-full bg-zinc-600"/></div>
    <div className="flex gap-0.5"><span className="w-0.5 h-0.5 rounded-full bg-zinc-600"/><span className="w-0.5 h-0.5 rounded-full bg-zinc-600"/></div>
  </div>
);

const renderSelectOptions = (options) => {
  return options.map((opt, i) => {
    if (typeof opt === 'object' && opt.label && Array.isArray(opt.options)) {
      return (
        <optgroup key={i} label={opt.label} className="bg-[#141416] text-zinc-500 font-bold font-sans">
          {opt.options.map(subOpt => (
            <option 
              key={typeof subOpt === 'object' ? subOpt.value : subOpt} 
              value={typeof subOpt === 'object' ? subOpt.value : subOpt}
              className="bg-[#141416] text-zinc-200 font-mono"
            >
              {typeof subOpt === 'object' ? subOpt.label : subOpt}
            </option>
          ))}
        </optgroup>
      );
    }
    return (
      <option 
        key={typeof opt === 'object' ? opt.value : opt} 
        value={typeof opt === 'object' ? opt.value : opt}
        className="bg-[#141416]"
      >
        {typeof opt === 'object' ? opt.label : opt}
      </option>
    );
  });
};

export const NodeFields = ({ fields, values, id, onChange, textareaRef }) => {
  return fields.map((field) => {
    const val = values[field.name];

    if (field.type === 'custom' && typeof field.render === 'function') {
      return <div key={field.name}>{field.render(values, id, (newVal) => onChange(field.name, newVal))}</div>;
    }

    if (field.type === 'select-row') {
      return (
        <div key={field.name} className="flex items-center bg-[#1A1A1E]/80 border border-[#232329] px-2.5 py-1.5 rounded-lg w-full justify-between gap-1 shadow-sm">
          <div className="flex items-center gap-2 flex-grow min-w-0">
            {field.icon}
            <span className="text-[10px] text-zinc-400 font-medium select-none w-10 truncate">{field.label}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <select 
              value={val} 
              onChange={(e) => onChange(field.name, e.target.value)} 
              className="w-[85px] bg-[#0B0B0C] border border-[#232329] rounded px-1.5 py-0.5 text-[10px] text-zinc-300 focus:outline-none focus:border-zinc-700 cursor-pointer text-left font-sans"
            >
              {field.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            {GrabHandle}
          </div>
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.name} className="flex flex-col gap-2 w-full h-full">
          <textarea
            ref={textareaRef}
            value={val}
            onChange={(e) => onChange(field.name, e.target.value)}
            className="w-full min-h-[90px] max-h-[240px] p-2.5 text-[11px] leading-relaxed border border-[#232329] rounded-lg bg-[#0B0B0C] text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-zinc-750 transition-colors resize-none font-mono caret-fuchsia-500 overflow-y-auto"
            placeholder={field.placeholder}
          />
        </div>
      );
    }

    if (field.type === 'select') {
      return (
        <label key={field.name} className="flex flex-col gap-1 w-full">
          {field.label && <span className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider font-mono">{field.label}</span>}
          <div className="relative w-full">
            <select 
              value={val} 
              onChange={(e) => onChange(field.name, e.target.value)}
              className="w-full pl-3 pr-8 py-2 text-[10px] border border-[#232329] rounded-lg bg-[#0B0B0C] text-zinc-200 focus:outline-none focus:border-zinc-650 focus:ring-1 focus:ring-zinc-650 transition-colors cursor-pointer font-medium font-mono appearance-none"
            >
              {renderSelectOptions(field.options)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </label>
      );
    }

    if (field.type === 'text' || field.type === 'number') {
      return (
        <label key={field.name} className="flex flex-col gap-1 w-full">
          <span className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider font-mono">{field.label}</span>
          <input 
            type={field.type} 
            value={val} 
            onChange={(e) => {
              const newVal = field.type === 'number' ? Number(e.target.value) : e.target.value;
              onChange(field.name, newVal);
            }} 
            className="w-full px-2.5 py-1.5 text-xs border border-[#232329] rounded-lg bg-[#0B0B0C] text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-5 transition-all" 
          />
        </label>
      );
    }

    return null;
  });
};
