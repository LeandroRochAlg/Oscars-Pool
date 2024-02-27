import { Int32, ObjectId } from "mongodb";
import { Nominee } from "./nominee";

export interface Category {
    _id?: ObjectId;
    category: string;
    nominees: Nominee[];
    winner?: Int32;
}