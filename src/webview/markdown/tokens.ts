import { Token } from 'marked';

// The token type for one `type` string — `TokenOf<'list'>` is `Tokens.List`.
export type TokenOf<Type extends string> = Extract<Token, { type: Type }>;

// marked's Token union carries a Generic member whose `type` is a plain `string`, so comparing
// `token.type` narrows to "the real one, or Generic" and the fields still look optional. This
// guard picks the real one.
export const isToken = <Type extends string>(token: Token, type: Type): token is TokenOf<Type> =>
  token.type === type;
