import Bottle from "./Bottle/Bottle";
import Container from "./Container/Container";
import People from "./People/People";
import DataMng from "./DataMng";
import ConfirmBtn from "./ConfirmBtn/ConfirmBtn";
import Mathf, { Random } from "./Mathf";
import Report from "./Report/Report";

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

export enum GameStates {
    Null,
    StartGame,
    RoundStart,
    Playing,
    RoundEnd,
    GameOver
}

export class FaceInfo {
    faceValue = 0;
    eyesValue = 0;

    add(type, v) {
        switch(type) {
            case "face": this.faceValue += v; return;
            case "eyes": this.eyesValue += v; return;
        }
    }

    reset() {
        this.faceValue = 0;
        this.eyesValue = 0;
    }

    random() {
        this.faceValue = Math.random();
        this.eyesValue = Math.random();
    }

    clamp() {
        this.faceValue = Mathf.clamp01(this.faceValue);
        this.eyesValue = Mathf.clamp01(this.eyesValue);
    }

    toString() : string {
        return "Face: " + this.faceValue + ", " +
               "Eyes: " + this.eyesValue
    }
}

@ccclass
export default class GameMng extends cc.Component {

    @property(cc.Prefab)
    bottlePrefab: Bottle = null;

    touchJoint: cc.MouseJoint;
    currentBottle: Bottle;
    container: Container;
    people: People;
    report: Report;
    dataMng: DataMng;
    confirmBtn: ConfirmBtn;
    bottles: Array<Bottle> = new Array<Bottle>();

    level: number;

    maxTimer: number = 10;
    timerDecPerRound: number = 0.5;
    minTimer: number = 5;

    _bottleContainer: cc.Node = null;
    _spawnBottlePoints: cc.Node[] = null;

    _crtMaxTimer: number = 0;
    _crtTimer: number = 0;

    _crtFaceInfo: FaceInfo = null;
    _trendFaceInfo: FaceInfo = null;
    _targetFaceInfo: FaceInfo = null;

    _gameState: GameStates;
    _timerDelayToStartGame: number;

    get gameState() { return this._gameState; }
    set gameState(value: GameStates) {
        if (this._gameState != value) {
            this._gameState = value;
            console.log("Current Game State: " + GameStates[this._gameState]);
            switch (this._gameState) {
                case GameStates.StartGame:
                    this.updateTrend();
                    this.gameState = GameStates.RoundStart;
                    break;

                case GameStates.RoundStart:
                    this.generatePatience();
                    this.container.reset();
                    this.bottles.forEach(b => {
                        b.reset();
                    });
                    // Animate patience in
                    this.gameState = GameStates.Playing;
                    break;

                case GameStates.RoundEnd:
                    // Animate patience leave
                    this._crtMaxTimer -= this.timerDecPerRound;
                    this._crtMaxTimer = Math.max(this._crtMaxTimer, this.minTimer);
                    this._crtTimer = this._crtMaxTimer;
                    this.people.add(this.container.faceInfo);
                    this._timerDelayToStartGame = 5;
                    cc.log("Check Result");
            }
        }
    }


