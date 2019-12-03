class MathUtils {
    /**
     * 十进制转十六进制
     */
    static toHex(...value: number[]): string[] {
        let hex: string[] = [];
        value.forEach((item: number) => {
            hex.push(Number(item).toString(16));
        });
        return hex;
    }

    /**
     * 多项求和
     * @param {number} valueArr
     * @returns {number}
     */
    static sum(...valueArr: number[]) {
        let count: number = 0;
        valueArr.forEach((item: number) => {
            count += item;
        });
        return count;
    }
}

export default MathUtils;