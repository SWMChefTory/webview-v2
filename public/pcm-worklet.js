/**
 * PCM Worklet - Float32 -> Int16 + chunking (40ms @ 16kHz)
 *
 * AudioContext({ sampleRate: 16000 }) => browser resamples 48kHz -> 16kHz internally.
 * This worklet only converts float -> int16 and chunks into 640-sample frames.
 */
class Pcm16kWorklet extends AudioWorkletProcessor {
  constructor() {
    super();
    this.chunkSamples = 640; // 40ms @ 16kHz
    this.out = new Int16Array(this.chunkSamples);
    this.outIndex = 0;
  }

  floatToInt16(x) {
    const s = Math.max(-1, Math.min(1, x));
    return s < 0 ? (s * 0x8000) | 0 : (s * 0x7fff) | 0;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;
    const ch0 = input[0];
    if (!ch0) return true;

    for (let i = 0; i < ch0.length; i++) {
      this.out[this.outIndex++] = this.floatToInt16(ch0[i]);

      if (this.outIndex >= this.chunkSamples) {
        this.port.postMessage(this.out.buffer, [this.out.buffer]);
        this.out = new Int16Array(this.chunkSamples);
        this.outIndex = 0;
      }
    }

    return true;
  }
}

registerProcessor("pcm-worklet", Pcm16kWorklet);
