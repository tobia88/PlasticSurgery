const {ccclass, property} = cc._decorator;

@ccclass
export default class Drop extends cc.Component {
    type: string;

    init(type: string) {
        this.type = type;
    }
}
