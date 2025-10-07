
import React, { useState } from 'react';
import { Block, BlockColor, Difficulty } from '../../types';
import { mockSupabaseClient } from '../../services/supabaseService';

interface BlockEditorProps {
    block: Block;
    onClose: () => void;
    onUpdate: () => void;
}

const BlockEditor: React.FC<BlockEditorProps> = ({ block, onClose, onUpdate }) => {
    const [formData, setFormData] = useState<Partial<Block>>(block);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'blockNumber' || name === 'baseScore' ? parseInt(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await mockSupabaseClient.blocks.update(block.id, formData);
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Failed to update block", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const inputClasses = "mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Block #{block.blockNumber}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Number</label>
                        <input type="number" name="blockNumber" value={formData.blockNumber || ''} onChange={handleChange} className={inputClasses}/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Color</label>
                        <select name="color" value={formData.color || ''} onChange={handleChange} className={inputClasses}>
                            {Object.values(BlockColor).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Difficulty</label>
                        <select name="difficulty" value={formData.difficulty || ''} onChange={handleChange} className={inputClasses}>
                            {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Base Score</label>
                        <input type="number" name="baseScore" value={formData.baseScore || 0} onChange={handleChange} className={inputClasses}/>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-purple-900">{isLoading ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlockEditor;