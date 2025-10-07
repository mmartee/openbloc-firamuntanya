
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';
import AdminPanel from '../components/manage/AdminPanel';
import ArbiterPanel from '../components/manage/ArbiterPanel';

const ManagePage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Panell de Gestió
            </h1>
            {user?.role === Role.Admin && <AdminPanel />}
            {user?.role === Role.Arbiter && <ArbiterPanel />}
        </div>
    );
};

export default ManagePage;