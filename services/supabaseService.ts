
import { User, Role, Gender, Category, Difficulty, BlockColor, Block, BlockCompletion, BlockAttempt, LeaderboardEntry } from '../types';

export interface AuthCredentials {
  email: string;
  password?: string;
}

const SESSION_KEY = 'climbcomp_session';
const USERS_KEY = 'climbcomp_users';
const BLOCKS_KEY = 'climbcomp_blocks';
const COMPLETIONS_KEY = 'climbcomp_completions';
const ATTEMPTS_KEY = 'climbcomp_attempts';

const getFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
        return defaultValue;
    }
};

const setInStorage = <T>(key: string, value: T) => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`Error writing to localStorage key "${key}":`, error);
    }
};

const createInitialData = () => {
    const users: User[] = [
        { id: 'auth|admin', fullName: 'Admin User', email: 'admin@test.com', bibNumber: 999, role: Role.Admin, gender: Gender.Masculi, category: Category.Absoluta },
        { id: 'auth|arbiter', fullName: 'Arbiter User', email: 'arbiter@test.com', bibNumber: 998, role: Role.Arbiter, gender: Gender.Femeni, category: Category.Absoluta },
        { id: 'auth|jofre', fullName: 'Jofre TS', email: 'jofrets@gmail.com', bibNumber: 996, role: Role.Admin, gender: Gender.Masculi, category: Category.Absoluta },
        { id: 'auth|marti', fullName: 'Marti Antentas', email: 'martiantentas@gmail.com', bibNumber: 997, role: Role.Arbiter, gender: Gender.Masculi, category: Category.Absoluta },
        { id: 'auth|p1', fullName: 'Alex Roca', email: 'alex@test.com', bibNumber: 101, role: Role.Participant, gender: Gender.Masculi, category: Category.Sub18 },
        { id: 'auth|p2', fullName: 'Laia Font', email: 'laia@test.com', bibNumber: 102, role: Role.Participant, gender: Gender.Femeni, category: Category.Universitari },
        { id: 'auth|p3', fullName: 'Marc Soler', email: 'marc@test.com', bibNumber: 103, role: Role.Participant, gender: Gender.Masculi, category: Category.Absoluta },
    ];
    setInStorage(USERS_KEY, users);

    const blocks: Block[] = [];
    setInStorage(BLOCKS_KEY, blocks);
    setInStorage(COMPLETIONS_KEY, []);
    setInStorage(ATTEMPTS_KEY, []);
    setInStorage(SESSION_KEY, null);
};

if (!localStorage.getItem(USERS_KEY)) {
    createInitialData();
}


// --- MOCK SUPABASE CLIENT ---

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getCurrentUser = (): User | null => {
    const userId = getFromStorage<string | null>(SESSION_KEY, null);
    if (!userId) return null;
    const allUsers = getFromStorage<User[]>(USERS_KEY, []);
    return allUsers.find(u => u.id === userId) || null;
};

