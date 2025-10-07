
import React from 'react';

interface BarChartProps {
    data: { label: string; value: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400">No hi ha dades per mostrar.</p>;
    }

    const maxValue = Math.max(...data.map(d => d.value), 1);
    const colors = ['#a855f7', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6'];

    return (
        <div className="w-full h-full flex flex-col justify-end space-y-2">
            {data.map((item, index) => (
                <div key={item.label} className="flex items-center gap-2 group">
                    <div className="w-28 text-xs text-right truncate text-gray-600 dark:text-gray-400">{item.label}</div>
                    <div className="flex-1 bg-gray-300 dark:bg-gray-700 rounded-full h-6">
                        <div
                            className="h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                            style={{ 
                                width: `${(item.value / maxValue) * 100}%`,
                                backgroundColor: colors[index % colors.length]
                            }}
                        >
                             <span className="text-xs font-bold text-white">{item.value}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BarChart;
