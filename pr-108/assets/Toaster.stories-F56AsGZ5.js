import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dn as t,n}from"./iframe-DkjmdFDu.js";import{a as r,i,n as a,o,r as s,t as c}from"./useToasts-BftTdegD.js";var l,u,d,f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{l=t(),o(),i(),c(),u=n(),d=e=>({detail:`Went idle in example-app`,tool:`claude`,durationMs:s,leaving:!1,sessionId:`session-${e.id}`,...e}),f=e=>({toasts:e,push:()=>void 0,dismiss:()=>void 0,paused:!1,setPaused:()=>void 0}),p=[`claude`,`copilot`,`codex`],m={title:`Panel/Toaster`,component:r,args:{onOpenAgent:()=>void 0},parameters:{layout:`fullscreen`}},h={args:{queue:f([d({id:`1`,title:`Wire the usage poll to the surface`})])}},g={args:{queue:f(p.map((e,t)=>d({id:`${t}`,title:[`Rebuild the flow view`,`Fix the copilot tail`,`Draft the release notes`][t],tool:e})))}},_={args:{queue:f(Array.from({length:12},(e,t)=>d({id:`${t}`,title:`Session ${12-t}`,tool:p[t%3]})))}},v={args:{queue:f([d({id:`1`,title:`Work out why the usage scan re-reads every transcript on a settings change`,detail:`Went idle in claude-viewer`})])}},y={args:{queue:f([d({id:`1`,title:`Skills reloaded`,detail:`38 skills, 2 shadowed`,sessionId:void 0})])}},b={render:e=>(0,u.jsx)(x,{onOpenAgent:e.onOpenAgent})},x=({onOpenAgent:e})=>{let t=a(),[n,i]=(0,l.useState)(0);return(0,u.jsxs)(`div`,{className:`p-4`,children:[(0,u.jsx)(`button`,{type:`button`,onClick:()=>{i(n+1),t.push({title:`Session ${n+1}`,detail:`Went idle in example-app`,tool:p[n%3],sessionId:`session-${n+1}`})},className:`rounded-md border border-border px-3 py-1.5 text-xs hover:bg-accent`,children:`Notify`}),(0,u.jsx)(r,{queue:t,onOpenAgent:e})]})},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    queue: held([card({
      id: '1',
      title: 'Wire the usage poll to the surface'
    })])
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    queue: held(TOOLS.map((tool, index) => card({
      id: \`\${index}\`,
      title: ['Rebuild the flow view', 'Fix the copilot tail', 'Draft the release notes'][index],
      tool
    })))
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    queue: held(Array.from({
      length: 12
    }, (_, index) => card({
      id: \`\${index}\`,
      title: \`Session \${12 - index}\`,
      tool: TOOLS[index % 3]
    })))
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    queue: held([card({
      id: '1',
      title: 'Work out why the usage scan re-reads every transcript on a settings change',
      detail: 'Went idle in claude-viewer'
    })])
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    queue: held([card({
      id: '1',
      title: 'Skills reloaded',
      detail: '38 skills, 2 shadowed',
      sessionId: undefined
    })])
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => <LiveStack onOpenAgent={args.onOpenAgent} />
}`,...b.parameters?.docs?.source}}},S=[`One`,`Several`,`Scrolling`,`LongTitle`,`NotClickable`,`Live`]})))()}C();export{b as Live,v as LongTitle,y as NotClickable,h as One,_ as Scrolling,g as Several,S as __namedExportsOrder,m as default};