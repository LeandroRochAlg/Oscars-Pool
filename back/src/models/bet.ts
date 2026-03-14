export interface Bet {
    category: string;
    nominees: string[];
}

export interface BetSelection {
    userBets: Bet[];
}