    onLoad() : void {
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

    onLoadProgress(completeCount: number, totalCount: number, item: any) : void {
        cc.log("Loading " + item + ", progress: " + (completeCount / totalCount));
    }

    onLoadComplete(error: Error, rsc: any[], urls: string[]) : void {
        cc.log("Finish loaded: " + urls);
        this.dataMng.node.off("onLoadProgress", this.onLoadProgress, this);
        this.dataMng.node.off("onLoadComplete", this.onLoadComplete, this);
        this.init();
    }

    init() : void {
        cc.log("Initialize...");

        this._initConfirmBtn();
        this._initContainer();
        this._initBottles();
        this._initPeople();
        this._initReport();

        let width = this.node.width;
        let height = this.node.height;

        this._crtTimer = this._crtMaxTimer = this.maxTimer;

        this._initTouchBound(width, height);

        this._crtFaceInfo = new FaceInfo();
        this._targetFaceInfo = new FaceInfo();

        this.gameState = GameStates.StartGame;
    }

    _initConfirmBtn() : void {
        this.confirmBtn = this.node.getComponentInChildren(ConfirmBtn);
        this.confirmBtn.init();
        this.confirmBtn.node.on("confirm", this.onConfirm, this);
    }

    onConfirm() : void {
        this.gameState = GameStates.RoundEnd;
        cc.log("Confirmed");
    }

    update(delta: number) : void {
        switch (this.gameState) {
            case GameStates.Playing: this.onPlayingUpdate(delta); return;
            case GameStates.RoundEnd: this.onRoundEndUpdate(delta); return;
        }
    }

    onPlayingUpdate(delta: number): void {
        this._crtTimer -= delta;

        this.bottles.forEach(b => {
            b.onUpdate(delta);
        });

        // if (this._crtTimer <= 0) {
        //     this.gameState = GameStates.RoundEnd;
        // }

    }

    onRoundEndUpdate(delta: number): void {
        this._timerDelayToStartGame -= delta;
        if (this._timerDelayToStartGame <= 0) {
            this.gameState = GameStates.RoundStart;
        }

    }

    generatePatience() : void {
        this.level++;

        if (this.level % 5 == 0) {
            this.updateTrend();
        }

        this.generateFace();
    }

    updateTrend() : void {
        this._targetFaceInfo.random();
    }

    generateFace() : void {
        this._crtFaceInfo.random();
        this.people.set(this._crtFaceInfo);
        this.report.setFace(this._targetFaceInfo);
    }

    _initBottles() : void {
        this._spawnBottlePoints = [
            this.node.getChildByName("bottleSpawnPointA"),
            this.node.getChildByName("bottleSpawnPointB")
        ]
        this._spawnBottlePoints[0] = this.node.getChildByName("bottleSpawnPointA");
        this._spawnBottlePoints[1] = this.node.getChildByName("bottleSpawnPointB");

        this._bottleContainer = this.node.getChildByName("bottleContainer");

        this.addBottle("eyes", 1, this._spawnBottlePoints[0]);
        this.addBottle("eyes", -1, this._spawnBottlePoints[0]);
        this.addBottle("face", 1, this._spawnBottlePoints[1]);
        this.addBottle("face", -1, this._spawnBottlePoints[1]);
    }

    addBottle(type: string, sign: number, start: cc.Node): void {
        let tmpBot: Bottle = cc.instantiate(this.bottlePrefab).getComponent(Bottle);
        tmpBot.init(this, type, sign, start.position);
        this._bottleContainer.addChild(tmpBot.node);
        this.bottles.push(tmpBot);
    }

    _initContainer(): void {
        this.container = this.node.getComponentInChildren(Container);
        this.container.node.on("onCatchDrop", this._onContainerCatchDrop, this);
        this.container.init();
    }

    _initPeople(): void {
        this.people = this.node.getComponentInChildren(People);
        this.people.init(this);
    }

    _initReport(): void {
        this.report = this.node.getComponentInChildren(Report);
        this.report.init(this);
    }

    _onContainerCatchDrop(msg: cc.Collider): void {
        msg.node.destroy();
    }

    _initTouchBound(width: number, height: number): void {
        let node = new cc.Node();
        // let body = node.addComponent(cc.RigidBody);
        // body.type = cc.RigidBodyType.Static;

        this.touchJoint = node.addComponent(cc.MouseJoint);
        this.touchJoint.mouseRegion = this.node;

        // this._addBound(node, 0, height * 0.5, width, 20);
        // this._addBound(node, 0, -height * 0.5, width, 20);
        // this._addBound(node, width * 0.5, 0, 20, height);
        // this._addBound(node, -width * 0.5, 0, 20, height);

        this.node.insertChild(node, 0);

        this.node.on("touchstart", this._touchStart, this);
        this.node.on("touchend", this._touchEnd, this);
    }

    _touchStart(e: cc.Event.EventTouch): void {
        var connected = this.touchJoint.connectedBody;
        if (connected != null) {
            var btl = connected.getComponent(Bottle);
            if (btl == null)
                return;

            this.currentBottle = btl;
            this.currentBottle.isPicked = true;
        }
    }

    _touchEnd(e: cc.Event.EventTouch): void {
        if (this.currentBottle != null)
            this.currentBottle.isPicked = false;

        this.currentBottle = null;
        this.touchJoint.connectedBody = null;
    }

    // _addBound(node: cc.Node, x: number, y: number, width: number, height: number): void {
    //     let col = node.addComponent(cc.PhysicsBoxCollider);
    //     col.offset.x = x;
    //     col.offset.y = y;
    //     col.size.width = width;
    //     col.size.height = height;
    // }
}
