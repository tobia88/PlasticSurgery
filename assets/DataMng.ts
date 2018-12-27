import GameMng from "./GameMng";

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


    load() {
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

    getFaceByIndex(index: number) {
        let url: string = this.prefix + index + "-face";
        cc.log("Loading url: " + url);
        return cc.loader.getRes(url, cc.SpriteFrame);
    }
}