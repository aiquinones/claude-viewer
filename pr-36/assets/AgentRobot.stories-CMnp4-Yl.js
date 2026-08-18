import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,nt as n,st as r}from"./iframe-CqpD256r.js";import{n as i,r as a,t as o}from"./agent-colors-H9pA77B3.js";import{a as s,n as c,o as l,r as u,t as d}from"./moods-DIj4csw7.js";var f,p,m,h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{r(),a(),l(),u(),f=t(),p={title:`Agents/AgentRobot`,component:s,args:{mood:`working`,className:`size-24`},argTypes:{mood:{control:`inline-radio`,options:d}},decorators:[e=>(0,f.jsx)(`div`,{className:`flex justify-center p-10`,children:(0,f.jsx)(e,{})})]},m={args:{mood:`working`}},h={args:{mood:`waiting`}},g={args:{mood:`asking`}},_={args:{mood:`sleeping`}},v={render:e=>(0,f.jsx)(`div`,{className:`flex flex-wrap items-end justify-center gap-8`,children:d.map(t=>(0,f.jsxs)(`figure`,{className:`flex flex-col items-center gap-2`,children:[(0,f.jsx)(s,{...e,mood:t}),(0,f.jsxs)(`figcaption`,{className:`text-xs text-muted-foreground`,children:[t,` — `,c[t]]})]},t))})},y={render:e=>(0,f.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[n.map(t=>(0,f.jsxs)(`div`,{className:`flex items-center gap-6`,children:[(0,f.jsx)(`span`,{className:`w-16 shrink-0 text-xs text-muted-foreground`,children:o[t]}),d.map(n=>(0,f.jsx)(b,{color:t,mood:n,tickMs:e.tickMs},n))]},t)),(0,f.jsxs)(`div`,{className:`flex items-center gap-6`,children:[(0,f.jsx)(`span`,{className:`w-16 shrink-0 text-xs text-muted-foreground`,children:`unset`}),d.map(t=>(0,f.jsx)(s,{mood:t,tickMs:e.tickMs,className:`size-14`},t))]})]})},b=({color:e,mood:t,tickMs:n})=>(0,f.jsx)(`span`,{style:{"--row-color":i[e]},children:(0,f.jsx)(s,{mood:t,tickMs:n,className:`size-14`})}),x={args:{tickMs:2400,mood:`asking`}},S={render:e=>(0,f.jsx)(`div`,{className:`flex items-end gap-4`,children:d.map(t=>(0,f.jsx)(s,{...e,mood:t,className:`size-11`},t))})},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    mood: 'working'
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    mood: 'waiting'
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    mood: 'asking'
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    mood: 'sleeping'
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-wrap items-end justify-center gap-8">
      {ROBOT_MOODS.map(mood => <figure key={mood} className="flex flex-col items-center gap-2">
          <AgentRobot {...args} mood={mood} />
          <figcaption className="text-xs text-muted-foreground">
            {mood} — {ROBOT_MOOD_LABEL[mood]}
          </figcaption>
        </figure>)}
    </div>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-6">
      {AGENT_COLORS.map(color => <div key={color} className="flex items-center gap-6">
          <span className="w-16 shrink-0 text-xs text-muted-foreground">
            {AGENT_COLOR_LABEL[color]}
          </span>
          {ROBOT_MOODS.map(mood => <Tinted key={mood} color={color} mood={mood} tickMs={args.tickMs} />)}
        </div>)}
      <div className="flex items-center gap-6">
        <span className="w-16 shrink-0 text-xs text-muted-foreground">unset</span>
        {ROBOT_MOODS.map(mood => <AgentRobot key={mood} mood={mood} tickMs={args.tickMs} className="size-14" />)}
      </div>
    </div>
}`,...y.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    tickMs: 2400,
    mood: 'asking'
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex items-end gap-4">
      {ROBOT_MOODS.map(mood => <AgentRobot key={mood} {...args} mood={mood} className="size-11" />)}
    </div>
}`,...S.parameters?.docs?.source}}},C=[`Working`,`Waiting`,`Asking`,`Sleeping`,`EveryMood`,`EveryColour`,`SlowTick`,`RowSize`]})))()}w();export{g as Asking,y as EveryColour,v as EveryMood,S as RowSize,_ as Sleeping,x as SlowTick,h as Waiting,m as Working,C as __namedExportsOrder,p as default};