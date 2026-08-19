import { FlowNode } from './steps';

interface TrailToArgs {
  steps: FlowNode[];
  // A heading's anchor, already resolved against the document — see markdown/find-section.ts.
  slug: string;
}

// A heading → the path from the step that contains it down to the node itself, which is exactly
// what `FlowFocus.trail` holds. Undefined when the heading isn't in the sequence at all: a link can
// name the preamble, or a section above the steps, and that's a text-mode answer.
export const trailTo = ({ steps, slug }: TrailToArgs): FlowNode[] | undefined => {
  for (const step of steps) {
    if (step.slug === slug) return [step];

    const inside: FlowNode[] | undefined = trailTo({ steps: step.children, slug });
    if (inside) return [step, ...inside];
  }

  return undefined;
};
