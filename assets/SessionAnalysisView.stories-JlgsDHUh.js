import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ct as t,at as n,it as r,n as i,wt as a}from"./iframe-CvauhvaA.js";import{n as o,t as s}from"./SettingsContext-CCl7jV8a.js";import{a as c,c as l,d as u,h as d,i as f,l as p,n as m,o as h,r as g,s as _,t as v,u as y}from"./session-detail-fixtures-Bn3SOtaQ.js";import{n as b,t as x}from"./SessionAnalysisView-D4j_K6r1.js";import{l as S,r as C}from"./usage-fixtures-DRe59If-.js";var w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z;function B(){return(B=e((()=>{t(),n(),o(),b(),l(),C(),w=i(),T=({estimator:e,children:t})=>{let n={...r,tokens:{estimator:{value:e??`standard`,source:e?`user`:`default`}}};return(0,w.jsx)(s,{settings:n,children:t})},E={title:`Usage/SessionAnalysisView`,component:x,args:{session:g,workspaceRoot:g.cwd,detail:m,onWatch:()=>void 0,skills:S,onOpenSkill:()=>void 0,onOpenAgents:()=>void 0,onCopyId:()=>void 0,onSearch:()=>void 0,onRefresh:()=>void 0,onBack:()=>void 0},decorators:[e=>(0,w.jsx)(`div`,{className:`h-screen`,style:{"--surface-accent":a(`usage`)},children:(0,w.jsx)(e,{})})]},D={},O={args:{session:_,detail:h}},k={args:{session:c,detail:f}},A={args:{session:c,detail:d}},j={render:e=>(0,w.jsx)(T,{estimator:`standard`,children:(0,w.jsx)(x,{...e})})},M={render:e=>(0,w.jsx)(T,{estimator:`anthropic`,children:(0,w.jsx)(x,{...e})})},N={args:{detail:v}},P={args:{detail:u}},F={args:{detail:void 0}},I={args:{agent:p}},L={args:{session:_,detail:h,agent:y}},R={args:{agent:p,origin:{label:`Active Agents`,onReturn:()=>void 0}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    session: copilotSession,
    detail: copilotDetail
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    session: codexSession,
    detail: codexDetail
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    session: codexSession,
    detail: unpricedModelDetail
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: args => <WithSettings estimator="standard">
      <SessionAnalysisView {...args} />
    </WithSettings>
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: args => <WithSettings estimator="anthropic">
      <SessionAnalysisView {...args} />
    </WithSettings>
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    detail: bareDetail
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    detail: missingDetail
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    detail: undefined
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    agent: liveClaudeAgent
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    session: copilotSession,
    detail: copilotDetail,
    agent: liveCopilotAgent
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    agent: liveClaudeAgent,
    origin: {
      label: 'Active Agents',
      onReturn: () => undefined
    }
  }
}`,...R.parameters?.docs?.source}}},z=[`Claude`,`CopilotDoubleLoad`,`Codex`,`UnpricedModel`,`EstimatorOverridden`,`EstimatorAgrees`,`NoSkills`,`Unreadable`,`Loading`,`LiveClaude`,`LiveCopilot`,`FromAnAgentRow`]})))()}B();export{D as Claude,k as Codex,O as CopilotDoubleLoad,M as EstimatorAgrees,j as EstimatorOverridden,R as FromAnAgentRow,I as LiveClaude,L as LiveCopilot,F as Loading,N as NoSkills,A as UnpricedModel,P as Unreadable,z as __namedExportsOrder,E as default};