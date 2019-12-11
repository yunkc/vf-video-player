/**
 * 双向链表类
 */

class DoublyList {
    private _length: number = 0;
    private _previous: DoublyList;
    private _next: DoublyList;
    private _element: unknown = null;

    constructor(element: unknown) {
        this._element = element;
        this._previous = null;
        this._next = null;
        this._length = 1;
    }

    append() { }

    insert() { }
}

export default DoublyList