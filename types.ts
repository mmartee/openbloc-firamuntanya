
export enum Role {
  Participant = 'participant',
  Arbiter = 'arbiter',
  Admin = 'admin'
}

export enum Gender {
  Masculi = 'masculi',
  Femeni = 'femeni'
}

export enum Category {
  Absoluta = 'absoluta',
  Sub18 = 'sub-18',
  Universitari = 'universitari'
}

export enum Difficulty {
  MoltFacil = 'Molt Fàcil',
  Facil = 'Fàcil',
  Mitja = 'Mitjà',
  Dificil = 'Difícil',
  Puntuables = 'Puntuables'
}

export enum BlockColor {
  Rosa = 'rosa',
  Lila = 'lila',
  Groc = 'groc',
  Blau = 'blau',
  Verd = 'verd',
  Vermell = 'vermell',
  Taronja = 'taronja',
  Transparent = 'transparent',
  Negre = 'negre',
  Gris = 'gris'
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  bibNumber: number;
  role: Role;
  gender: Gender;
  category: Category;
}

export interface Block {
  id: number;
  blockNumber: number;
  color: BlockColor;
  difficulty: Difficulty;
  baseScore: number;
  isCompleted?: boolean; // UI state, not from DB directly on block
}

export interface BlockCompletion {
  id: number;
  userId: string;
  blockId: number;
}

export interface BlockAttempt {
    id: number;
    userId: string;
    blockId: number;
    arbiterId: string;
    attemptNumber: number;
    isCompletion: boolean;
    attemptedAt: string;
}

export interface LeaderboardEntry {
    userId: string;
    fullName: string;
    bibNumber: number;
    gender: Gender;
    category: Category;
    totalScore: number;
}