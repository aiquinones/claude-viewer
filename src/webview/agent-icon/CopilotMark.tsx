interface CopilotMarkProps {
  className?: string;
}

// GitHub Copilot's mark. There is no SVG of it anywhere on a machine with the CLI installed — the
// only copy is a glyph in VS Code's Copilot extension, `assets/copilot.woff`, whose `Github-Copilot`
// outline this is, lifted with fontTools and flipped out of font coordinates into SVG ones.
//
// The viewBox is the glyph's own 301×267 box padded out to a square at 88%. The mark is a solid
// shape where Claude's is thin spokes, so at an equal box it reads heavier; 88% is where the two
// look the same size beside each other, and the square is what centres them on one line.
const VIEW_BOX: string = '-20.5 -37.5 342 342';

export const CopilotMark = ({ className }: CopilotMarkProps) => (
  <svg viewBox={VIEW_BOX} className={className} aria-hidden focusable="false">
    <path
      fill="currentColor"
      d="M118 154Q124 154 128 158.5Q132 163 132 169V197Q132 203 128 207Q124 211 118 211Q112 211 108 207Q104 203 104 197V169Q104 163 108 158.5Q112 154 118 154ZM198 169Q198 163 194 158.5Q190 154 184 154Q178 154 174 158.5Q170 163 170 169V197Q170 203 174 207Q178 211 184 211Q190 211 194 207Q198 203 198 197ZM148 19Q150 20 151 22L154 19Q171 0 209 5Q244 9 260 28Q273 45 273 75Q273 94 268 106L271 122H272Q286 129 293.5 141.5Q301 154 301 168V192Q301 197 298 203Q296 206 292.5 210.5Q289 215 282 220L271 228Q265 233 258 237Q246 244 233 249Q192 267 151 267Q110 267 69 249Q56 244 44 237Q37 233 31 228L20 220Q13 215 9.5 210.5Q6 206 4 203Q1 197 1 192V168Q1 154 8.5 141.5Q16 129 30 122H31L34 106Q29 94 29 75Q29 45 42 28Q58 9 93 5Q131 0 148 19ZM58 130 57 132V212L58 213Q68 219 80 224Q116 239 151 239Q186 239 222 224Q234 219 244 213L245 212V132L244 130Q232 136 212 136Q179 136 161 117Q155 111 151 103Q147 111 141 117Q123 136 90 136Q70 136 58 130ZM128 38Q120 30 96 32.5Q72 35 64.5 44.5Q57 54 57 74Q57 94 63 101Q69 108 90 108Q111 108 120.5 98Q130 88 132 68Q135 46 128 38ZM174 38Q167 46 170 68Q172 88 181.5 98Q191 108 212 108Q233 108 239 101Q245 94 245 74Q245 54 237.5 44.5Q230 35 206 32.5Q182 30 174 38Z"
    />
  </svg>
);
