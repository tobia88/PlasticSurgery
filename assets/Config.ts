export default class Configs{
    static get MAX_DROP_AMOUNT(): number { return 30; }
    static get DROP_INTERVAL(): number { return 0.3; }
}

export enum SizeTypes {
    Small = 0,
    SlightlySmall,
    Normal,
    SligthlyBig,
    Big
}
