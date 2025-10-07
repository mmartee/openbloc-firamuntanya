import React, { useState, useEffect } from 'react';
import { mockSupabaseClient } from '../../services/supabaseService';
import { User } from '../../types';
import ArbiterScoreModal from './ArbiterScoreModal';

const ArbiterPanel: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [participants, setParticipants] = useState<User[]>([]);
    const [selectedParticipant, setSelectedParticipant] = useState<User | null>(null);
    
    useEffect(() => {
        const fetchParticipants = async () => {
            if (searchTerm.length > 2) {
                const results = await mockSupabaseClient.users.search(searchTerm);
                setParticipants(results);
            } else {
                setParticipants([]);
            }
        };
        const debounce = setTimeout(fetchParticipants, 300);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    const handleSelectParticipant = (participant: User) => {
        setSelectedParticipant(participant);
        setSearchTerm('');
        setParticipants([]);
    };

    const handleCloseModal = () => {
        setSelectedParticipant(null);
    };

    return (
        <>
            <div className="bg-gray-200 dark:bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
                <h2 className="text-2xl font-bold">Puntuació Blocs Puntuables</h2>
                
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Cerca participant per nom o dorsal..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"
                    />
                    {participants.length > 0 && (
                        <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
                            {participants.map(p => (
                                <li key={p.id} onClick={() => handleSelectParticipant(p)} className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                    {p.fullName} (#{p.bibNumber})
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {!selectedParticipant && (
                    <p className="text-center text-gray-500 dark:text-gray-400 pt-4">
                        Busca un participant per començar a puntuar.
                    </p>
                )}

            </div>

            {selectedParticipant && (
                <ArbiterScoreModal 
                    participant={selectedParticipant}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default ArbiterPanel;