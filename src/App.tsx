import "./App.css";
import { ChangeEventHandler } from "react";
import { autorun, IReactionDisposer, makeAutoObservable } from "mobx";
import { Observer } from "mobx-react";
import { useEffectOnce } from "./lib/use-effect-once";
import { FFT } from "./dsp";

const BUFFER_SIZE = 2 ** 14;
const INITIAL_FREQ = 440;

const fft = new FFT(BUFFER_SIZE, 96000);

const buffer = new Float64Array(BUFFER_SIZE)
    .fill(0)
    .map((_, idx) => ((1.0 / BUFFER_SIZE) * idx - 0.5) * 2);

console.log(buffer);

fft.forward(buffer);

const real = fft.spectrum;
const imag = new Float64Array(real.length).fill(0);

const combineDispose = (disposes: IReactionDisposer[]) => () => {
    disposes.forEach((dispose) => dispose());
};

class State {
    freq = INITIAL_FREQ;

    started = false;

    constructor() {
        makeAutoObservable(this);
    }

    toggleStart = () => {
        this.started = !this.started;
    };

    changeFreq: ChangeEventHandler<HTMLInputElement> = (e) => {
        this.freq = Number(e.target.value);
    };
}

const state = new State();

class Audio {
    ctx = new AudioContext();

    osc = this.ctx.createOscillator();

    wav = this.ctx.createPeriodicWave(real, imag, {
        disableNormalization: false,
    });

    init = () => {
        this.osc.setPeriodicWave(this.wav);
        // this.osc.type = "sawtooth";
        this.osc.frequency.value = INITIAL_FREQ;
        this.osc.start(0);
    };

    run = () =>
        combineDispose([
            autorun(() => {
                if (state.started) {
                    this.osc.connect(this.ctx.destination);
                } else {
                    this.osc.disconnect();
                }
            }),
            autorun(() => {
                this.osc.frequency.value = state.freq;
            }),
        ]);
}

const audio = new Audio();

function App() {
    useEffectOnce(() => {
        audio.init();
        audio.run();
    });

    const handleStart = () => {
        audio.ctx.resume();
        state.toggleStart();
    };

    return (
        <Observer>
            {() => (
                <>
                    <div>
                        <input
                            type="range"
                            min={20}
                            max={20000}
                            value={state.freq}
                            onChange={state.changeFreq}
                        />
                        {state.freq}
                    </div>
                    <div>
                        <button onClick={handleStart}>
                            {state.started ? "stop" : "start"}
                        </button>
                    </div>
                </>
            )}
        </Observer>
    );
}

export default App;
