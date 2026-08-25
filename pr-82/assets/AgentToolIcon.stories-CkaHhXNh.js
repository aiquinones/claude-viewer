import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{c as t,r as n}from"./types-BrfVTSKh.js";import{jt as r,n as i}from"./iframe-CKoMkP5b.js";import{n as a,r as o,t as s}from"./AgentToolIcon-DvB3HE-4.js";var c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{c=r(),t(),o(),l=i(),u={title:`Agents/AgentToolIcon`,component:a},d={args:{tool:`claude`}},f={args:{tool:`copilot`}},p={render:()=>(0,l.jsx)(`div`,{className:`flex flex-col gap-2`,children:n.map(e=>(0,l.jsx)(a,{tool:e},e))})},m={render:()=>(0,l.jsx)(`div`,{className:`grid w-fit grid-cols-[auto_auto_auto] items-center gap-x-4 gap-y-3`,children:s.map(e=>(0,l.jsxs)(c.Fragment,{children:[(0,l.jsx)(`span`,{className:`mono text-[11px] text-muted-foreground`,children:e}),n.map(t=>(0,l.jsx)(a,{tool:t,size:e},t))]},e))})},h={render:()=>(0,l.jsx)(`div`,{className:`grid w-fit grid-cols-[auto_auto] items-center gap-x-1.5 gap-y-0.5 text-[11px]`,children:n.map(e=>(0,l.jsxs)(c.Fragment,{children:[(0,l.jsx)(a,{tool:e,size:`xs`}),(0,l.jsx)(`span`,{className:`text-muted-foreground`,children:`2 sessions`})]},e))})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    tool: 'claude'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    tool: 'copilot'
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2">
      {AGENT_TOOLS.map(tool => <AgentToolIcon key={tool} tool={tool} />)}
    </div>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid w-fit grid-cols-[auto_auto_auto] items-center gap-x-4 gap-y-3">
      {AGENT_ICON_SIZES.map(size => <Fragment key={size}>
          <span className="mono text-[11px] text-muted-foreground">{size}</span>
          {AGENT_TOOLS.map(tool => <AgentToolIcon key={tool} tool={tool} size={size} />)}
        </Fragment>)}
    </div>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid w-fit grid-cols-[auto_auto] items-center gap-x-1.5 gap-y-0.5 text-[11px]">
      {AGENT_TOOLS.map(tool => <Fragment key={tool}>
          <AgentToolIcon tool={tool} size="xs" />
          <span className="text-muted-foreground">2 sessions</span>
        </Fragment>)}
    </div>
}`,...h.parameters?.docs?.source}}},g=[`Claude`,`Copilot`,`EveryTool`,`EverySize`,`InABubbleLine`]})))()}_();export{d as Claude,f as Copilot,m as EverySize,p as EveryTool,h as InABubbleLine,g as __namedExportsOrder,u as default};