import { Bet } from "./bet";

type UserPool = {
    user: string;
    admin: boolean;
    bets?: { userBets: Bet[] };
};

type CategoryPool = {
    category: string;
    weight: number;
};

export interface Pool {
    _id?: string;
    name: string;
    description?: string;
    editionKey?: string;
    public: boolean;
    inviteToken?: string;
    categories: CategoryPool[];
    users: UserPool[];
    createdBy: string;
    createdAt: string;
}