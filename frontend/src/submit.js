import { useState } from 'react';
import { createPortal } from 'react-dom';
import { checkIsDAG } from './dagUtils';
import { useStore } from './useStore';

export const SubmitButton = () => {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async () => {
        if (nodes.length === 0) {
            alert('Number of nodes: 0\nNumber of edges: 0\nIs DAG: true');
            setResult({
                num_nodes: 0,
                num_edges: 0,
                is_dag: true,
                message: 'Your canvas is empty! Add nodes to get started.',
                isError: true
            });
            setIsOpen(true);
            return;
        }

        setIsLoading(true);
        try {
            // Prepare pipeline payload in standard FormData format
            const formData = new FormData();
            formData.append('pipeline', JSON.stringify({ 
                nodes: nodes.map(n => n.id), 
                edges: edges.map(e => ({ source: e.source, target: e.target })) 
            }));

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 4000);
            
            const response = await fetch(`${process.env.REACT_APP_API_URL}/pipelines/parse`, {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });
            clearTimeout(timeout);

            if (response.ok) {
                const data = await response.json();
                const num_nodes = data.num_nodes !== undefined ? data.num_nodes : nodes.length;
                const num_edges = data.num_edges !== undefined ? data.num_edges : edges.length;
                const is_dag = data.is_dag !== undefined ? data.is_dag : checkIsDAG(nodes, edges);

                alert(`Number of nodes: ${num_nodes}\nNumber of edges: ${num_edges}\nIs DAG: ${is_dag}`);

                setResult({
                    num_nodes,
                    num_edges,
                    is_dag,
                    source: 'Backend Server'
                });
            } else {
                throw new Error('Server returned non-200 response');
            }
        } catch (error) {
            console.warn('[Submit] Failed to reach backend, using local validation fallback:', error);
            const num_nodes = nodes.length;
            const num_edges = edges.length;
            const is_dag = checkIsDAG(nodes, edges);

            alert(`Number of nodes: ${num_nodes}\nNumber of edges: ${num_edges}\nIs DAG: ${is_dag}`);

            setResult({
                num_nodes,
                num_edges,
                is_dag,
                source: 'Local Client Validation'
            });
        } finally {
            setIsLoading(false);
            setIsOpen(true);
        }
    };

    return (
        <>
            <button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1E] border border-[#232329] hover:bg-[#232329] hover:border-[#383842] text-zinc-300 hover:text-white font-semibold text-[11px] rounded-lg shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none select-none flex-shrink-0"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-0.5 mr-1 h-3 w-3 text-zinc-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Verifying...
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-0.5 opacity-70">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Submit
                    </>
                )}
            </button>

            {/* Results Modal */}
            {isOpen && result && createPortal(
                <div className="fixed inset-0 bg-[#000000]/60 backdrop-blur-sm z-50 flex items-center justify-center transition-all p-3 sm:p-4">
                    <div className="bg-[#141416] border border-[#232329] rounded-2xl p-4 sm:p-6 w-[calc(100%-1.5rem)] sm:max-w-sm shadow-2xl flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in-95 duration-200 select-none">
                        
                        {/* Status Icon */}
                        {result.isError ? (
                            <div className="w-12 h-12 rounded-full bg-amber-500/5 border border-amber-500/20 flex items-center justify-center text-amber-400 text-lg">
                                ⚠️
                            </div>
                        ) : result.is_dag ? (
                            <div className="w-12 h-12 rounded-full bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg">
                                🛡️
                            </div>
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-rose-500/5 border border-rose-500/20 flex items-center justify-center text-rose-400 text-lg">
                                🔀
                            </div>
                        )}

                        {/* Title */}
                        <div>
                            <h3 className="text-base font-bold text-white leading-tight">
                                {result.isError ? 'Empty Pipeline' : result.is_dag ? 'Pipeline Verified' : 'Cycle Detected'}
                            </h3>
                            <p className="text-[10px] text-zinc-500 font-medium mt-1">
                                {result.isError ? 'Nothing to check' : `Validated via ${result.source}`}
                            </p>
                        </div>

                        {/* Message / Stats Grid */}
                        {result.message ? (
                            <p className="text-xs text-zinc-300 px-2">{result.message}</p>
                        ) : (
                            <div className="grid grid-cols-3 gap-2 w-full bg-[#0D0D10]/50 p-3 rounded-xl border border-[#232329] text-left font-mono text-[11px]">
                                <div className="flex flex-col">
                                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Nodes</span>
                                    <span className="text-xs font-bold text-zinc-200 mt-0.5">{result.num_nodes}</span>
                                </div>
                                <div className="flex flex-col border-l border-[#232329] pl-3">
                                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Edges</span>
                                    <span className="text-xs font-bold text-zinc-200 mt-0.5">{result.num_edges}</span>
                                </div>
                                <div className="flex flex-col border-l border-[#232329] pl-3">
                                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">DAG</span>
                                    <span className={`text-[11px] font-bold mt-0.5 ${result.is_dag ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {result.is_dag ? 'true' : 'false'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full py-2 bg-[#1A1A1E] hover:bg-[#232329] text-zinc-300 hover:text-white font-semibold rounded-lg text-xs transition-all active:scale-[0.98] border border-[#232329]"
                        >
                            Close Details
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

