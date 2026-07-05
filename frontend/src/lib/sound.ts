const AudioCtx = typeof window !== "undefined" ? (window.AudioContext || (window as any).webkitAudioContext) : null;

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx && AudioCtx) ctx = new AudioCtx();
  return ctx!;
}

function playTone(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.15) {
  try {
    const c = getCtx();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime);
    gain.gain.setValueAtTime(volume, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + duration);
  } catch {
    // Audio not available
  }
}

export function playClick() {
  playTone(800, 0.08, "sine", 0.1);
}

export function playStart() {
  playTone(400, 0.15, "sine", 0.12);
  setTimeout(() => playTone(600, 0.15, "sine", 0.12), 100);
}

export function playCorrect() {
  playTone(523, 0.1, "sine", 0.15);
  setTimeout(() => playTone(659, 0.1, "sine", 0.15), 100);
  setTimeout(() => playTone(784, 0.2, "sine", 0.15), 200);
}

export function playWrong() {
  playTone(200, 0.3, "sawtooth", 0.08);
}

export function playTimerWarning() {
  playTone(440, 0.08, "square", 0.06);
}

export function playFanfare() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, "sine", 0.12), i * 150);
  });
}

export function playReveal() {
  playTone(300, 0.4, "sine", 0.08);
}
