/**
 * Swappable achievement sound.
 *
 * SOUND_URL points at an optional binary clip. To use a custom recording
 * (for example the clip the site owner picked from YouTube):
 *   1. Convert it to mp3.
 *   2. Save it as `public/sounds/achievement.mp3`.
 *   3. No code change is needed — playAchievementSound() picks it up automatically.
 *
 * Until that file exists, a small WebAudio-synthesized chime is used, so the
 * build ships no binary asset and no network request is wasted on a 404.
 * Sound is decorative: failures are swallowed and never block UI flows.
 */

export const SOUND_URL = "/sounds/achievement.mp3";

let fileMissing = false;

function playFile(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    audio.addEventListener("ended", () => resolve(), { once: true });
    audio.addEventListener("error", () => reject(new Error(`cannot load ${url}`)), { once: true });
    const started = audio.play();
    if (started) started.catch(reject);
  });
}

/** Original two-tone chime synthesized with WebAudio; needs no asset file. */
function playSynthChime(): void {
  const context = new AudioContext();
  void context.resume().catch(() => undefined);
  const notes: Array<[frequency: number, delaySeconds: number]> = [
    [659.25, 0], // E5
    [880.0, 0.12], // A5
    [1318.5, 0.24], // E6
  ];
  for (const [frequency, delay] of notes) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "triangle";
    const start = context.currentTime + delay;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.12, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.4);
  }
  window.setTimeout(() => void context.close().catch(() => undefined), 1500);
}

/** Plays the custom clip when present, otherwise the synthesized chime. */
export async function playAchievementSound(): Promise<void> {
  try {
    if (!fileMissing) {
      await playFile(SOUND_URL);
      return;
    }
  } catch {
    // Remember a missing file for this session; never retry a 404 in a loop.
    fileMissing = true;
  }
  try {
    playSynthChime();
  } catch {
    // Sound is decorative; never throw into UI flows.
  }
}
