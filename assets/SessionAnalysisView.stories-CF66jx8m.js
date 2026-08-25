import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{at as t,it as n,n as r}from"./iframe-HpIQKA6X.js";import{n as i,t as a}from"./SettingsContext-CdrjLHst.js";import{i as o,r as s}from"./surfaces-k3AxI1qz.js";import{n as c,t as l}from"./SessionAnalysisView-SZFI-Swb.js";import{c as u,r as d}from"./usage-fixtures-DhC6_YHN.js";import{a as f,c as p,i as m,l as h,n as g,o as _,r as v,s as y,t as b}from"./session-detail-fixtures-DLAk1DJ5.js";var x,S,C,w,T,E,D,O,k,A,j,M,N,P;function F(){return(F=e((()=>{s(),t(),i(),c(),_(),d(),x=r(),S=({metric:e,costBasis:t,estimator:r,children:i})=>{let o={...n,tokens:{estimator:{value:r??`standard`,source:r?`user`:`default`}},usage:{...n.usage,metric:{value:e??`output-tokens`,source:e?`user`:`default`},costBasis:{value:t??`all`,source:t?`user`:`default`}}};return(0,x.jsx)(a,{settings:o,children:i})},C={title:`Usage/SessionAnalysisView`,component:l,args:{session:v,detail:g,onWatch:()=>void 0,skills:u,onOpenSkill:()=>void 0,onCopyId:()=>void 0,onSearch:()=>void 0,onRefresh:()=>void 0,onBack:()=>void 0},decorators:[e=>(0,x.jsx)(`div`,{className:`h-screen`,style:{"--surface-accent":o(`usage`)},children:(0,x.jsx)(e,{})})]},w={},T={render:e=>(0,x.jsx)(S,{metric:`cost`,children:(0,x.jsx)(l,{...e})})},E={args:{session:f,detail:m}},D={render:e=>(0,x.jsx)(S,{estimator:`standard`,children:(0,x.jsx)(l,{...e})})},O={render:e=>(0,x.jsx)(S,{estimator:`anthropic`,children:(0,x.jsx)(l,{...e})})},k={args:{detail:b}},A={args:{detail:h}},j={args:{detail:void 0}},M={args:{agent:y}},N={args:{session:f,detail:m,agent:p}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: args => <WithSettings metric="cost">
      <SessionAnalysisView {...args} />
    </WithSettings>
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    session: copilotSession,
    detail: copilotDetail
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: args => <WithSettings estimator="standard">
      <SessionAnalysisView {...args} />
    </WithSettings>
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: args => <WithSettings estimator="anthropic">
      <SessionAnalysisView {...args} />
    </WithSettings>
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    detail: bareDetail
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    detail: missingDetail
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    detail: undefined
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    agent: liveClaudeAgent
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    session: copilotSession,
    detail: copilotDetail,
    agent: liveCopilotAgent
  }
}`,...N.parameters?.docs?.source}}},P=[`Claude`,`Cost`,`CopilotDoubleLoad`,`EstimatorOverridden`,`EstimatorAgrees`,`NoSkills`,`Unreadable`,`Loading`,`LiveClaude`,`LiveCopilot`]})))()}F();export{w as Claude,E as CopilotDoubleLoad,T as Cost,O as EstimatorAgrees,D as EstimatorOverridden,M as LiveClaude,N as LiveCopilot,j as Loading,k as NoSkills,A as Unreadable,P as __namedExportsOrder,C as default};