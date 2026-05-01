import { createContext, useContext, useState, ReactNode } from 'react';

interface CommandPaletteContextType {
	isOpen: boolean;
	openPalette: () => void;
	closePalette: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextType | undefined>(undefined);

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<CommandPaletteContext.Provider value={{
			isOpen,
			openPalette: () => setIsOpen(true),
			closePalette: () => setIsOpen(false),
		}}>
			{children}
		</CommandPaletteContext.Provider>
	);
}

export function useCommandPalette() {
	const context = useContext(CommandPaletteContext);
	if (!context) {
		throw new Error('useCommandPalette must be used within CommandPaletteProvider');
	}
	return context;
}