const calculateLeaderboard = (): LeaderboardEntry[] => {
    const allUsers = getFromStorage<User[]>(USERS_KEY, []);
    const allBlocks = getFromStorage<Block[]>(BLOCKS_KEY, []);
    const allCompletions = getFromStorage<BlockCompletion[]>(COMPLETIONS_KEY, []);
    const allAttempts = getFromStorage<BlockAttempt[]>(ATTEMPTS_KEY, []);
    
    const participants = allUsers.filter(u => u.role === Role.Participant);
    
    const leaderboardData = participants.map(p => {
        let totalScore = 0;

        // Score for blocks 1-44
        const regularCompletions = allCompletions.filter(c => c.userId === p.id);
        regularCompletions.forEach(comp => {
            const block = allBlocks.find(b => b.id === comp.blockId);
            if (block && block.difficulty !== Difficulty.Puntuables) {
                totalScore += block.baseScore;
            }
        });

        // Score for Puntuables blocks
        const finalBlockAttempts = allAttempts.filter(a => a.userId === p.id && a.isCompletion);
        const completedFinalBlocks = new Set<number>();

        finalBlockAttempts.forEach(attempt => {
            const block = allBlocks.find(b => b.id === attempt.blockId);
            if (block && block.difficulty === Difficulty.Puntuables && !completedFinalBlocks.has(attempt.blockId)) {
                completedFinalBlocks.add(attempt.blockId);
                const attemptsForThisBlock = allAttempts.filter(a => a.userId === p.id && a.blockId === attempt.blockId).length;
                 switch (attemptsForThisBlock) {
                    case 1: totalScore += 100; break;
                    case 2: totalScore += 50; break;
                    case 3: totalScore += 25; break;
                    default: totalScore += 10; break;
                }
            }
        });

        return {
            userId: p.id,
            fullName: p.fullName,
            bibNumber: p.bibNumber,
            gender: p.gender,
            category: p.category,
            totalScore: totalScore,
        };
    });

    return leaderboardData.sort((a, b) => b.totalScore - a.totalScore);
};

