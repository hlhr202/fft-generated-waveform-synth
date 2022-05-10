import { autorun } from "mobx";
import { INITIAL_FREQ } from "../lib/constants";
import { combineDispose } from "../lib/mobx-combine-dispose";
import { oscState } from "./osc.state";

export class AudioState {
    ctx = new AudioContext();

    osc = this.ctx.createOscillator();

    wav?: PeriodicWave;

    gain = this.ctx.createGain();

    analyzer = this.ctx.createAnalyser();

    setWaveForm = (real: Iterable<number>, imag: Iterable<number>) => {
        // this.osc.type = "sawtooth"
        this.wav = this.ctx.createPeriodicWave(real, imag, {
            disableNormalization: false,
        });
        this.osc.setPeriodicWave(this.wav);
    };

    run = () => {
        this.osc.start(0);
        this.osc.connect(this.gain);
        this.gain.connect(this.analyzer);
        this.analyzer.connect(this.ctx.destination);
        this.osc.frequency.value = INITIAL_FREQ;
        return combineDispose([
            autorun(() => {
                if (oscState.started) {
                    this.ctx.resume();
                    this.analyzer.connect(this.ctx.destination);
                } else {
                    this.analyzer.disconnect();
                }
            }),
            autorun(() => {
                this.osc.frequency.value = oscState.freq;
            }),
        ]);
    };
}

export const audioState = new AudioState();
