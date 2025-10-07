import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { mockSupabaseClient } from '../services/supabaseService';
import { LeaderboardEntry, Gender, Category } from '../types';

type SortKey = keyof LeaderboardEntry | 'rank';
type SortDirection = 'ascending' | 'descending';

const LeaderboardPage: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<{ gender: string; category: string }>({ gender: 'all', category: 'all' });
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'totalScore', direction: 'descending' });

    const fetchLeaderboard = useCallback(async () => {
        setLoading(true);
        try {
            const data = await mockSupabaseClient.leaderboard.get();
            setLeaderboard(data);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, [fetchLeaderboard]);
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const requestSort = (key: SortKey) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedLeaderboard = useMemo(() => {
        let sortableItems = [...leaderboard];

        sortableItems.sort((a, b) => {
            const key = sortConfig.key as keyof LeaderboardEntry;
            if (a[key] < b[key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            if (key !== 'totalScore' && a.totalScore !== b.totalScore) {
                return b.totalScore - a.totalScore;
            }
            return 0;
        });
        
        return sortableItems;

    }, [leaderboard, sortConfig]);

    const filteredLeaderboard = useMemo(() => {
        return sortedLeaderboard
            .filter(entry => filters.gender === 'all' || entry.gender === filters.gender)
            .filter(entry => filters.category === 'all' || entry.category === filters.category)
            .filter(entry => 
                entry.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                entry.bibNumber.toString().includes(searchTerm)
            );
    }, [sortedLeaderboard, filters, searchTerm]);

    const getSortArrow = (key: SortKey) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? '▲' : '▼';
    };
    
    if (loading && leaderboard.length === 0) {
        return <div className="text-center mt-10">Loading leaderboard...</div>;
    }

    const inputClasses = "w-full md:w-auto px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm";
    const headerClasses = "p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors";

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Classificació
            </h1>

            <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Cerca per nom o dorsal..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className={`flex-grow ${inputClasses}`}
                />
                <div className="flex gap-4">
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
            </div>

            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs uppercase">
                        <tr>
                            <th className={headerClasses} onClick={() => requestSort('rank')}>Rank {getSortArrow('rank')}</th>
                            <th className={headerClasses} onClick={() => requestSort('fullName')}>Nom {getSortArrow('fullName')}</th>
                            <th className={headerClasses} onClick={() => requestSort('bibNumber')}>Dorsal {getSortArrow('bibNumber')}</th>
                            <th className={headerClasses} onClick={() => requestSort('category')}>Categoria {getSortArrow('category')}</th>
                            <th className={headerClasses} onClick={() => requestSort('totalScore')}>Puntuació {getSortArrow('totalScore')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredLeaderboard.map((entry, index) => (
                            <tr key={entry.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="p-4 font-bold text-lg text-gray-800 dark:text-gray-200">{index + 1}</td>
                                <td className="p-4 text-gray-900 dark:text-gray-100">{entry.fullName}</td>
                                <td className="p-4 text-gray-700 dark:text-gray-300">#{entry.bibNumber}</td>
                                <td className="p-4 capitalize text-gray-700 dark:text-gray-300">{entry.category}</td>
                                <td className="p-4 font-bold text-purple-500 dark:text-purple-400 text-lg">{entry.totalScore}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredLeaderboard.length === 0 && <p className="text-center p-8 text-gray-500 dark:text-gray-400">No s'han trobat resultats.</p>}
            </div>
        </div>
    );
};

export default LeaderboardPage;