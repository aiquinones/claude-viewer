import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{D as t,L as n,N as r,P as i,R as a,d as o,g as s,n as c,v as l,y as u}from"./iframe-BaV3_Nej.js";import{n as d,t as f}from"./SkillBody-BBOb7-I0.js";var p,m,h,g,_,v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{s(),d(),p=c(),m={title:`Skills/SkillBody`,component:f,args:{mode:`text`,blockers:{},body:void 0,error:void 0,loading:!1,graph:r,flow:n,viewedPath:t.path},decorators:[e=>(0,p.jsx)(`div`,{className:`h-screen overflow-y-auto overflow-x-clip`,children:(0,p.jsx)(e,{})})]},h={args:{body:i}},g={args:{loading:!0}},_={args:{body:`
`}},v={args:{error:`EACCES: permission denied, open /Users/dev/.claude/skills/deploy/SKILL.md`}},y={args:{mode:`graph`}},b={args:{mode:`graph`,graph:void 0,blockers:{graph:`Building the graph…`}}},x={args:{mode:`graph`,graph:o}},S={args:{body:i,blockers:{graph:`This skill names no other, and none names it`}}},C={args:{mode:`flow`,body:a}},w={args:{mode:`flow`,body:u,flow:l}},T={args:{mode:`flow`,body:i,flow:void 0,blockers:{flow:`This skill isn't written as a sequence of steps`}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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