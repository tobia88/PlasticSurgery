import Bottle from "./Bottle/Bottle";
import Container from "./Container/Container";
import People from "./People/People";
import DataMng from "./DataMng";
import ConfirmBtn from "./ConfirmBtn/ConfirmBtn";

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
    dataMng: DataMng;
    confirmBtn: ConfirmBtn;

    level: number;

    onLoad() {
        let collision = cc.director.getCollisionManager();
        collision.enabled = true;

        let physics = cc.director.getPhysicsManager();
        physics.enabled = true;
        physics.gravity = cc.v2(0, -500);
        physics.debugDrawFlags = cc.PhysicsManager.DrawBits.e_shapeBit;

        this.dataMng = this.node.getComponent(DataMng);
        this.dataMng.node.on("onLoadProgress", this.onLoadProgress, this);
        this.dataMng.node.on("onLoadComplete", this.onLoadComplete, this);
        this.dataMng.load();
    }

    onLoadProgress(completeCount: number, totalCount: number, item: any) {
        cc.log("Loading " + item + ", progress: " + (completeCount / totalCount));
    }

    onLoadComplete(error: Error, rsc: any[], urls: string[]) {
        cc.log("Finish loaded: " + urls);
        this.dataMng.node.off("onLoadProgress", this.onLoadProgress, this);
        this.dataMng.node.off("onLoadComplete", this.onLoadComplete, this);
        this.init();
    }

    init() {
        cc.log("Initialize...");

        this._initConfirmBtn();
        this._initContainer();
        this._initPeople();

        let width = this.node.width;
        let height = this.node.height;

        this._initTouchBound(width, height);
        this.gameStart();
    }

    _initConfirmBtn() {
        this.confirmBtn = this.node.getComponentInChildren(ConfirmBtn);
        this.confirmBtn.init();
        this.confirmBtn.node.on("confirm", this.onConfirm, this);

    }

    onConfirm() {
        cc.log("Confirmed");
    }

    gameStart() {
        this.nextStage();
    }

    nextStage() {
        this.level++;
        this.generateFace();
    }

    generateFace() {
        let faceIndex:number = Math.floor(Math.random() * 5);
        let img: cc.SpriteFrame = this.dataMng.getFaceByIndex(faceIndex);
        this.people.setFace(img);
    }

    _initContainer() {
        this.container = this.node.getComponentInChildren(Container);
        this.container.node.on("onCatchDrop", this._onContainerCatchDrop, this);
    }

    _initPeople() {
        this.people = this.node.getComponentInChildren(People);
        this.people.init(this);
    }

    _onContainerCatchDrop(msg: cc.Collider) {
        msg.node.destroy();
    }

    _initTouchBound(width: number, height: number) {
        let node = new cc.Node();
        let body = node.addComponent(cc.RigidBody);
        body.type = cc.RigidBodyType.Static;

        this.touchJoint = node.addComponent(cc.MouseJoint);
        this.touchJoint.mouseRegion = this.node;

        this._addBound(node, 0, height * 0.5, width, 20);
        this._addBound(node, 0, -height * 0.5, width, 20);
        this._addBound(node, width * 0.5, 0, 20, height);
        this._addBound(node, -width * 0.5, 0, 20, height);

        this.node.insertChild(node, 0);

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
        this.touchJoint.connectedBody = null;
    }

    _addBound(node: cc.Node, x: number, y: number, width: number, height: number) {
        let col = node.addComponent(cc.PhysicsBoxCollider);
        col.offset.x = x;
        col.offset.y = y;
        col.size.width = width;
        col.size.height = height;
    }
}
