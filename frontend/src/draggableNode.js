const defaultStyle = { border: 'border-[#232329] hover:border-[#383842]', bg: 'bg-[#18181C] hover:bg-[#1E1E24]', text: 'text-[#A1A1AA] hover:text-white' };

export const DraggableNode = ({ type, label }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };

    const style = defaultStyle;

    return (
      <div
        className={`flex items-center px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border ${style.border} ${style.bg} ${style.text} text-[10px] sm:text-[11px] font-medium cursor-grab select-none transition-all duration-150 hover:scale-[1.01] active:scale-[0.99] shadow-sm flex-shrink-0`}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        draggable
      >
        <span className="select-none">{label}</span>
      </div>
    );
  };