export const mockSupabaseClient = {
    auth: {
        async getUser(): Promise<User | null> {
            await delay(100);
            return getCurrentUser();
        },
        async signIn({ email }: AuthCredentials): Promise<User> {
            await delay(500);
            const users = getFromStorage<User[]>(USERS_KEY, []);
            // Note: In a real app, you'd check a hashed password. This mock is simplified.
            const user = users.find(u => u.email === email);
            if (user) {
                setInStorage(SESSION_KEY, user.id);
                return user;
            }
            throw new Error('Invalid credentials');
        },
        async signUp(details: Omit<User, 'id' | 'role'> & {password: string}): Promise<User> {
            await delay(500);
            const users = getFromStorage<User[]>(USERS_KEY, []);
            if (users.some(u => u.email === details.email)) {
                throw new Error('Email already in use');
            }
            if (users.some(u => u.bibNumber === details.bibNumber)) {
                throw new Error('Bib number already in use');
            }
            const newUser: User = {
                id: `auth|${Math.random().toString(36).substr(2, 9)}`,
                role: Role.Participant, // default role
                ...details
            };
            users.push(newUser);
            setInStorage(USERS_KEY, users);
            setInStorage(SESSION_KEY, newUser.id);
            return newUser;
        },
        async signOut(): Promise<void> {
            await delay(100);
            setInStorage(SESSION_KEY, null);
        },
    },

    blocks: {
        async getAll(): Promise<Block[]> {
            await delay(200);
            return getFromStorage<Block[]>(BLOCKS_KEY, []);
        },
        async getFinals(): Promise<Block[]> {
            await delay(100);
            return getFromStorage<Block[]>(BLOCKS_KEY, []).filter(b => b.difficulty === Difficulty.Puntuables);
        },
        async update(id: number, data: Partial<Block>): Promise<Block> {
            await delay(300);
            const blocks = getFromStorage<Block[]>(BLOCKS_KEY, []);
            const index = blocks.findIndex(b => b.id === id);
            if (index === -1) throw new Error("Block not found");
            blocks[index] = { ...blocks[index], ...data };
            setInStorage(BLOCKS_KEY, blocks);
            return blocks[index];
        },
        async create(data: Omit<Block, 'id' | 'isCompleted'>): Promise<Block> {
            await delay(300);
            const blocks = getFromStorage<Block[]>(BLOCKS_KEY, []);
            const newBlock: Block = {
                id: Math.max(0, ...blocks.map(b => b.id)) + 1,
                ...data,
            };
            blocks.push(newBlock);
            setInStorage(BLOCKS_KEY, blocks);
            return newBlock;
        },
    },
    
    completions: {
        async getUserCompletions(userId: string): Promise<BlockCompletion[]> {
            await delay(150);
            return getFromStorage<BlockCompletion[]>(COMPLETIONS_KEY, []).filter(c => c.userId === userId);
        },
        async getAllCompletions(): Promise<BlockCompletion[]> {
            await delay(200);
            return getFromStorage<BlockCompletion[]>(COMPLETIONS_KEY, []);
        },
        async addCompletion(blockId: number): Promise<BlockCompletion> {
            await delay(250);
            const user = getCurrentUser();
            if (!user) throw new Error("Not authenticated");
            const completions = getFromStorage<BlockCompletion[]>(COMPLETIONS_KEY, []);
            
            if (completions.some(c => c.userId === user.id && c.blockId === blockId)) {
                console.warn("Completion already exists");
                return completions.find(c => c.userId === user.id && c.blockId === blockId)!;
            }

            const newCompletion: BlockCompletion = {
                id: Math.max(0, ...completions.map(c => c.id)) + 1,
                userId: user.id,
                blockId,
            };
            completions.push(newCompletion);
            setInStorage(COMPLETIONS_KEY, completions);
            return newCompletion;
        },
        async removeCompletion(blockId: number): Promise<void> {
            await delay(250);
            const user = getCurrentUser();
            if (!user) throw new Error("Not authenticated");
            let completions = getFromStorage<BlockCompletion[]>(COMPLETIONS_KEY, []);
            completions = completions.filter(c => !(c.userId === user.id && c.blockId === blockId));
            setInStorage(COMPLETIONS_KEY, completions);
        }
    },

    attempts: {
        async getUserAttempts(userId: string): Promise<BlockAttempt[]> {
            await delay(150);
            const allAttempts = getFromStorage<BlockAttempt[]>(ATTEMPTS_KEY, []);
            return allAttempts.filter(a => a.userId === userId);
        },
        async getAllAttempts(): Promise<BlockAttempt[]> {
            await delay(200);
            return getFromStorage<BlockAttempt[]>(ATTEMPTS_KEY, []);
        },
        async addAttempt(data: Omit<BlockAttempt, 'id' | 'attemptedAt'>): Promise<BlockAttempt> {
            await delay(250);
            const attempts = getFromStorage<BlockAttempt[]>(ATTEMPTS_KEY, []);
            const newAttempt: BlockAttempt = {
                id: Math.max(0, ...attempts.map(a => a.id)) + 1,
                attemptedAt: new Date().toISOString(),
                ...data,
            };
            attempts.push(newAttempt);
            setInStorage(ATTEMPTS_KEY, attempts);
            return newAttempt;
        },
        async removeLastAttempt(userId: string, blockId: number): Promise<void> {
            await delay(250);
            let attempts = getFromStorage<BlockAttempt[]>(ATTEMPTS_KEY, []);
            const userBlockAttempts = attempts
                .filter(a => a.userId === userId && a.blockId === blockId)
                .sort((a, b) => b.id - a.id); // Sort by ID descending to find the last one
    
        if (userBlockAttempts.length > 0) {
            const lastAttemptId = userBlockAttempts[0].id;
            attempts = attempts.filter(a => a.id !== lastAttemptId);
            setInStorage(ATTEMPTS_KEY, attempts);
        }
    }
    },
    
    users: {
        async getAllParticipants(): Promise<User[]> {
            await delay(200);
            return getFromStorage<User[]>(USERS_KEY, []).filter(u => u.role === Role.Participant);
        },
        async search(term: string): Promise<User[]> {
            await delay(200);
            if (!term) return [];
            const lowerTerm = term.toLowerCase();
            return getFromStorage<User[]>(USERS_KEY, [])
                .filter(u => u.role === Role.Participant)
                .filter(u => u.fullName.toLowerCase().includes(lowerTerm) || u.bibNumber.toString().includes(lowerTerm));
        }
    },
    
    leaderboard: {
        async get(): Promise<LeaderboardEntry[]> {
            await delay(400);
            return calculateLeaderboard();
        }
    }
};
