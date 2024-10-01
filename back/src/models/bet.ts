import { Int32, ObjectId } from "mongodb";
import { Nominee } from "./nominee";

export interface Bet {
    user: ObjectId;
    nominees: Nominee[];
}