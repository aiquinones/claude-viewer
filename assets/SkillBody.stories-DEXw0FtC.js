import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{F as t,I as n,M as r,T as i,d as a,g as o,j as s,n as c}from"./iframe-DXqFqBEI.js";import{n as l,t as u}from"./SkillBody-DM6g0r0v.js";var d,f,p,m,h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{o(),l(),d=c(),f={title:`Skills/SkillBody`,component:u,args:{mode:`text`,blockers:{},body:void 0,error:void 0,loading:!1,graph:s,flow:t,viewedPath:i.path},decorators:[e=>(0,d.jsx)(`div`,{className:`h-screen overflow-y-auto overflow-x-clip`,children:(0,d.jsx)(e,{})})]},p={args:{body:r}},m={args:{loading:!0}},h={args:{body:`
`}},g={args:{error:`EACCES: permission denied, open /Users/dev/.claude/skills/deploy/SKILL.md`}},_={args:{mode:`graph`}},v={args:{mode:`graph`,graph:void 0,blockers:{graph:`Building the graph…`}}},y={args:{mode:`graph`,graph:a}},b={args:{body:r,blockers:{graph:`This skill names no other, and none names it`}}},x={args:{mode:`flow`,body:n}},S={args:{mode:`flow`,body:r,flow:void 0,blockers:{flow:`This skill isn't written as a sequence of steps`}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    body: skillMarkdown
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    body: '\\n'
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    error: 'EACCES: permission denied, open /Users/dev/.claude/skills/deploy/SKILL.md'
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'graph'
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'graph',
    graph: undefined,
    blockers: {
      graph: 'Building the graph…'
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'graph',
    graph: emptyGraph
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    body: skillMarkdown,
    blockers: {
      graph: 'This skill names no other, and none names it'
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'flow',
    body: stepMarkdown
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'flow',
    body: skillMarkdown,
    flow: undefined,
    blockers: {
      flow: "This skill isn't written as a sequence of steps"
    }
  }
}`,...S.parameters?.docs?.source}}},C=[`Default`,`Loading`,`Empty`,`Unreadable`,`Graph`,`GraphLoading`,`GraphEmpty`,`GraphBlocked`,`Flow`,`FlowBlocked`]})))()}w();export{p as Default,h as Empty,x as Flow,S as FlowBlocked,_ as Graph,b as GraphBlocked,y as GraphEmpty,v as GraphLoading,m as Loading,g as Unreadable,C as __namedExportsOrder,f as default};