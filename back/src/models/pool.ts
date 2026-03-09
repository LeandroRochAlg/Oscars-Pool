import { ObjectId } from "mongodb";
import { BetSelection } from "./bet";

type UserPool = {
    user: ObjectId;
    admin: boolean;
    bets?: BetSelection;
};

type CategoryPool = {
    category: string;
    weight: number;
};

export interface Pool {
    _id?: ObjectId;
    name: string;
    description?: string;
    editionKey?: string;
    public: boolean;
    inviteToken?: string;
    categories: CategoryPool[];
    users: UserPool[];
    createdBy: ObjectId;
    createdAt: Date;
};