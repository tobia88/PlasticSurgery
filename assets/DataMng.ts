import GameMng from "./GameMng";
import Mathf from "./Mathf";
import Configs from "./Config";
import DataUtility from "./DataUtility";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class DataMng extends cc.Component {
    faceImages: cc.Texture2D[];

    prefix: string = "images/";

    load() : void {
        var self = this;

        cc.loader.loadResDir(
            this.prefix,
            cc.SpriteFrame,

            function (c: number, t: number, item: any) {
                self.node.emit("onLoadProgress", c, t, item);
            },

            function (e: Error, rsc: any[], url: string[]) {
                self.node.emit("onLoadComplete", e, rsc, url);
            }
        );
    }

    getFeatureByValue(feature: string, value: number) : cc.SpriteFrame{
        let index: number = this.getIndexByValue(feature, value);
        let url: string = this.prefix + index + "-" + feature;
        cc.log("Loading URL: " + url);
        return cc.loader.getRes(url, cc.SpriteFrame);
    }

    getIndexByValue(feature: string, value: number) : number {
        value = Mathf.clamp01(value);
        let amount = DataUtility.featureToAmount(feature);
        if (amount == -1)
        {
            console.error(feature + " assets is not existed");
            return -1;
        }
        return Math.min(Math.floor(value * amount), amount - 1);
    }

    getBottleBodyImg(type: string, sign: number): cc.SpriteFrame {
        let url: string = this.prefix + "bottle_" + type + "_body_" + this.getFuncBySign(sign);
        let retval: cc.SpriteFrame = cc.loader.getRes(url, cc.SpriteFrame);
        console.log("Load bottle body image: " + url);
        console.log("Result: " + retval);
        return retval;
    }

    getBottleFillImg(type: string, sign: number): cc.SpriteFrame {
        let url = this.prefix + "bottle_" + type + "_fill_" + this.getFuncBySign(sign);
        let retval: cc.SpriteFrame = cc.loader.getRes(url, cc.SpriteFrame);
        console.log("Load bottle fill image: " + url);
        console.log("Result: " + retval);
        return retval;
    }

    getFuncBySign(sign: number): string {
        return (sign == 1) ? "big" : "small";
    }
}