import { Nominee } from "./Nominee";

export interface Category {
    _id?: string;
    category: string;
    nominees: Nominee[];
    value: number;
    winner?: number;
}