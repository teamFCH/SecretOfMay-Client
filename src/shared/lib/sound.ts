import { SOUND_MUTED_STORAGE_KEY } from "@/shared/config/app";
import { readStorageItem, writeStorageItem } from "@/shared/lib/storage";

/**
 * Web Audio API 기반 사운드 엔진.
 * 브라우저 자동재생 정책을 고려해 AudioContext를 지연 초기화한다.
 */

let audioContext: AudioContext | null = null;
let muted = readStorageItem("local", SOUND_MUTED_STORAGE_KEY) === "1";

function getAudioContext() {
  if (typeof window === "undefined" || !("AudioContext" in window)) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContext();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => undefined);
  }

  return audioContext;
}

function playNote(
  context: AudioContext,
  type: OscillatorType,
  startFrequency: number,
  endFrequency: number,
  volume: number,
  duration: number,
  delay = 0,
) {
  const startAt = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(startFrequency, startAt);

  if (endFrequency !== startFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(endFrequency, 1),
      startAt + duration,
    );
  }

  gainNode.gain.setValueAtTime(volume, startAt);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startAt + duration);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.005);
}

export function tick() {
  const context = getAudioContext();

  if (!context || muted) {
    return;
  }

  playNote(context, "square", 160, 75, 0.065, 0.018);
  playNote(context, "square", 480 + Math.random() * 260, 170, 0.038, 0.013);
}

export function hover() {
  const context = getAudioContext();

  if (!context || muted) {
    return;
  }

  playNote(context, "sine", 400, 380, 0.02, 0.014);
}

export function click() {
  const context = getAudioContext();

  if (!context || muted) {
    return;
  }

  playNote(context, "square", 210, 75, 0.09, 0.04);
}

export function wordComplete() {
  const context = getAudioContext();

  if (!context || muted) {
    return;
  }

  playNote(context, "sine", 523, 523, 0.085, 0.22);
  playNote(context, "sine", 784, 784, 0.055, 0.22, 0.09);
}

export function puzzleComplete() {
  const context = getAudioContext();

  if (!context || muted) {
    return;
  }

  [523, 659, 784, 1047].forEach((frequency, index) => {
    playNote(context, "sine", frequency, frequency, 0.1, 0.28, index * 0.13);
  });
}

export function toggleMute() {
  muted = !muted;
  writeStorageItem("local", SOUND_MUTED_STORAGE_KEY, muted ? "1" : "0");
  return muted;
}

export function isMuted() {
  return muted;
}

const sound = {
  click,
  hover,
  isMuted,
  puzzleComplete,
  tick,
  toggleMute,
  wordComplete,
};

export default sound;
