import { DraggableNode } from './draggableNode';
import { SubmitButton } from './submit';

export const PipelineToolbar = () => {
    return (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-[#141416]/90 backdrop-blur-md border border-[#232329] px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-2xl z-10 select-none max-w-[95%] overflow-x-auto no-scrollbar">
            <DraggableNode type='customInput' label='Input' />
            <DraggableNode type='llm' label='LLM' />
            <DraggableNode type='customOutput' label='Output' />
            <DraggableNode type='text' label='Text' />
            <DraggableNode type='number' label='Number' />
            <DraggableNode type='merge' label='Merge' />
            <DraggableNode type='delay' label='Delay' />
            <DraggableNode type='filter' label='Filter' />
            <DraggableNode type='note' label='Note' />
            
            <div className="w-[1px] h-5 bg-[#232329] mx-1 flex-shrink-0" />
            
            <SubmitButton />
        </div>
    );
};


