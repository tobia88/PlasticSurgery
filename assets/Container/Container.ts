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

const {ccclass, property} = cc._decorator;

@ccclass
export default class Container extends cc.Component {
    map: Object = {}
    
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let drop = other.getComponent(Drop);

        if (drop == null)
            return;

        if (this.map[drop.type] == undefined)
        {
            this.map[drop.type] = 1;
        }
        else
        {
            this.map[drop.type] ++;
        }

        cc.log(this.map);

        this.node.emit("onCatchDrop", other);
    }
}
