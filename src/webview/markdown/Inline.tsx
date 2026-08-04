import { Fragment, ReactNode } from 'react';
import { Token } from 'marked';
import { isToken, TokenOf } from './tokens';

// A link we're willing to hand to VS Code's opener. Anything else — a relative path to a
// reference file, an anchor — renders as text: following it would navigate the webview itself
// off its shell and take the panel with it.
const EXTERNAL = /^(https?:|mailto:)/i;

interface InlineProps {
  tokens: Token[] | undefined;
}

export const Inline = ({ tokens }: InlineProps) => (
  <>
    {(tokens ?? []).map((token, index) => (
      <Fragment key={index}>{render(token)}</Fragment>
    ))}
  </>
);

const render = (token: Token): ReactNode => {
  if (token.type === 'text' || token.type === 'escape') {
    // A text token carries its own tokens only when something inline is nested in it.
    return 'tokens' in token && token.tokens?.length ? <Inline tokens={token.tokens} /> : token.text;
  }
  if (token.type === 'strong') return <strong className="font-semibold"><Inline tokens={token.tokens} /></strong>;
  if (token.type === 'em') return <em className="italic"><Inline tokens={token.tokens} /></em>;
  if (token.type === 'del') return <del className="line-through"><Inline tokens={token.tokens} /></del>;
  if (token.type === 'codespan') {
    return <code className="rounded bg-muted px-1 py-0.5 text-[0.9em]">{token.text}</code>;
  }
  if (token.type === 'br') return <br />;
  if (isToken(token, 'link')) return <Link token={token} />;
  // Images can't load: the panel's CSP has no img-src, and a skill's own files aren't a
  // localResourceRoot. The alt text and the target are the honest version.
  if (isToken(token, 'image')) {
    return (
      <span className="mono rounded bg-muted px-1 text-[0.9em] text-muted-foreground" title={token.href}>
        image: {token.text || token.href}
      </span>
    );
  }
  // Raw HTML in a skill shows as what it is, rather than being parsed or silently dropped.
  if (token.type === 'html') return token.raw;

  return 'raw' in token ? token.raw : null;
};

interface LinkProps {
  token: TokenOf<'link'>;
}

const Link = ({ token }: LinkProps) => {
  if (!EXTERNAL.test(token.href)) {
    return (
      <span className="underline decoration-dotted" title={token.href}>
        <Inline tokens={token.tokens} />
      </span>
    );
  }

  return (
    <a
      href={token.href}
      title={token.href}
      target="_blank"
      rel="noreferrer"
      className="text-link hover:underline"
    >
      <Inline tokens={token.tokens} />
    </a>
  );
};
