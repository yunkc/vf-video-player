import StaticProp from "./staticProp";

class Ins {
    constructor() {
        let test1 = new StaticProp();
        test1.xx();
        let test2 = new StaticProp();
        test2.xx();
        // setInterval(() => {

        test2.xx();
        test1.xx();

        // }, 200)
    }
}

let _i = new Ins();