import { useState, useMemo, createContext } from 'react';
import { io } from 'socket.io-client';

export const DataContext = createContext(null);

const DataContextProvider = ({ children }) => {
    const url = process.env.REACT_APP_BASE_URL;
    const [user, setUser] = useState(null);
    const [currentRoom, setCurrentRoom] = useState(null);

    const socket = useMemo(() => io(url), []);

    return (
        <DataContext.Provider value={{ user, setUser, currentRoom, setCurrentRoom, socket }}>
            {children}
        </DataContext.Provider>
    );
};