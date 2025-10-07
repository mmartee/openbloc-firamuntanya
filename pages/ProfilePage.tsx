
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would call your service here.
        // mockSupabaseClient.auth.updatePassword(oldPassword, newPassword);
        setMessage('Contrasenya actualitzada correctament! (Simulació)');
        setOldPassword('');
        setNewPassword('');
    };

    if (!user) {
        return <div className="text-center mt-10">Loading profile...</div>;
    }

    const inputClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md";

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                El Teu Perfil
            </h1>
            <div className="bg-gray-200 dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><span className="font-semibold text-gray-500 dark:text-gray-400">Nom Complet:</span><p className="text-lg">{user.fullName}</p></div>
                    <div><span className="font-semibold text-gray-500 dark:text-gray-400">Email:</span><p className="text-lg">{user.email}</p></div>
                    <div><span className="font-semibold text-gray-500 dark:text-gray-400">Dorsal:</span><p className="text-lg">#{user.bibNumber}</p></div>
                    <div><span className="font-semibold text-gray-500 dark:text-gray-400">Rol:</span><p className="text-lg capitalize">{user.role}</p></div>
                    <div><span className="font-semibold text-gray-500 dark:text-gray-400">Gènere:</span><p className="text-lg capitalize">{user.gender}</p></div>
                    <div><span className="font-semibold text-gray-500 dark:text-gray-400">Categoria:</span><p className="text-lg capitalize">{user.category}</p></div>
                </div>
            </div>

            <div className="bg-gray-200 dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Configuració</h2>
                <div className="flex items-center justify-between">
                    <span className="font-medium">Mode Fosc</span>
                    <button onClick={toggleTheme} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${theme === 'dark' ? 'bg-purple-600' : 'bg-gray-400'}`}>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>
            
            <div className="bg-gray-200 dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Canviar Contrasenya</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <input type="password" placeholder="Contrasenya actual" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className={inputClasses}/>
                    <input type="password" placeholder="Nova contrasenya" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={inputClasses}/>
                    <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Actualitzar</button>
                    {message && <p className="text-green-500 dark:text-green-400 mt-2">{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;