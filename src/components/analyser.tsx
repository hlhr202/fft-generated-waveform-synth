import { autorun } from "mobx";
import { useRef } from "react";
import { useEffectOnce } from "react-use";
import { oscState } from "../states/osc.state";

// Get the device pixel ratio, falling back to 1.
const dpr = window.devicePixelRatio || 1;

function setupCanvas(canvas: HTMLCanvasElement) {
    // Get the size of the canvas in CSS pixels.
    const rect = canvas.getBoundingClientRect();
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d")!;
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    ctx.scale(dpr, dpr);
    return ctx;
}

function drawWave(analyser: AnalyserNode, canvasCtx: CanvasRenderingContext2D) {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const w = canvasCtx.canvas.width / dpr;
    const h = canvasCtx.canvas.height / dpr;
    canvasCtx.clearRect(0, 0, w, h);

    (function loop() {
        analyser.getByteTimeDomainData(dataArray);
        canvasCtx.clearRect(0, 0, w, h);
        canvasCtx.fillStyle = "rgb(0, 0, 0, 0)";
        canvasCtx.fillRect(0, 0, w, h);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "rgb(69, 140, 255)";
        canvasCtx.beginPath();
        const sliceWidth = (w * 1.0) / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i += 1) {
            const v = dataArray[i] / 128.0;
            const y = (v * h) / 2;

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }
        canvasCtx.lineTo(w, h / 2);
        canvasCtx.stroke();
        if (oscState.started) requestAnimationFrame(loop);
    })();
}

export function Analyser({ analyzerNode }: { analyzerNode: AnalyserNode }) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffectOnce(() => {
        const ctx = setupCanvas(ref.current!);
        return autorun(() => {
            if (oscState.started) {
                drawWave(analyzerNode, ctx!);
            }
        });
    });

    return <canvas ref={ref} style={{ width: "100%", height: "300px" }} />;
}
