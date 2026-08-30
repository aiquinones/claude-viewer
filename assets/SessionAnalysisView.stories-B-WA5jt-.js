import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ct as t,at as n,it as r,n as i,wt as a}from"./iframe-BvyLxF4R.js";import{n as o,t as s}from"./SettingsContext-DgwY5yU4.js";import{a as c,c as l,d as u,i as d,l as f,n as p,o as m,r as h,s as g,t as _,u as v}from"./session-detail-fixtures-CH3mNyNV.js";import{n as y,t as b}from"./SessionAnalysisView-DtmF0NI1.js";import{c as x,r as S}from"./usage-fixtures-dwsxOfsL.js";var C,w,T,E,D,O,k,A,j,M,N,P,F,I,L;function R(){return(R=e((()=>{t(),n(),o(),y(),l(),S(),C=i(),w=({estimator:e,children:t})=>{let n={...r,tokens:{estimator:{value:e??`standard`,source:e?`user`:`default`}}};return(0,C.jsx)(s,{settings:n,children:t})},T={title:`Usage/SessionAnalysisView`,component:b,args:{session:h,workspaceRoot:h.cwd,detail:p,onWatch:()=>void 0,skills:x,onOpenSkill:()=>void 0,onOpenAgents:()=>void 0,onCopyId:()=>void 0,onSearch:()=>void 0,onRefresh:()=>void 0,onBack:()=>void 0},decorators:[e=>(0,C.jsx)(`div`,{className:`h-screen`,style:{"--surface-accent":a(`usage`)},children:(0,C.jsx)(e,{})})]},E={},D={args:{session:g,detail:m}},O={args:{session:c,detail:d}},k={render:e=>(0,C.jsx)(w,{estimator:`standard`,children:(0,C.jsx)(b,{...e})})},A={render:e=>(0,C.jsx)(w,{estimator:`anthropic`,children:(0,C.jsx)(b,{...e})})},j={args:{detail:_}},M={args:{detail:u}},N={args:{detail:void 0}},P={args:{agent:f}},F={args:{session:g,detail:m,agent:v}},I={args:{agent:f,origin:{label:`Active Agents`,onReturn:()=>void 0}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    session: copilotSession,
    detail: copilotDetail
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    session: codexSession,
    detail: codexDetail
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: args => <WithSettings estimator="standard">
      <SessionAnalysisView {...args} />
    </WithSettings>
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: args => <WithSettings estimator="anthropic">
      <SessionAnalysisView {...args} />
    </WithSettings>
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    detail: bareDetail
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    detail: missingDetail
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    detail: undefined
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    agent: liveClaudeAgent
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    session: copilotSession,
    detail: copilotDetail,
    agent: liveCopilotAgent
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    agent: liveClaudeAgent,
    origin: {
      label: 'Active Agents',
      onReturn: () => undefined
    }
  }
}`,...I.parameters?.docs?.source}}},L=[`Claude`,`CopilotDoubleLoad`,`Codex`,`EstimatorOverridden`,`EstimatorAgrees`,`NoSkills`,`Unreadable`,`Loading`,`LiveClaude`,`LiveCopilot`,`FromAnAgentRow`]})))()}R();export{E as Claude,O as Codex,D as CopilotDoubleLoad,A as EstimatorAgrees,k as EstimatorOverridden,I as FromAnAgentRow,P as LiveClaude,F as LiveCopilot,N as Loading,j as NoSkills,M as Unreadable,L as __namedExportsOrder,T as default};