import Stream from "../../Stream";
import BasePES from './BasePES';

class TSPackageTSDT extends BasePES{
    constructor(stream: Stream) {
        super(stream);
        this.parse();
    }

    parse(){}
}

export default TSPackageTSDT;