const {ccclass, property} = cc._decorator;

@ccclass
export default class ConfirmBtn extends cc.Component {

    init(){
        this.node.on("touchstart", this._onMouseDown, this);
    }

    _onMouseDown(e: cc.Event.EventTouch) {
        this.node.emit("confirm");
        cc.log("On Touch Confirm Btn");
    }
}