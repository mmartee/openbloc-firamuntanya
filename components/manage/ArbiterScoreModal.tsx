import React, { useState, useEffect, useCallback } from 'react';
import { mockSupabaseClient } from '../../services/supabaseService';
import { User, Block, BlockAttempt } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface ArbiterScoreModalProps {
    participant: User;
    onClose: () => void;
}

const ArbiterScoreModal: React.FC<ArbiterScoreModalProps> = ({ participant, onClose }) => {
    const [finalBlocks, setFinalBlocks] = useState<Block[]>([]);
    const [attempts, setAttempts] = useState<Record<number, BlockAttempt[]>>({});
    const [loading, setLoading] = useState(true);
    const { user: arbiterUser } = useAuth();

    const fetchAllData = useCallback(async () => {
        if (!participant) return;
        setLoading(true);
        try {
            const blocks = await mockSupabaseClient.blocks.getFinals();
            setFinalBlocks(blocks);

            const userAttempts = await mockSupabaseClient.attempts.getUserAttempts(participant.id);
            const groupedAttempts: Record<number, BlockAttempt[]> = {};
            userAttempts.forEach(att => {
                if (!groupedAttempts[att.blockId]) groupedAttempts[att.blockId] = [];
                groupedAttempts[att.blockId].push(att);
            });
            setAttempts(groupedAttempts);
        } catch (error) {
            console.error("Error fetching scoring data:", error);
        } finally {
            setLoading(false);
        }
    }, [participant]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handleAddAttempt = async (blockId: number) => {
        if (!participant || !arbiterUser) return;
        const currentAttempts = attempts[blockId] || [];
        await mockSupabaseClient.attempts.addAttempt({
            blockId,
            userId: participant.id,
            arbiterId: arbiterUser.id,
            attemptNumber: currentAttempts.length + 1,
            isCompletion: false,
        });
        fetchAllData();
    };
    
    const handleRemoveAttempt = async (blockId: number) => {
        if (!participant) return;
        const currentAttempts = attempts[blockId] || [];
        if (currentAttempts.length === 0) return;
        
        await mockSupabaseClient.attempts.removeLastAttempt(participant.id, blockId);
        fetchAllData();
    };

    const handleMarkComplete = async (blockId: number) => {
        if (!participant || !arbiterUser) return;
        const currentAttempts = attempts[blockId] || [];
        await mockSupabaseClient.attempts.addAttempt({
            blockId,
            userId: participant.id,
            arbiterId: arbiterUser.id,
            attemptNumber: currentAttempts.length + 1,
            isCompletion: true,
        });
        fetchAllData();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white" id="modal-title">
                        Puntuació per a <span className="text-purple-500">{participant.fullName}</span>
                    </h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white" aria-label="Tancar">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-8">Carregant blocs...</div>
                ) : (
                    <div className="overflow-y-auto space-y-4">
                        {finalBlocks.map(block => {
                            const blockAttempts = attempts[block.id] || [];
                            const isCompleted = blockAttempts.some(a => a.isCompletion);
                            return (
                                <div key={block.id} className="bg-white dark:bg-gray-900 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div>
                                        <h4 className="font-bold text-lg">Bloc #{block.blockNumber}</h4>
                                        <p className={`text-sm font-semibold ${isCompleted ? 'text-green-500' : 'text-yellow-500'}`}>
                                            {isCompleted ? 'COMPLETAT' : 'Pendent'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap justify-center">
                                        <span className="font-medium mr-2">Intents:</span>
                                        <button onClick={() => handleRemoveAttempt(block.id)} disabled={blockAttempts.length === 0} className="px-3 py-1 bg-red-600 text-white rounded disabled:bg-gray-500" aria-label={`Treure intent del bloc ${block.blockNumber}`}>-</button>
                                        <span className="w-8 text-center font-bold text-lg">{blockAttempts.length}</span>
                                        <button onClick={() => handleAddAttempt(block.id)} disabled={isCompleted} className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-500" aria-label={`Afegir intent al bloc ${block.blockNumber}`}>+</button>
                                        <button onClick={() => handleMarkComplete(block.id)} disabled={isCompleted} className="ml-4 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-500">
                                            Completat
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                         {finalBlocks.length === 0 && (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                No hi ha blocs de finals per puntuar.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArbiterScoreModal;