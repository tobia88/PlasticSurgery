import GameMng, { FaceInfo } from "../GameMng";
import DataMng from "../DataMng";
import Mathf from "../Mathf";

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
    dataMng: DataMng;

    faceSpr: cc.Sprite;
    eyesSpr: cc.Sprite;
    faceInfo: FaceInfo;

    show(value:boolean) : void {
        // this.isValid = value;
    }

    init(gameMng: GameMng) : void {
        this.gameMng = gameMng;
        this.dataMng = this.gameMng.dataMng;
        
        this.faceSpr = this.node.getChildByName("face").getComponent(cc.Sprite);
        this.eyesSpr = this.node.getChildByName("eyes").getComponent(cc.Sprite);

        this.faceInfo = new FaceInfo();
    }

    add(faceInfo: FaceInfo) : void {
        this.faceInfo.eyesValue += faceInfo.eyesValue;
        this.faceInfo.faceValue += faceInfo.faceValue;
        this.faceInfo.clamp();

        console.log("People result values: " + this.faceInfo.toString());

        this.updateFace();
    }

    set(faceInfo: FaceInfo) : void {
        this.faceInfo.faceValue = faceInfo.faceValue;
        this.faceInfo.eyesValue = faceInfo.eyesValue;
        this.updateFace();
    }

    updateFace() {
        this.faceSpr.spriteFrame = this.dataMng.getFeatureByValue("face", this.faceInfo.faceValue);
        this.eyesSpr.spriteFrame = this.dataMng.getFeatureByValue("eyes", this.faceInfo.eyesValue);
    }
}
