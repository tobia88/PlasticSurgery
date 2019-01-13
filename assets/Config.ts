export default class Configs{
    static get MAX_DROP_AMOUNT(): number { return 30; }
    static get DROP_INTERVAL(): number { return 0.3; }
    static get EYES_AMOUNT(): number { return 5; } 
    static get FACES_AMOUNT(): number { return 5; } 
    static get DROP_STRENGTH(): number { return 0.1; }
}

export enum SizeTypes {
    Small = 0,
    SlightlySmall,
    Normal,
    SligthlyBig,
    Big
}
