import { createContext } from 'react';
import { EditionSummary } from '../models/edition';

export type EditionContextValue = {
    editions: EditionSummary[];
    activeEdition: EditionSummary | null;
    selectedEdition: EditionSummary | null;
    selectedEditionKey: string | null;
    setSelectedEditionKey: (editionKey: string) => void;
    loading: boolean;
};

export const EditionContext = createContext<EditionContextValue | undefined>(undefined);
