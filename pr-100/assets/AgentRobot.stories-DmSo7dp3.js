import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{c as t,n}from"./types-CelWZP6i.js";import{n as r}from"./iframe-DbQK32Gq.js";import{n as i,r as a,t as o}from"./agent-colors-BKGN2Crs.js";import{a as s,n as c,o as l,r as u,t as d}from"./moods-D5mOpwfF.js";import{n as f,t as p}from"./Robot-BYjK-oPA.js";var m,h,g,_,v,y,b,x,S,C,w,T,E,D;function O(){return(O=e((()=>{t(),a(),f(),l(),u(),m=r(),h={title:`Agents/AgentRobot`,component:s,args:{mood:`working`,className:`size-24`},argTypes:{mood:{control:`inline-radio`,options:d}},decorators:[e=>(0,m.jsx)(`div`,{className:`flex justify-center p-10`,children:(0,m.jsx)(e,{})})]},g={args:{mood:`working`}},_={args:{mood:`waiting`}},v={args:{mood:`asking`}},y={args:{mood:`sleeping`}},b={render:e=>(0,m.jsx)(`div`,{className:`flex flex-wrap items-end justify-center gap-8`,children:d.map(t=>(0,m.jsxs)(`figure`,{className:`flex flex-col items-center gap-2`,children:[(0,m.jsx)(s,{...e,mood:t}),(0,m.jsxs)(`figcaption`,{className:`text-xs text-muted-foreground`,children:[t,` — `,c[t]]})]},t))})},x={render:e=>(0,m.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[n.map(t=>(0,m.jsxs)(`div`,{className:`flex items-center gap-6`,children:[(0,m.jsx)(`span`,{className:`w-16 shrink-0 text-xs text-muted-foreground`,children:o[t]}),d.map(n=>(0,m.jsx)(S,{color:t,mood:n,tickMs:e.tickMs},n))]},t)),(0,m.jsxs)(`div`,{className:`flex items-center gap-6`,children:[(0,m.jsx)(`span`,{className:`w-16 shrink-0 text-xs text-muted-foreground`,children:`unset`}),d.map(t=>(0,m.jsx)(s,{mood:t,tickMs:e.tickMs,className:`size-14`},t))]})]})},S=({color:e,mood:t,tickMs:n})=>(0,m.jsx)(`span`,{style:{"--row-color":i[e]},children:(0,m.jsx)(s,{mood:t,tickMs:n,className:`size-14`})}),C={args:{tickMs:2400,mood:`asking`}},w={render:e=>(0,m.jsxs)(`div`,{className:`flex flex-wrap items-center justify-center gap-10`,children:[(0,m.jsxs)(`figure`,{className:`flex flex-col items-center gap-2`,children:[(0,m.jsx)(p,{className:`size-20`}),(0,m.jsx)(`figcaption`,{className:`text-xs text-muted-foreground`,children:`the icon`})]}),d.map(t=>(0,m.jsxs)(`figure`,{className:`flex flex-col items-center gap-2`,children:[(0,m.jsx)(s,{...e,mood:t,className:`size-20`}),(0,m.jsx)(`figcaption`,{className:`text-xs text-muted-foreground`,children:t})]},t))]})},T={render:e=>(0,m.jsx)(`div`,{className:`grid grid-cols-2 gap-3 sm:grid-cols-4`,children:d.map(t=>(0,m.jsxs)(`div`,{className:`flex flex-col items-center gap-2 rounded-md border border-border p-4`,children:[(0,m.jsx)(s,{...e,mood:t,className:`size-16`}),(0,m.jsx)(`span`,{className:`text-xs font-medium`,children:c[t]})]},t))})},E={render:e=>(0,m.jsx)(`div`,{className:`flex flex-col gap-6`,children:[`size-6`,`size-9`,`size-12`,`size-16`,`size-24`].map(t=>(0,m.jsxs)(`div`,{className:`flex items-center gap-6`,children:[(0,m.jsx)(`span`,{className:`w-16 shrink-0 text-xs text-muted-foreground`,children:t}),d.map(n=>(0,m.jsx)(s,{...e,mood:n,className:t},n))]},t))})},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    mood: 'working'
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    mood: 'waiting'
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    mood: 'asking'
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    mood: 'sleeping'
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-wrap items-end justify-center gap-8">
      {ROBOT_MOODS.map(mood => <figure key={mood} className="flex flex-col items-center gap-2">
          <AgentRobot {...args} mood={mood} />
          <figcaption className="text-xs text-muted-foreground">
            {mood} — {ROBOT_MOOD_LABEL[mood]}
          </figcaption>
        </figure>)}
    </div>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    tickMs: 2400,
    mood: 'asking'
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-wrap items-center justify-center gap-10">
      <figure className="flex flex-col items-center gap-2">
        <Robot className="size-20" />
        <figcaption className="text-xs text-muted-foreground">the icon</figcaption>
      </figure>
      {ROBOT_MOODS.map(mood => <figure key={mood} className="flex flex-col items-center gap-2">
          <AgentRobot {...args} mood={mood} className="size-20" />
          <figcaption className="text-xs text-muted-foreground">{mood}</figcaption>
        </figure>)}
    </div>
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: args => <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ROBOT_MOODS.map(mood => <div key={mood} className="flex flex-col items-center gap-2 rounded-md border border-border p-4">
          <AgentRobot {...args} mood={mood} className="size-16" />
          <span className="text-xs font-medium">{ROBOT_MOOD_LABEL[mood]}</span>
        </div>)}
    </div>
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-6">
      {['size-6', 'size-9', 'size-12', 'size-16', 'size-24'].map(size => <div key={size} className="flex items-center gap-6">
          <span className="w-16 shrink-0 text-xs text-muted-foreground">{size}</span>
          {ROBOT_MOODS.map(mood => <AgentRobot key={mood} {...args} mood={mood} className={size} />)}
        </div>)}
    </div>
}`,...E.parameters?.docs?.source}}},D=[`Working`,`Waiting`,`Asking`,`Sleeping`,`EveryMood`,`EveryColour`,`SlowTick`,`AgainstTheIcon`,`AsCards`,`Sizes`]})))()}O();export{w as AgainstTheIcon,T as AsCards,v as Asking,x as EveryColour,b as EveryMood,E as Sizes,y as Sleeping,C as SlowTick,_ as Waiting,g as Working,D as __namedExportsOrder,h as default};