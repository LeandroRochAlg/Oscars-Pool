import { Int32 } from "mongodb";
import { Nominee } from "./nominee";

export interface Category {
    _id?: string;
    category: string;
    nominees: Nominee[];
    winner?: Int32;
}