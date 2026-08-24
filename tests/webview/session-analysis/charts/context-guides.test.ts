import { describe, expect, it } from 'vitest';
import { ContextReading } from '@src/model/sessions/context';
import { contextGuides, contextMax } from '@src/webview/session-analysis/charts/context-guides';

// What the top of the context chart means, which is the one number on this page that isn't read off
// a file — it's a rule balancing two things that pull opposite ways: keep the warn line on the
// chart, and don't squash the curve into the floor of a window it never came near.

interface ReadingArgs {
  tokens: number;
  warnAt?: number;
  errorAt?: number;
  window?: number;
}

const reading = ({
  tokens,
  warnAt = 200_000,
  errorAt = 300_000,
  window = 1_000_000
}: ReadingArgs): ContextReading => ({
  tokens,
  window: { tokens: window, source: 'table' },
  model: 'claude-opus-5',
  fraction: tokens / window,
  level: 'within',
  warnAt,
  errorAt,
  overWindow: tokens > window
});

describe('contextMax', () => {
  // The case the feature exists for: a small session in a big window. Scaling to the window would
  // draw a flat line on the floor, so it scales to the warn line instead and the rule is visible.
  it('reaches the warn line when the session never got near it', () => {
    expect(contextMax({ reading: reading({ tokens: 50_000 }), peak: 50_000 })).toBe(216_000);
  });

  it('scales to the peak once the session is past the warn line', () => {
    expect(contextMax({ reading: reading({ tokens: 400_000 }), peak: 400_000 })).toBe(432_000);
  });

  // The window is the one number a session genuinely can't exceed without the table being wrong, so
  // headroom never pushes the chart past it.
  it('never goes past the window', () => {
    const max = contextMax({ reading: reading({ tokens: 190_000, window: 200_000 }), peak: 190_000 });
    expect(max).toBe(200_000);
  });

  // Except when the session already is past it, which means the table is wrong for this model. The
  // curve stays on the chart rather than being clipped into a straight line along the top.
  it('follows the peak when the session is over its assumed window', () => {
    const max = contextMax({ reading: reading({ tokens: 260_000, window: 200_000 }), peak: 260_000 });
    expect(max).toBe(260_000);
  });

  it('ignores a threshold that is switched off', () => {
    expect(contextMax({ reading: reading({ tokens: 50_000, warnAt: 0 }), peak: 50_000 })).toBe(54_000);
  });
});

describe('contextGuides', () => {
  it('draws both rules when both fit', () => {
    const guides = contextGuides({ reading: reading({ tokens: 400_000 }), max: 432_000 });

    expect(guides.map((guide) => guide.value)).toEqual([200_000, 300_000]);
    expect(guides.map((guide) => guide.level)).toEqual(['near', 'over']);
    expect(guides[0].label).toBe('Warn at 200k');
    expect(guides[1].label).toBe('Too big at 300k');
  });

  // The error line arrives on its own as a session grows into it, which is the point at which it
  // starts meaning something.
  it('leaves out a threshold above the top of the chart', () => {
    const guides = contextGuides({ reading: reading({ tokens: 50_000 }), max: 216_000 });
    expect(guides.map((guide) => guide.value)).toEqual([200_000]);
  });

  it('draws nothing for a threshold set to zero', () => {
    const guides = contextGuides({
      reading: reading({ tokens: 50_000, warnAt: 0, errorAt: 0 }),
      max: 54_000
    });
    expect(guides).toEqual([]);
  });
});
