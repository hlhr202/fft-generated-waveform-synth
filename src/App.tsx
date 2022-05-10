import { Observer } from "mobx-react";
import { Button, Card, Col, Layout, Row, Slider } from "antd";
import { PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { useEffectOnce } from "./lib/use-effect-once";
import { FFT } from "./lib/dsp";
import { Analyser } from "./components/analyser";
import { oscState } from "./states/osc.state";
import { audioState } from "./states/audio.state";

const BUFFER_SIZE = 2 ** 14;

const fft = new FFT(BUFFER_SIZE, 96000);

const buffer = new Float64Array(BUFFER_SIZE)
    .fill(0)
    .map((_, idx) => ((1.0 / BUFFER_SIZE) * idx - 0.5) * 2);

fft.forward(buffer);

const { real, imag } = fft;

function App() {
    useEffectOnce(() => audioState.run());

    const handleStart = () => {
        if (!oscState.started) {
            audioState.setWaveForm(real, imag);
        }
        oscState.toggleStart();
    };

    return (
        <Observer>
            {() => (
                <Layout
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <Layout.Content
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "30px",
                        }}
                    >
                        <Card
                            style={{ width: "1024px" }}
                            actions={[
                                <Button
                                    size="large"
                                    type="text"
                                    onClick={handleStart}
                                    icon={
                                        oscState.started ? (
                                            <PauseCircleOutlined />
                                        ) : (
                                            <PlayCircleOutlined />
                                        )
                                    }
                                />,
                            ]}
                        >
                            <Row align="middle">
                                <Col span={3}>Frequency: {oscState.freq}</Col>
                                <Col flex={1}>
                                    <Slider
                                        min={20}
                                        max={20000}
                                        value={oscState.freq}
                                        onChange={oscState.changeFreq}
                                    />
                                </Col>
                            </Row>

                            <Analyser analyzerNode={audioState.analyzer} />
                        </Card>
                    </Layout.Content>
                </Layout>
            )}
        </Observer>
    );
}

export default App;
