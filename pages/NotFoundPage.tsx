
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <div className="text-center py-20">
            <h1 className="text-6xl font-bold text-purple-600 dark:text-purple-500">404</h1>
            <p className="text-2xl mt-4">Pàgina No Trobada</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">La pàgina que cerques no existeix.</p>
            <Link to="/" className="mt-6 inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
                Torna a l'inici
            </Link>
        </div>
    );
};

export default NotFoundPage;