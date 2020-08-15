// https://medium.com/@mario.brendel1990/vue-3-the-new-store-a7569d4a546f
// Mario Brendel

// I assume this license is public domain?

import {reactive, readonly} from 'vue';


export abstract class Store<T extends Object> {
    protected state: T;

    constructor() {
        let data = this.data();
        this.setup(data);
        this.state = reactive(data) as T;
    }

    protected abstract data(): T

    protected setup(data: T): void {}

    public getState(): T {
        return readonly(this.state) as T
    }
}