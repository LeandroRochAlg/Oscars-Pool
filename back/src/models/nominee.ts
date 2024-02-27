import { Int32 } from "mongodb";

export interface Nominee {
    id: Int32;
    movieTitle: string;
    name: string;
}