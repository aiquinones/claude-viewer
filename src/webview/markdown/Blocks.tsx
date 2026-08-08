import { Fragment, ReactNode } from 'react';
import { Token } from 'marked';
import { Inline } from './Inline';
import { isToken, TokenOf } from './tokens';

interface BlocksProps {
  tokens: Token[];
}

// Block-level tokens → elements. Vertical rhythm is plain margins so adjacent blocks collapse —
// the container has to stay normal flow, not flex, for that to hold.
export const Blocks = ({ tokens }: BlocksProps) => (
  <>
    {tokens.map((token, index) => (
      <Fragment key={index}>{render(token)}</Fragment>
    ))}
  </>
);

const render = (token: Token): ReactNode => {
  if (token.type === 'paragraph') {
    return <p className="my-2"><Inline tokens={token.tokens} /></p>;
  }
  // A tight list item's content arrives as a block-level `text` token. It stays inline, so the
  // bullet and its text share a line.
  if (token.type === 'text') {
    return 'tokens' in token && token.tokens?.length ? <Inline tokens={token.tokens} /> : token.text;
  }
  if (token.type === 'code') {
    return (
      <pre className="mono my-3 overflow-x-auto overflow-y-clip rounded-md bg-muted p-3 text-xs leading-relaxed">
        <code>{token.text}</code>
      </pre>
    );
  }
  if (isToken(token, 'list')) return <List token={token} />;
  if (isToken(token, 'blockquote')) {
    return (
      <blockquote className="my-3 border-l-2 border-border pl-3 text-muted-foreground">
        <Blocks tokens={token.tokens} />
      </blockquote>
    );
  }
  if (isToken(token, 'table')) return <Table token={token} />;
  if (token.type === 'hr') return <hr className="my-4 border-border" />;
  // A heading only reaches here nested inside something — a blockquote, a list item. The sticky
  // stack is built from the top-level ones, so this is a plain bold line.
  if (token.type === 'heading') {
    return <p className="my-2 font-semibold"><Inline tokens={token.tokens} /></p>;
  }
  if (token.type === 'html') return <p className="mono my-2 text-xs text-muted-foreground">{token.raw}</p>;

  return null;
};

interface ListProps {
  token: TokenOf<'list'>;
}

const List = ({ token }: ListProps) => {
  const items: ReactNode = token.items.map((item, index) => (
    <li key={index} className="my-1">
      {item.task && <input type="checkbox" checked={item.checked} readOnly className="mr-1.5 align-middle" />}
      <Blocks tokens={item.tokens} />
    </li>
  ));

  if (!token.ordered) return <ul className="my-2 list-disc pl-5">{items}</ul>;

  return (
    <ol className="my-2 list-decimal pl-5" start={Number(token.start) || 1}>
      {items}
    </ol>
  );
};

interface TableProps {
  token: TokenOf<'table'>;
}

const Table = ({ token }: TableProps) => (
  <div className="my-3 overflow-x-auto overflow-y-clip">
    <table className="w-full border-collapse text-xs">
      <thead>
        <tr>
          {token.header.map((cell, index) => (
            <th
              key={index}
              className="border border-border px-2 py-1 font-semibold"
              style={{ textAlign: token.align[index] ?? 'left' }}
            >
              <Inline tokens={cell.tokens} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {token.rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, index) => (
              <td
                key={index}
                className="border border-border px-2 py-1 align-top"
                style={{ textAlign: token.align[index] ?? 'left' }}
              >
                <Inline tokens={cell.tokens} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
