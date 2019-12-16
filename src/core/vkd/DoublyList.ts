/**
 * 双向链表类
 */
class DoublyList {
    private _head: Node;
    private _tail: Node = null;
    private _length: number = 0;

    public get tail(): Node {
        return this._tail;
    }
    public set tail(value: Node) {
        this._tail = value;
    }
    public get head(): Node {
        return this._head;
    }
    public set head(value: Node) {
        this._head = value;
    }
    public get length(): number {
        return this._length;
    }
    public set length(value: number) {
        this._length = value;
    }

    constructor() {
        this._head = null;
        this._tail = null;
        this._length = 0;
    }

    /**
     * 索引越界判断
     * @param index 
     */
    private outEdge(index: number) {
        return index >= 0 && index < this._length;
    }

    /**
     * 向结尾添加节点
     * @param data 
     */
    private addTail(data: unknown) {
        let _node = new Node(data);
        _node.previous = this._tail;
        this._tail.next = _node;
        this._tail = _node;
        this._length++;
    }

    /**
     * 检查当前链表是否为空
     */
    private empty() {
        return this._length === 0;
    }

    /**
     * 初始化链表
     * @param data 
     */
    private initializeList(data: unknown) {
        let node = new Node(data);
        this._head = node;
        this._tail = node;
        this._length++;
    }

    /**
     * 尾添加
     * @param data 
     */
    append(...values: unknown[]) {
        values.forEach((data: unknown) => {
            if (this.empty()) {
                return this.initializeList(data);
            }
            return this.addTail(data);
        })
        return this;
    }

    /**
     * 通过索引向链表中插入Node
     * @param data 
     * @param index 
     */
    insert(data: unknown, index: number) {
        let _newNode = new Node(data);
        let _currentNode = this.getNodeByIndex(index);

        if (!_currentNode) return;
        _newNode.next = _currentNode.next;
        _newNode.previous = _currentNode;
        _newNode.next.previous = _newNode;
        _currentNode.next = _newNode;
        this._length++;
    }

    /**
     * 通过index从链表中获node
     * @param index 
     */
    getNodeByIndex(index: number): Node {
        if (!this.outEdge(index)) {
            return null;
        }

        let count: number, resultNode: Node = null;

        if (index < this._length / 2) {
            count = 0;
            resultNode = this._head;
            while (index !== count) {
                resultNode = resultNode.next;
                count++;
            }
        } else {
            count = this._length - (index + 1);
            resultNode = this._tail;
            while (count !== 0) {
                resultNode = resultNode.previous;
                count--;
            }
        }

        return resultNode
    }

    /**
     * 获取第一个包含有效value的node
     * @param index 
     * @param dircet 
     * @param confidition data filter
     */
    getFirstVailNode(index: number, dircet: 'right' | 'left', confidition: Function) {
        let _currentNode = this.getNodeByIndex(index);
        if (!_currentNode) return null;
        if (confidition(_currentNode.data)) return _currentNode;

        let findNode = () => {
            if (dircet === 'right') {
                if (_currentNode.next === null) {
                    _currentNode = null;
                    return;
                } else {
                    _currentNode = _currentNode.next;
                }
            } else {
                if (_currentNode.previous === null) {
                    _currentNode = null;
                    return;
                } else {
                    _currentNode = _currentNode.previous;
                }
            }

            if (_currentNode.data === null) {
                findNode();
            }
        }

        findNode();

        return _currentNode;
    }

}

class Node {
    private _previous: Node;
    private _next: Node;
    private _data: unknown = null;

    get previous() {
        return this._previous;
    }

    set previous(value: Node) {
        this._previous = value;
    }

    get next() {
        return this._next;
    }

    set next(value: Node) {
        this._next = value;
    }

    get data() {
        return this._data;
    }

    set data(value: unknown) {
        this._data = value;
    }

    constructor(data: unknown) {
        this._data = data;
        this._previous = null;
        this._next = null;
    }
}

export default DoublyList