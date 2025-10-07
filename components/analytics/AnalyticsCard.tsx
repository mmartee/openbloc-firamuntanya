
import React from 'react';

interface AnalyticsCardProps {
    title: string;
    children: React.ReactNode;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, children }) => {
    return (
        <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-lg h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">{title}</h3>
            <div className="flex-grow flex flex-col items-center justify-center">
                {children}
            </div>
        </div>
    );
};

export default AnalyticsCard;
