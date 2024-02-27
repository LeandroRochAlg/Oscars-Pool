import { Int32 } from "mongodb";

export interface Nominee {
    id: Int32;
    name: string;
    movieTitle: string;
    userBet?: boolean;
}