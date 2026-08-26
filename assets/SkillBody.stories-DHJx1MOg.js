import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{F as t,O as n,P as r,R as i,d as a,g as o,n as s,v as c,y as l,z as u}from"./iframe-DSQ2mDLj.js";import{n as d,t as f}from"./SkillBody-BZM8C37O.js";var p,m,h,g,_,v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{o(),d(),p=s(),m={title:`Skills/SkillBody`,component:f,args:{mode:`text`,blockers:{},body:void 0,error:void 0,loading:!1,graph:r,flow:i,viewedPath:n.path},decorators:[e=>(0,p.jsx)(`div`,{className:`h-screen overflow-y-auto overflow-x-clip`,children:(0,p.jsx)(e,{})})]},h={args:{body:t}},g={args:{loading:!0}},_={args:{body:`
`}},v={args:{error:`EACCES: permission denied, open /Users/dev/.claude/skills/deploy/SKILL.md`}},y={args:{mode:`graph`}},b={args:{mode:`graph`,graph:void 0,blockers:{graph:`Building the graph…`}}},x={args:{mode:`graph`,graph:a}},S={args:{body:t,blockers:{graph:`This skill names no other, and none names it`}}},C={args:{mode:`flow`,body:u}},w={args:{mode:`flow`,body:l,flow:c}},T={args:{mode:`flow`,body:t,flow:void 0,blockers:{flow:`This skill isn't written as a sequence of steps`}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    body: skillMarkdown
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    body: '\\n'
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    error: 'EACCES: permission denied, open /Users/dev/.claude/skills/deploy/SKILL.md'
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'graph'
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'graph',
    graph: undefined,
    blockers: {
      graph: 'Building the graph…'
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'graph',
    graph: emptyGraph
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    body: skillMarkdown,
    blockers: {
      graph: 'This skill names no other, and none names it'
    }
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'flow',
    body: stepMarkdown
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'flow',
    body: longStepMarkdown,
    flow: longFlow
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    mode: 'flow',
    body: skillMarkdown,
    flow: undefined,
    blockers: {
      flow: "This skill isn't written as a sequence of steps"
    }
  }
}`,...T.parameters?.docs?.source}}},E=[`Default`,`Loading`,`Empty`,`Unreadable`,`Graph`,`GraphLoading`,`GraphEmpty`,`GraphBlocked`,`Flow`,`LongFlow`,`FlowBlocked`]})))()}D();export{h as Default,_ as Empty,C as Flow,T as FlowBlocked,y as Graph,S as GraphBlocked,x as GraphEmpty,b as GraphLoading,g as Loading,w as LongFlow,v as Unreadable,E as __namedExportsOrder,m as default};