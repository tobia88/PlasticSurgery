export default class Mathf {
    static get deg2Rad() : number {
        return 0.01745329251; 
    }

    static get rad2deg() : number {
        return 57.2957795131;
    }

    static clamp(value: number, min: number, max: number) : number {
        if (value > max) return max;
        if (value < min) return min;
        return value;
    }

    static clamp01(value: number) {
        return this.clamp(value, 0, 1);
    }
}

export class Random {
    static RangeToInt(min: number, max: number) : number {
        let range = max - min;
        let random = Math.random() * range;
        let retval = min + Math.floor(random);
        return retval;
    }
}