import { ObjectId } from 'mongodb';
import { Nominee } from './nominee';

export interface EditionCategory {
    category: string;
    nominees: Nominee[];
    winner?: string | null;
}

export interface Edition {
    _id?: ObjectId;
    key: string;
    label: string;
    year: number;
    ceremonyDate: Date;
    betDeadline: Date;
    isActive: boolean;
    categories: EditionCategory[];
    createdAt: Date;
    updatedAt: Date;
}

export type EditionSummary = Pick<Edition, 'key' | 'label' | 'year' | 'ceremonyDate' | 'betDeadline' | 'isActive'>;
