import Configs from "./Config";

export default class DataUtility {
    static featureToAmount(feature: string) : number {
        if (feature == "eyes") return Configs.EYES_AMOUNT;
        if (feature == "face") return Configs.FACES_AMOUNT;
        return -1;
    }
}