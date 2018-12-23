import Bottle from "./Bottle/Bottle";
import Container from "./Container/Container";
import Drop from "./Drop/Drop"
import People from "./People/People";
import Configs, { Sizes } from "./Config";

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
export default class GameMng extends cc.Component {

    touchJoint: cc.MouseJoint;
    currentBottle: Bottle;
    container: Container;
    people: People;

    level: number;

    onLoad() {
        this._initContainer();
        this._initPeople();

        let collision = cc.director.getCollisionManager();
        collision.enabled = true;

        let physics = cc.director.getPhysicsManager();
        physics.enabled = true;
        physics.gravity = cc.v2(0, -500);
        physics.debugDrawFlags = cc.PhysicsManager.DrawBits.e_shapeBit;

        let width = this.node.width;
        let height = this.node.height;

        this._initTouch(width, height);
        this.gameStart();
    }

    gameStart() {
        this.setupStage();
    }

    setupStage() {
        this.level++;
        this.generateFace();
    }

    generateFace() {
        let faceIndex:number = Math.random() * 5;
        this.people.setFace(Sizes[faceIndex]);
    }

    _initContainer() {
        this.container = this.node.getComponentInChildren(Container);
        this.container.node.on("onCatchDrop", this._onContainerCatchDrop, this);
    }

    _initPeople() {
        this.people = this.node.getComponentInChildren(People);
        this.people.show(false);
    }

    _onContainerCatchDrop(msg: cc.Collider) {
        msg.node.destroy();
    }

    _initTouch(width: number, height: number) {
        let node = new cc.Node();
        let body = node.addComponent(cc.RigidBody);
        body.type = cc.RigidBodyType.Static;

        this.touchJoint = node.addComponent(cc.MouseJoint);
        this.touchJoint.mouseRegion = this.node;

        this._addBound(node, 0, height * 0.5, width, 20);
        this._addBound(node, 0, -height * 0.5, width, 20);
        this._addBound(node, width * 0.5, 0, 20, height);
        this._addBound(node, -width * 0.5, 0, 20, height);

        node.parent = this.node;

        this.node.on("touchstart", this._touchStart, this);
        this.node.on("touchend", this._touchEnd, this);
    }

    _touchStart(e: cc.Event.EventTouch) {
        var connected = this.touchJoint.connectedBody;
        if (connected != null) {
            this.currentBottle = connected.getComponent(Bottle);
            this.currentBottle.isPicked = true;
        }
    }

    _touchEnd(e: cc.Event.EventTouch) {
        if (this.currentBottle != null)
            this.currentBottle.isPicked = false;

        this.currentBottle = null;
    }

    _addBound(node: cc.Node, x: number, y: number, width: number, height: number) {
        let col = node.addComponent(cc.PhysicsBoxCollider);
        col.offset.x = x;
        col.offset.y = y;
        col.size.width = width;
        col.size.height = height;
    }

    // update (dt) {}
}
