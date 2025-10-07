
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { mockSupabaseClient } from '../services/supabaseService';
import { User, Block, BlockCompletion, Gender, Category, Difficulty } from '../types';
import AnalyticsCard from '../components/analytics/AnalyticsCard';
import DonutChart from '../components/analytics/DonutChart';
import BarChart from '../components/analytics/BarChart';
import { DIFFICULTY_ORDER } from '../constants';

const AnalyticsPage: React.FC = () => {
    const [participants, setParticipants] = useState<User[]>([]);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [completions, setCompletions] = useState<BlockCompletion[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ gender: 'all', category: 'all', search: '' });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [participantsData, blocksData, completionsData] = await Promise.all([
                mockSupabaseClient.users.getAllParticipants(),
                mockSupabaseClient.blocks.getAll(),
                mockSupabaseClient.completions.getAllCompletions()
            ]);
            setParticipants(participantsData);
            setBlocks(blocksData);
            setCompletions(completionsData);
        } catch (error) {
            console.error("Error fetching results data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const filteredParticipants = useMemo(() => {
        return participants
            .filter(p => filters.gender === 'all' || p.gender === filters.gender)
            .filter(p => filters.category === 'all' || p.category === filters.category)
            .filter(p => p.fullName.toLowerCase().includes(filters.search.toLowerCase()) || p.bibNumber.toString().includes(filters.search));
    }, [participants, filters]);

    const filteredCompletions = useMemo(() => {
        const participantIds = new Set(filteredParticipants.map(p => p.id));
        return completions.filter(c => participantIds.has(c.userId));
    }, [completions, filteredParticipants]);

    const analyticsData = useMemo(() => {
        if (!blocks.length) return null;

        const completionsByDifficulty = DIFFICULTY_ORDER.map(difficulty => {
            const count = filteredCompletions.filter(c => {
                const block = blocks.find(b => b.id === c.blockId);
                return block && block.difficulty === difficulty;
            }).length;
            return { label: difficulty, value: count };
        });
        
        const completionsByCategory = Object.values(Category).map(category => ({
            label: category,
            value: participants.filter(p => p.category === category).length
        }));
        
        const completionCounts = new Map<number, number>();
        filteredCompletions.forEach(c => {
            completionCounts.set(c.blockId, (completionCounts.get(c.blockId) || 0) + 1);
        });
        
        const top10Blocks = [...completionCounts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([blockId, count]) => {
                const block = blocks.find(b => b.id === blockId);
                return { label: `Bloc #${block?.blockNumber || 'N/A'}`, value: count };
            });

        return {
            totalParticipants: filteredParticipants.length,
            totalCompletions: filteredCompletions.length,
            completionsByDifficulty,
            completionsByCategory,
            top10Blocks
        };
    }, [filteredParticipants, filteredCompletions, blocks, participants]);

    if (loading) {
        return <div className="text-center mt-10">Carregant resultats...</div>;
    }
    
    if (!analyticsData) {
        return <div className="text-center mt-10">No hi ha dades per mostrar.</div>;
    }
    
    const inputClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm";

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Resultats en Directe
            </h1>

            <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
                 <input type="text" name="search" placeholder="Cerca participant..." value={filters.search} onChange={handleFilterChange} className={inputClasses}/>
                 <select name="gender" value={filters.gender} onChange={handleFilterChange} className={inputClasses}>
                    <option value="all">Tots els Gèneres</option>
                    <option value={Gender.Masculi}>Masculí</option>
                    <option value={Gender.Femeni}>Femení</option>
                </select>
                <select name="category" value={filters.category} onChange={handleFilterChange} className={inputClasses}>
                    <option value="all">Totes les Categories</option>
                    <option value={Category.Absoluta}>Absoluta</option>
                    <option value={Category.Sub18}>Sub-18</option>
                    <option value={Category.Universitari}>Universitari</option>
                </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnalyticsCard title="Participants Filtrats">
                    <p className="text-5xl font-bold text-purple-500 dark:text-purple-400">{analyticsData.totalParticipants}</p>
                </AnalyticsCard>
                <AnalyticsCard title="Finalitzacions Totals">
                     <p className="text-5xl font-bold text-purple-500 dark:text-purple-400">{analyticsData.totalCompletions}</p>
                </AnalyticsCard>
                 <AnalyticsCard title="Mitjana de Blocs">
                    <p className="text-5xl font-bold text-purple-500 dark:text-purple-400">
                        {analyticsData.totalParticipants > 0 ? (analyticsData.totalCompletions / analyticsData.totalParticipants).toFixed(1) : '0.0'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">finalitzacions per participant</p>
                </AnalyticsCard>
                 <AnalyticsCard title="Participants Actius">
                    <p className="text-5xl font-bold text-purple-500 dark:text-purple-400">
                        {new Set(filteredCompletions.map(c => c.userId)).size}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">amb com a mínim 1 bloc</p>
                </AnalyticsCard>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <AnalyticsCard title="Finalitzacions per Dificultat">
                    <DonutChart data={analyticsData.completionsByDifficulty} />
                </AnalyticsCard>
                 <AnalyticsCard title="Top 10 Blocs Més Completats">
                    <BarChart data={analyticsData.top10Blocks} />
                </AnalyticsCard>
            </div>
        </div>
    );
};

export default AnalyticsPage;
