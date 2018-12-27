const {ccclass, property} = cc._decorator;

@ccclass
export default class Drop extends cc.Component {
    type: number = 0;

    init(type: number) {
        this.type = type;
    }
}
