import React, { useState } from 'react';
import { Block, BlockColor, Difficulty } from '../../types';
import { mockSupabaseClient } from '../../services/supabaseService';

const AdminPanel: React.FC = () => {
    const [newBlock, setNewBlock] = useState<Partial<Block>>({
        blockNumber: 1,
        color: BlockColor.Verd,
        difficulty: Difficulty.MoltFacil,
        baseScore: 1,
    });
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewBlock(prev => ({ ...prev, [name]: name === 'blockNumber' || name === 'baseScore' ? parseInt(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            await mockSupabaseClient.blocks.create(newBlock as Omit<Block, 'id'>);
            setMessage(`Bloc #${newBlock.blockNumber} creat correctament!`);
            // Reset form for next entry
            setNewBlock(prev => ({ ...prev, blockNumber: (prev.blockNumber || 0) + 1 }));
        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        }
    };
    
    const inputClasses = "px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md";

    return (
        <div className="bg-gray-200 dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Crear Nou Bloc</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">La secció per modificar blocs existents es troba a la pàgina principal "Blocs", fent clic a la icona d'edició de cada targeta de bloc.</p>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="number" name="blockNumber" value={newBlock.blockNumber || ''} onChange={handleChange} placeholder="Número" className={inputClasses}/>
                <select name="color" value={newBlock.color} onChange={handleChange} className={inputClasses}>
                    {Object.values(BlockColor).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select name="difficulty" value={newBlock.difficulty} onChange={handleChange} className={inputClasses}>
                    {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <input type="number" name="baseScore" value={newBlock.baseScore || ''} onChange={handleChange} placeholder="Puntuació Base" className={inputClasses}/>
                <div className="md:col-span-2">
                    <button type="submit" className="w-full mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Crear Bloc</button>
                    {message && <p className="text-center mt-4">{message}</p>}
                </div>
            </form>
        </div>
    );
};

export default AdminPanel;