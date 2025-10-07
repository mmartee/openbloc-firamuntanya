
import React from 'react';
import { DIFFICULTY_ORDER } from '../../constants';

interface DonutChartProps {
    data: { label: string; value: number }[];
}

const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
    const validData = data.filter(d => d.value > 0);
    const total = validData.reduce((sum, item) => sum + item.value, 0);

    if (total === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400">No hi ha dades per mostrar.</p>;
    }

    const colors = ['#a855f7', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6'];
    let cumulative = 0;

    const sortedData = [...validData].sort((a,b) => DIFFICULTY_ORDER.indexOf(a.label as any) - DIFFICULTY_ORDER.indexOf(b.label as any));

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 h-full">
            <div className="relative w-48 h-48">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                    {sortedData.map((item, index) => {
                        const percentage = (item.value / total) * 100;
                        const strokeDasharray = `${percentage} ${100 - percentage}`;
                        const strokeDashoffset = 25 - cumulative;
                        cumulative += percentage;

                        return (
                             <circle
                                key={item.label}
                                cx="18"
                                cy="18"
                                r="15.9155"
                                fill="transparent"
                                stroke={colors[index % colors.length]}
                                strokeWidth="3.8"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                transform="rotate(-90 18 18)"
                            />
                        );
                    })}
                </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{total}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
                </div>
            </div>
            <ul className="space-y-2 text-sm">
                {sortedData.map((item, index) => (
                    <li key={item.label} className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[index % colors.length] }}></span>
                        <span>{item.label}: <strong>{item.value}</strong> ({(item.value / total * 100).toFixed(1)}%)</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DonutChart;
