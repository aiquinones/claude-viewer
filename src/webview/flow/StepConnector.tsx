interface StepConnectorProps {
  // Lit when either card it joins is the open step, so the path you're on reads as a path.
  active?: boolean;
}

// The arrow between two cards. One per gap rather than one spine behind everything: the cards have
// whatever height their labels give them, and a spine would have to be measured to match.
export const StepConnector = ({ active = false }: StepConnectorProps) => (
  <svg
    aria-hidden
    width="10"
    height="20"
    viewBox="0 0 10 20"
    className={`step-connector ${active ? 'step-connector-active' : ''} shrink-0`}
  >
    <line x1="5" y1="0" x2="5" y2="13" />
    <path d="M1.5,12.5 L5,19 L8.5,12.5 z" />
  </svg>
);
