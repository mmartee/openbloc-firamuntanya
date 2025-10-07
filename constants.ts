import { BlockColor, Difficulty } from './types';

export const DIFFICULTY_ORDER: Difficulty[] = [
    Difficulty.MoltFacil,
    Difficulty.Facil,
    Difficulty.Mitja,
    Difficulty.Dificil,
    Difficulty.Puntuables
];

export const COLOR_MAP: Record<BlockColor, string> = {
  [BlockColor.Rosa]: 'bg-custom-rosa text-black',
  [BlockColor.Lila]: 'bg-custom-lila text-white',
  [BlockColor.Groc]: 'bg-custom-groc text-black',
  [BlockColor.Blau]: 'bg-custom-blau text-white',
  [BlockColor.Verd]: 'bg-custom-verd text-black',
  [BlockColor.Vermell]: 'bg-custom-vermell text-black',
  [BlockColor.Taronja]: 'bg-custom-taronja text-black',
  [BlockColor.Transparent]: 'bg-transparent border-2 border-gray-400 text-gray-800 dark:text-gray-200',
  [BlockColor.Negre]: 'bg-custom-negre text-white',
  [BlockColor.Gris]: 'bg-custom-gris text-black'
};