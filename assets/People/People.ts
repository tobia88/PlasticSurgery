import GameMng from "../GameMng";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class People extends cc.Component {
    gameMng: GameMng;
    faceSpr: cc.Sprite;
    eyesSpr: cc.Sprite;

    show(value:boolean){
        // this.isValid = value;
    }

    init(gameMng: GameMng){
        this.gameMng = gameMng;
        this.faceSpr = this.node.getChildByName("face").getComponent(cc.Sprite);
        this.eyesSpr = this.node.getChildByName("eyes").getComponent(cc.Sprite);
    }

    setFace(image:cc.SpriteFrame)
    {
        this.faceSpr.spriteFrame = image;
    }
}
