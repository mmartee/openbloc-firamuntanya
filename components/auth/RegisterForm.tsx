
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Gender, Category } from '../../types';

const RegisterForm: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [bibNumber, setBibNumber] = useState('');
    const [gender, setGender] = useState<Gender>(Gender.Masculi);
    const [category, setCategory] = useState<Category>(Category.Absoluta);
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await register({ 
                fullName, 
                email, 
                password, 
                bibNumber: parseInt(bibNumber, 10), 
                gender, 
                category 
            });
        } catch (err: any) {
            setError(err.message || 'Failed to register');
        }
    };

    const inputClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm";
    
    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required className={inputClasses} />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClasses} />
            <input type="password" placeholder="Password" id="password-register" value={password} onChange={e => setPassword(e.target.value)} required className={inputClasses} />
            <input type="number" placeholder="Bib Number (Dorsal)" value={bibNumber} onChange={e => setBibNumber(e.target.value)} required className={inputClasses} />
            
            <div className="flex gap-4">
                <select value={gender} onChange={e => setGender(e.target.value as Gender)} className={inputClasses}>
                    <option value={Gender.Masculi}>Masculí</option>
                    <option value={Gender.Femeni}>Femení</option>
                </select>
                <select value={category} onChange={e => setCategory(e.target.value as Category)} className={inputClasses}>
                    <option value={Category.Absoluta}>Absoluta</option>
                    <option value={Category.Sub18}>Sub-18</option>
                    <option value={Category.Universitari}>Universitari</option>
                </select>
            </div>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 transition-colors">
                Register
            </button>
        </form>
    );
};

export default RegisterForm;