import { RefObject, useEffect, useRef } from 'react';
import { Point, SpringState, isAtRest, stepSpring } from './spring';

// RefObject already carries the null — writing `RefObject<Card | null>` doubles it up and stops the
// ref being assignable to a `ref` prop.
interface CursorGlow<Card extends HTMLElement> {
  // The element pointer moves are read from — the card.
  cardRef: RefObject<Card>;
  // The blob that chases them.
  glowRef: RefObject<HTMLDivElement>;
}

const HOME: Point = { x: 0, y: 0 };

// The glow aims this far along the line from its corner to the cursor, so it leans toward you
// rather than sitting under you. At 1 it lands on the cursor and reads as glued to it.
const PULL: number = 0.8;

// Pulls the glow toward the cursor while it's over the card, and back to where CSS parked it once
// it leaves. Positions are offsets from that resting spot, so a card whose script never runs — a
// static story, reduced motion — is already in the right place at (0, 0).
export const useCursorGlow = <Card extends HTMLElement>(): CursorGlow<Card> => {
  const cardRef = useRef<Card | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  const spring = useRef<SpringState>({ position: HOME, velocity: HOME });
  const target = useRef<Point>(HOME);
  const frame = useRef<number | undefined>(undefined);
  const lastTime = useRef<number>(0);

  useEffect(() => {
    const card: Card | null = cardRef.current;
    const glow: HTMLDivElement | null = glowRef.current;
    if (!card || !glow) return;

    // Read once on mount. Toggling the setting mid-session is rare enough not to subscribe to.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tick = (now: number): void => {
      spring.current = stepSpring({
        state: spring.current,
        target: target.current,
        dt: (now - lastTime.current) / 1000
      });
      lastTime.current = now;

      const { x, y } = spring.current.position;
      glow.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;

      // Nothing left to draw until the next pointer event moves the target.
      if (isAtRest({ state: spring.current, target: target.current })) {
        frame.current = undefined;
        return;
      }
      frame.current = requestAnimationFrame(tick);
    };

    const start = (): void => {
      if (frame.current !== undefined) return;
      lastTime.current = performance.now();
      frame.current = requestAnimationFrame(tick);
    };

    const follow = (event: PointerEvent): void => {
      // Measured from whatever the glow is positioned against, which is the card on the landing
      // page and a sticky layer inside it on the flow canvas — a layer that moves while the card
      // stays put, so the card's own rect is the wrong origin there.
      const anchor: Element = glow.offsetParent ?? card;
      const bounds: DOMRect = anchor.getBoundingClientRect();
      // offsetLeft/offsetTop are layout, untouched by the translate above — so the resting center
      // stays whatever the utility classes on the glow say it is.
      target.current = {
        x: (event.clientX - bounds.left - (glow.offsetLeft + glow.offsetWidth / 2)) * PULL,
        y: (event.clientY - bounds.top - (glow.offsetTop + glow.offsetHeight / 2)) * PULL
      };
      start();
    };

    const goHome = (): void => {
      target.current = HOME;
      start();
    };

    card.addEventListener('pointermove', follow);
    card.addEventListener('pointerleave', goHome);
    // Touch ends without a pointerleave, which would strand the glow under the last finger.
    card.addEventListener('pointercancel', goHome);

    return () => {
      card.removeEventListener('pointermove', follow);
      card.removeEventListener('pointerleave', goHome);
      card.removeEventListener('pointercancel', goHome);

      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
      frame.current = undefined;
      spring.current = { position: HOME, velocity: HOME };
      target.current = HOME;
      glow.style.translate = '';
    };
  }, []);

  return { cardRef, glowRef };
};
