import { AlertTriangle, CircleAlert } from 'lucide-react';
import { ConfigIssue } from '../model/types';

interface IssueListProps {
  issues: ConfigIssue[];
}

// Renders the problems the loader attached to one skill — no frontmatter, no description, a name
// that disagrees with its directory. Nothing throws upstream, so this is where a bad file shows up.
export const IssueList = ({ issues }: IssueListProps) => {
  if (issues.length === 0) return null;

  return (
    <ul className="flex flex-col gap-1.5">
      {issues.map((issue) => (
        <li
          key={issue.message}
          className={`flex items-start gap-2 text-xs ${
            issue.severity === 'error' ? 'text-error' : 'text-warn'
          }`}
        >
          {issue.severity === 'error' ? (
            <CircleAlert className="mt-px size-3.5 shrink-0" />
          ) : (
            <AlertTriangle className="mt-px size-3.5 shrink-0" />
          )}
          <span>{issue.message}</span>
        </li>
      ))}
    </ul>
  );
};
