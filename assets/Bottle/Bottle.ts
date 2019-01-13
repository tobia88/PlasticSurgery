import Drop from "../Drop/Drop"
import Configs from "../Config";
import Mathf from "../Mathf";
import GameMng from "../GameMng";
import DataMng from "../DataMng";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bottle extends cc.Component {
    @property(cc.Prefab)
    dropPrefab: cc.Prefab = null;

    @property(cc.Sprite)
    bottleSpr: cc.Sprite = null;

    @property(cc.Sprite)
    fillSpr: cc.Sprite = null;

    @property
    type: string = "";

    @property
    sign: number = 1;

    _gameMng: GameMng = null;
    _dataMng: DataMng = null;

    _isPicked: boolean = false;
    _dropAmount: number = 0;
    _maxDropAmount: number = 0;

    _dropTimer: number = 0;
    _dropValue: number = 0;
    _rigidbody: cc.RigidBody;

    get isPicked () {
        return this._isPicked;
    }

    @property
    set isPicked (value: boolean) {

        this._isPicked = value;

        this._rigidbody.enabled = !(this._isPicked);

        // this.node.angle = (this._isPicked) ? 180 : 0;
    }

    get dropAmount () {
        return this._dropAmount;
    }

    @property
    set dropAmount (value: number) {
        value = Math.max(0, value);
        if (this._dropAmount != value) {
            this._dropAmount = value;
            this._updateFill();
        }
    }

    init(gameMng: GameMng, type: string, sign: number, start: cc.Vec2) : void {
        this._gameMng = gameMng;
        this._dataMng = this._gameMng.dataMng;

        this.type = type;
        this.sign = sign;
        
        this._rigidbody = this.node.getComponent(cc.RigidBody);
        
        this.updateView();

        this._maxDropAmount = Configs.MAX_DROP_AMOUNT;
        this._dropValue = 1 / this._maxDropAmount;

        this.reset();
    }

    updateView() : void {
        this.bottleSpr.spriteFrame = this._dataMng.getBottleBodyImg(this.type, this.sign);
        this.fillSpr.spriteFrame = this._dataMng.getBottleFillImg(this.type, this.sign);
    }

    reset() : void {
        this.dropAmount = this._maxDropAmount;
        this.node.angle = 0;
    }

    _updateFill() : void {
        let rate = this._dropAmount / this._maxDropAmount
        this.fillSpr.fillRange = rate;
    }

    onUpdate(delta: number) : void {
        if (this._dropAmount <= 0)
            return;

        if (this.node.angle < 0)
            this.node.angle += 360;
        else if (this.node.angle > 360)
            this.node.angle %= 360;

        cc.log("Bottle Angle: " + this.node.angle);

        if (this.isPicked) {
            
        }

        if (this.node.angle < 90 || this.node.angle > 270) {
            return;
        }

        this._dropTimer -= delta;

        if (this._dropTimer <= 0) {
            this._dropTimer = Configs.DROP_INTERVAL;
            this._spawnDrop();
        }
    }

    _spawnDrop(): void {
        let node = cc.instantiate(this.dropPrefab);
        let rad = (this.node.angle + 90) * Mathf.deg2Rad;
        let dist = cc.v2(Math.cos(rad), Math.sin(rad)).mul(50);
        node.position = this.node.position.add(dist);

        let drop = node.getComponent(Drop);
        drop.init(this.type, this._dropValue * this.sign);

        this.node.parent.addChild(node);
        this.dropAmount--;
    }
}