import { Int32, ObjectId } from "mongodb";
import { CategoryPool } from "./categoryPool";

export interface Pool {
    _id?: ObjectId;
    name: string;
    description: string;
    categories: CategoryPool[];
    admins: ObjectId[];
    users: ObjectId[];
    weightSum: number;
}