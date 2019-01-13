import GameMng, { FaceInfo } from "../GameMng";
import DataMng from "../DataMng";

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
export default class Report extends cc.Component {

    gameMng: GameMng;
    dataMng: DataMng;

    _eyesSpr: cc.Sprite = null;
    _faceSpr: cc.Sprite = null;
    _nameLabel: cc.Label = null;
    _occLabel: cc.Label = null;

    init(gameMng: GameMng) : void {
        this.gameMng = gameMng;
        this.dataMng = this.gameMng.dataMng;

        this._eyesSpr = this.node.getChildByName("eyes").getComponent(cc.Sprite);
        this._faceSpr = this.node.getChildByName("face").getComponent(cc.Sprite);
        this._nameLabel = this.node.getChildByName("nameLabel").getComponent(cc.Label);
        this._occLabel = this.node.getChildByName("occLabel").getComponent(cc.Label);
    }

    setFace(faceInfo: FaceInfo) : void {
        this._faceSpr.spriteFrame = this.dataMng.getFeatureByValue("face", faceInfo.faceValue);
        this._eyesSpr.spriteFrame = this.dataMng.getFeatureByValue("eyes", faceInfo.eyesValue);
    }
}
