export default class StaticProp {
    static gen: number = Math.random();


    constructor() {
        Object.defineProperty(StaticProp, 'gen', {
            writable: false
        });
    }

    public xx() {
        console.log(StaticProp.gen);
        console.log('------------')
    }
}

