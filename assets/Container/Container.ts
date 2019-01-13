// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Drop from "../Drop/Drop";
import { FaceInfo } from "../GameMng";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Container extends cc.Component {
    map: Object = {}
    faceInfo: FaceInfo = new FaceInfo();
    
    @property(cc.Animation)
    sprayAnimation: cc.Animation = null;

    init(): void {
        this.sprayAnimation.play("idle");
    }

    reset() {
        this.faceInfo.reset();
    }

    
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let drop = other.getComponent(Drop);

        if (drop == null)
            return;

        cc.log("Drop Type: " + drop.type);

        this.faceInfo.add(drop.type, drop.value);
        
        cc.log("Container value: " + this.faceInfo.toString());

        this.node.emit("onCatchDrop", drop);
    }
}
