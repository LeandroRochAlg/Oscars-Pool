import { useContext } from 'react';
import { EditionContext } from '../contexts/editionContext';

export const useEdition = () => {
    const context = useContext(EditionContext);

    if (!context) {
        throw new Error('useEdition must be used within an EditionProvider');
    }

    return context;
};
