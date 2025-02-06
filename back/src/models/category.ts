import { Nominee } from "./nominee";

export interface Category {
    category: string;
    nominees: Nominee[];
}