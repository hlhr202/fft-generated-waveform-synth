import { makeAutoObservable } from "mobx";
import { INITIAL_FREQ } from "../lib/constants";

export class OscState {
    freq = INITIAL_FREQ;

    started = false;

    constructor() {
        makeAutoObservable(this);
    }

    toggleStart = () => {
        this.started = !this.started;
    };

    changeFreq = (value: number) => {
        this.freq = value;
    };
}

export const oscState = new OscState();
