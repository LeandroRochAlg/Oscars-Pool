import { Int32, ObjectId } from "mongodb";
import { Bet } from "./bet";
import { Nominee } from "./nominee";

export interface CategoryPool {
    _id?: ObjectId;
    name: string;
    weight: number;
    bets: Bet[];
    winner: Nominee;
}