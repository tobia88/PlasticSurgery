const {ccclass, property} = cc._decorator;

@ccclass
export default class Drop extends cc.Component {
    type: string = null;
    value: number = 0;

    init(type: string, value: number) : void {
        this.type = type;
        this.value = value;
    }

    onBeginContact(c: cc.PhysicsContact, sc: cc.PhysicsCollider, oc: cc.PhysicsCollider) : void {
        this.node.destroy();
    }
}
