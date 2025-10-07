
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { mockSupabaseClient } from '../services/supabaseService';
import { Block, BlockColor, Difficulty, Role } from '../types';
import BlockCard from '../components/blocks/BlockCard';
import { DIFFICULTY_ORDER } from '../constants';
import { useAuth } from '../hooks/useAuth';

const BlocksPage: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', difficulty: 'all', color: 'all' });
  const [showCompleted, setShowCompleted] = useState(true);
  const { user } = useAuth();

  const fetchBlocks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const allBlocks = await mockSupabaseClient.blocks.getAll();
      const completions = await mockSupabaseClient.completions.getUserCompletions(user.id);
      const completionMap = new Set(completions.map(c => c.blockId));
      
      const blocksWithStatus = allBlocks.map(b => ({
        ...b,
        isCompleted: completionMap.has(b.id)
      }));

      setBlocks(blocksWithStatus);
    } catch (error) {
      console.error('Error fetching blocks:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const handleBlockUpdate = useCallback(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredBlocks = useMemo(() => {
    return blocks
      .filter(b => showCompleted || !b.isCompleted)
      .filter(b => filters.difficulty === 'all' || b.difficulty === filters.difficulty)
      .filter(b => filters.color === 'all' || b.color === filters.color)
      .filter(b => b.blockNumber.toString().includes(filters.search.trim()));
  }, [blocks, filters, showCompleted]);

  const groupedBlocks = useMemo(() => {
    const groups: { [key in Difficulty]?: Block[] } = {};
    for (const block of filteredBlocks) {
      if (!groups[block.difficulty]) {
        groups[block.difficulty] = [];
      }
      groups[block.difficulty]?.push(block);
    }
     // Sort blocks within each group by block number
    for (const key in groups) {
        groups[key as Difficulty]?.sort((a, b) => a.blockNumber - b.blockNumber);
    }
    return groups;
  }, [filteredBlocks]);


  if (loading) {
    return <div className="text-center mt-10">Loading blocks...</div>;
  }

  const inputClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm";

  return (
    <div className="space-y-8">
      <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" name="search" placeholder="Cerca per número..." value={filters.search} onChange={handleFilterChange} className={inputClasses} />
          <select name="difficulty" value={filters.difficulty} onChange={handleFilterChange} className={inputClasses}>
            <option value="all">Totes les dificultats</option>
            {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select name="color" value={filters.color} onChange={handleFilterChange} className={inputClasses}>
            <option value="all">Tots els colors</option>
            {Object.values(BlockColor).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-center justify-end">
          <label htmlFor="show-completed" className="mr-3 text-sm font-medium">Mostrar completats</label>
          <button onClick={() => setShowCompleted(!showCompleted)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${showCompleted ? 'bg-purple-600' : 'bg-gray-400 dark:bg-gray-600'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${showCompleted ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {DIFFICULTY_ORDER.map(difficulty => (
        groupedBlocks[difficulty] && groupedBlocks[difficulty]!.length > 0 && (
          <section key={difficulty}>
            <h2 className="text-2xl font-semibold mb-4 border-b-2 border-gray-300 dark:border-gray-700 pb-2 capitalize">{difficulty}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {groupedBlocks[difficulty]?.map(block => (
                <BlockCard key={block.id} block={block} userRole={user!.role} onUpdate={handleBlockUpdate}/>
              ))}
            </div>
          </section>
        )
      ))}
    </div>
  );
};

export default BlocksPage;