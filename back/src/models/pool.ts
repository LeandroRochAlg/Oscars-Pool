import { ObjectId } from "mongodb";
import { Bet } from "./bet";

type UserPool = {
    user: ObjectId;
    admin: boolean;
    bets?: Bet[];
};

type CategoryPool = {
    category: string;
    weight: number;
};

export interface Pool {
    _id?: ObjectId;
    name: string;
    description?: string;
    public: boolean;
    inviteToken?: string;
    categories: CategoryPool[];
    users: UserPool[];
    createdBy: ObjectId;
    createdAt: Date;
};