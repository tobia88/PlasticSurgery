import "../Drop/Drop"
import Configs from "../Config";
import Mathf from "../Mathf";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bottle extends cc.Component {
    @property(cc.Prefab)
    dropPrefab: cc.Prefab = null;

    _isPicked: boolean = false;
    _dropAmount: number = 0;
    _maxDropAmount: number = 0;

    _fillSpr: cc.Sprite = null;
    _dropTimer: number = 0;

    get isPicked () {
        return this._isPicked;
    }

    @property
    set isPicked (value: boolean) {
        this._isPicked = value;

        this.node.angle = (this._isPicked) ? 180 : 0;
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

    onLoad() {
        this._maxDropAmount = Configs.MAX_DROP_AMOUNT;
        this._fillSpr = this.node.getChildByName("bottle_fill")
                                 .getComponent(cc.Sprite);

        this.reset();
    }

    reset() {
        this.dropAmount = this._maxDropAmount;
    }

    _updateFill() {
        let rate = this._dropAmount / this._maxDropAmount
        cc.log("Fill Rate: " + rate);
        this._fillSpr.fillRange = rate;
    }

    update(delta: number) {
        if (!this._isPicked || this._dropAmount <= 0)
            return;

        this._dropTimer -= delta;

        if (this._dropTimer <= 0) {
            this._dropTimer = Configs.DROP_INTERVAL;
            this.spawnDrop();
        }
    }

    spawnDrop() {
        let drop = cc.instantiate(this.dropPrefab);
        let rad = (this.node.angle + 90) * Mathf.deg2Rad;
        let dist = cc.v2(Math.cos(rad), Math.sin(rad)).mul(50);
        // randomize position

        drop.position = this.node.position.add(dist);
        this.node.parent.addChild(drop);
        this.dropAmount --;
    }
}