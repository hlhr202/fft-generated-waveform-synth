/* eslint-disable */

export declare class DFT {
    constructor(bufferSize: number, sampleRate: number);
    forward(signal: any): void;
    spectrum: Float64Array;
}

export declare class FFT {
    constructor(bufferSize: number, sampleRate: number);
    forward(signal: any): void;
    spectrum: Float64Array;
}

export declare class Oscillator {
    constructor(
        type: number,
        frequency: number,
        amplitude: number,
        bufferSize: number,
        sampleRate: number
    );
    generate(): void;
}

export declare const DSP: { [x: string]: number };
