import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';

function App() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0D0D10] text-[#E4E4E7] flex flex-col font-sans select-none relative">
      <div className="flex-grow w-full h-full relative">
        <PipelineUI />
        <PipelineToolbar />
      </div>
    </div>
  );
}

export default App;
