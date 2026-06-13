import { DraggableNode } from './draggableNode';
import { SubmitButton } from './submit';

export const PipelineToolbar = () => {
    return (
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 bg-[#141416]/90 backdrop-blur-md border border-[#232329] px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl flex items-center gap-1 sm:gap-2 shadow-2xl z-10 select-none w-[calc(100%-0.75rem)] sm:max-w-[95%] overflow-x-auto no-scrollbar">
            <DraggableNode type='customInput' label='Input' />
            <DraggableNode type='llm' label='LLM' />
            <DraggableNode type='customOutput' label='Output' />
            <DraggableNode type='text' label='Text' />
            <DraggableNode type='number' label='Number' />
            <DraggableNode type='merge' label='Merge' />
            <DraggableNode type='delay' label='Delay' />
            <DraggableNode type='filter' label='Filter' />
            <DraggableNode type='note' label='Note' />
            
            <div className="w-[1px] h-4 sm:h-5 bg-[#232329] mx-0.5 sm:mx-1 flex-shrink-0" />
            
            <SubmitButton />
        </div>
    );
};


