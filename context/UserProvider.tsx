import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Plan = 'free' | 'one-time' | 'starter' | 'pro' | 'enterprise';

interface User {
    email: string;
    generationsUsed: number;
    plan: Plan;
    plan_expiry?: number; // Timestamp for one-time package
}

interface UserData {
    [email: string]: User;
}

interface UserContextType {
    currentUser: User | null;
    login: (email: string) => void;
    logout: () => void;
    incrementGenerations: () => void;
    canGenerate: () => boolean;
    getGenerationsRemaining: () => number | string;
    upgradePlan: (plan: Plan) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const FREE_GENERATION_LIMIT = 2;

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<UserData>({});
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

    // Load users from localStorage on initial render
    useEffect(() => {
        try {
            const storedUsers = localStorage.getItem('fann_users');
            if (storedUsers) {
                setUsers(JSON.parse(storedUsers));
            }
            const activeUser = localStorage.getItem('fann_active_user');
            if(activeUser) {
                setCurrentUserEmail(activeUser);
            }
        } catch (error) {
            console.error("Failed to parse user data from localStorage", error);
        }
    }, []);

    // Persist users to localStorage whenever the state changes
    useEffect(() => {
        try {
            localStorage.setItem('fann_users', JSON.stringify(users));
        } catch (error) {
            console.error("Failed to save user data to localStorage", error);
        }
    }, [users]);
    
     useEffect(() => {
        if(currentUserEmail) {
            localStorage.setItem('fann_active_user', currentUserEmail);
        } else {
            localStorage.removeItem('fann_active_user');
        }
    }, [currentUserEmail]);


    const login = useCallback((email: string) => {
        const normalizedEmail = email.toLowerCase().trim();
        setUsers(prevUsers => {
            if (prevUsers[normalizedEmail]) {
                // User exists, just log them in
                return prevUsers;
            }
            // New user, create a record
            return {
                ...prevUsers,
                [normalizedEmail]: {
                    email: normalizedEmail,
                    generationsUsed: 0,
                    plan: 'free',
                },
            };
        });
        setCurrentUserEmail(normalizedEmail);
    }, []);

    const logout = useCallback(() => {
        setCurrentUserEmail(null);
    }, []);

    const incrementGenerations = useCallback(() => {
        if (!currentUserEmail) return;
        setUsers(prevUsers => {
            const user = prevUsers[currentUserEmail];
            if (user && user.plan === 'free') { // Only increment for free users for this simulation
                return {
                    ...prevUsers,
                    [currentUserEmail]: {
                        ...user,
                        generationsUsed: user.generationsUsed + 1,
                    },
                };
            }
            return prevUsers;
        });
    }, [currentUserEmail]);
    
    const upgradePlan = useCallback((plan: Plan) => {
        if(!currentUserEmail) return;
         setUsers(prevUsers => {
            const user = prevUsers[currentUserEmail];
            if(user) {
                return {
                    ...prevUsers,
                    [currentUserEmail]: {
                        ...user,
                        plan: plan,
                        // Reset or set limits based on plan
                    }
                }
            }
            return prevUsers;
        });
    }, [currentUserEmail]);

    const currentUser = currentUserEmail ? users[currentUserEmail] : null;

    const canGenerate = useCallback((): boolean => {
        if (!currentUser) return false;
        if (currentUser.plan !== 'free') return true;
        return currentUser.generationsUsed < FREE_GENERATION_LIMIT;
    }, [currentUser]);

    const getGenerationsRemaining = useCallback((): number | string => {
        if (!currentUser) return 0;
        if (currentUser.plan !== 'free') return '∞';
        return Math.max(0, FREE_GENERATION_LIMIT - currentUser.generationsUsed);
    }, [currentUser]);

    const value = {
        currentUser,
        login,
        logout,
        incrementGenerations,
        canGenerate,
        getGenerationsRemaining,
        upgradePlan,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
