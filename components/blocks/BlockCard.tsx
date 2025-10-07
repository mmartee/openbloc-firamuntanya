
import React, { useState } from 'react';
import { Block, Difficulty, Role } from '../../types';
import { COLOR_MAP } from '../../constants';
import { mockSupabaseClient } from '../../services/supabaseService';
import BlockEditor from './BlockEditor';

interface BlockCardProps {
  block: Block;
  userRole: Role;
  onUpdate: () => void;
}

const BlockCard: React.FC<BlockCardProps> = ({ block, userRole, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(block.isCompleted || false);
  const [isLoading, setIsLoading] = useState(false);

  const canParticipantComplete = userRole === Role.Participant && block.blockNumber <= 44;
  const canAdminEdit = userRole === Role.Admin;

  const handleCompletionToggle = async () => {
    if (!canParticipantComplete || isLoading) return;

    setIsLoading(true);
    try {
      if (isCompleted) {
        await mockSupabaseClient.completions.removeCompletion(block.id);
        setIsCompleted(false);
      } else {
        await mockSupabaseClient.completions.addCompletion(block.id);
        setIsCompleted(true);
      }
    } catch (error) {
      console.error("Failed to update completion status", error);
      // Revert state on error
      setIsCompleted(prev => !prev);
    } finally {
      setIsLoading(false);
      onUpdate(); // To refresh leaderboard etc.
    }
  };

  const cardColorClass = COLOR_MAP[block.color];

  return (
    <>
      <div className={`relative rounded-lg shadow-lg p-4 flex flex-col justify-between aspect-square transition-transform duration-200 hover:scale-105 ${cardColorClass}`}>
        <div className="flex-grow">
          <span className="font-bold text-3xl">#{block.blockNumber}</span>
          <p className="text-xs">{block.difficulty}</p>
        </div>
        
        {canParticipantComplete && (
          <button
            onClick={handleCompletionToggle}
            disabled={isLoading}
            className={`w-full mt-2 px-2 py-1 text-white text-sm rounded transition-colors ${
              isCompleted 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-green-600 hover:bg-green-700'
            } disabled:bg-gray-500`}
          >
            {isLoading ? '...' : (isCompleted ? 'Desmarcar' : 'Completat')}
          </button>
        )}

        {block.difficulty === Difficulty.Puntuables && userRole === Role.Participant && (
            <div className="absolute inset-0 bg-gray-700 bg-opacity-60 backdrop-blur-sm rounded-lg flex items-center justify-center pointer-events-none">
            </div>
        )}

        {canAdminEdit && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-2 right-2 p-1 bg-gray-900 bg-opacity-50 rounded-full hover:bg-opacity-75"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
            </svg>
          </button>
        )}
      </div>
      {isEditing && canAdminEdit && (
        <BlockEditor
          block={block}
          onClose={() => setIsEditing(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

export default BlockCard;