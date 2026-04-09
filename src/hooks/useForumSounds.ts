import { useCallback, useEffect, useRef } from "react";

let sharedCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!sharedCtx || sharedCtx.state === "closed") {
    sharedCtx = new Ctx();
  }
  return sharedCtx;
}

async function resume(ctx: AudioContext) {
  if (ctx.state === "suspended") await ctx.resume();
}

function tone(
  ctx: AudioContext,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType,
  gain: number,
  fadeOut = true,
) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
  g.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + start + 0.02);
  if (fadeOut) {
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
  }
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration + 0.05);
}

export function useForumSounds(enabled: boolean) {
  const hoverGate = useRef(0);

  const play = useCallback(
    async (kind: "tap" | "hover" | "success" | "join" | "whoosh") => {
      if (!enabled) return;
      const ctx = getCtx();
      if (!ctx) return;
      await resume(ctx);
      const t = ctx.currentTime;

      switch (kind) {
        case "tap": {
          tone(ctx, 440, 0, 0.06, "sine", 0.12);
          tone(ctx, 660, 0.015, 0.05, "sine", 0.08);
          break;
        }
        case "hover": {
          const now = performance.now();
          if (now - hoverGate.current < 120) return;
          hoverGate.current = now;
          tone(ctx, 520, 0, 0.04, "triangle", 0.035);
          break;
        }
        case "success": {
          tone(ctx, 523.25, 0, 0.12, "sine", 0.1);
          tone(ctx, 659.25, 0.08, 0.14, "sine", 0.09);
          tone(ctx, 783.99, 0.16, 0.2, "sine", 0.07);
          break;
        }
        case "join": {
          tone(ctx, 330, 0, 0.15, "sine", 0.11);
          tone(ctx, 440, 0.1, 0.18, "sine", 0.1);
          tone(ctx, 554.37, 0.22, 0.25, "sine", 0.08);
          break;
        }
        case "whoosh": {
          const noise = ctx.createBufferSource();
          const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
          }
          noise.buffer = buffer;
          const filter = ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(800, t);
          filter.frequency.exponentialRampToValueAtTime(2200, t + 0.12);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.06, t + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
          noise.connect(filter);
          filter.connect(g);
          g.connect(ctx.destination);
          noise.start(t);
          noise.stop(t + 0.16);
          break;
        }
        default:
          break;
      }
    },
    [enabled],
  );

  useEffect(() => {
    const unlock = () => {
      const ctx = getCtx();
      if (ctx?.state === "suspended") void ctx.resume();
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  return { play };
}
