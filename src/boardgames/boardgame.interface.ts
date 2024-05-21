export interface BaseBoardGame {
    name: string;
    description: string
    playerCount: number
}

export interface BoardGame extends BaseBoardGame {
    id: number;

}