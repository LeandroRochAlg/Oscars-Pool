import { useEffect, useMemo, useState } from 'react';
import api from '../libs/api';
import { EditionSummary } from '../models/edition';
import { EditionContext } from './editionContext';

const STORAGE_KEY = 'selectedEditionKey';

export const EditionProvider = ({ children }: { children: React.ReactNode }) => {
    const [editions, setEditions] = useState<EditionSummary[]>([]);
    const [activeEdition, setActiveEdition] = useState<EditionSummary | null>(null);
    const [selectedEditionKey, setSelectedEditionKeyState] = useState<string | null>(localStorage.getItem(STORAGE_KEY));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEditions = async () => {
            setLoading(true);

            try {
                const [editionsResponse, activeResponse] = await Promise.all([
                    api.get<EditionSummary[]>('/editions'),
                    api.get<EditionSummary>('/editions/active'),
                ]);

                const availableEditions = editionsResponse.data.filter((edition, index, editionsList) => (
                    editionsList.findIndex((candidate) => candidate.key === edition.key) === index
                ));
                const currentActiveEdition = activeResponse.data;
                const persistedEdition = localStorage.getItem(STORAGE_KEY);
                const nextSelectedEdition = availableEditions.find((edition) => edition.key === persistedEdition)
                    ?? availableEditions.find((edition) => edition.key === currentActiveEdition.key)
                    ?? availableEditions[0]
                    ?? null;

                setEditions(availableEditions);
                setActiveEdition(currentActiveEdition);
                setSelectedEditionKeyState(nextSelectedEdition?.key ?? null);

                if (nextSelectedEdition?.key) {
                    localStorage.setItem(STORAGE_KEY, nextSelectedEdition.key);
                }
            } catch (error) {
                console.error('Error loading editions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEditions();
    }, []);

    const setSelectedEditionKey = (editionKey: string) => {
        setSelectedEditionKeyState(editionKey);
        localStorage.setItem(STORAGE_KEY, editionKey);
    };

    const selectedEdition = useMemo(() => {
        return editions.find((edition) => edition.key === selectedEditionKey) ?? activeEdition;
    }, [editions, selectedEditionKey, activeEdition]);

    return (
        <EditionContext.Provider value={{
            editions,
            activeEdition,
            selectedEdition,
            selectedEditionKey: selectedEdition?.key ?? null,
            setSelectedEditionKey,
            loading,
        }}>
            {children}
        </EditionContext.Provider>
    );
};
