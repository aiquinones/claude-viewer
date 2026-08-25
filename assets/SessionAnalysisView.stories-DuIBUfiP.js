import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ct as t,at as n,it as r,n as i,wt as a}from"./iframe-BXJhjAIZ.js";import{n as o,t as s}from"./SettingsContext-BmPov-ZQ.js";import{n as c,t as l}from"./SessionAnalysisView-Cw-mi_D9.js";import{r as u,s as d}from"./usage-fixtures-OyfoRExD.js";import{a as f,c as p,i as m,l as h,n as g,o as _,r as v,s as y,t as b}from"./session-detail-fixtures-i6NA3UbE.js";var x,S,C,w,T,E,D,O,k,A,j,M,N,P,F;function I(){return(I=e((()=>{t(),n(),o(),c(),_(),u(),x=i(),S=({metric:e,estimator:t,children:n})=>{let i={...r,tokens:{estimator:{value:t??`standard`,source:t?`user`:`default`}},usage:{...r.usage,metric:{value:e??`output-tokens`,source:e?`user`:`default`}}};return(0,x.jsx)(s,{settings:i,children:n})},C={title:`Usage/SessionAnalysisView`,component:l,args:{session:v,detail:g,onWatch:()=>void 0,skills:d,onOpenSkill:()=>void 0,onCopyId:()=>void 0,onSearch:()=>void 0,onRefresh:()=>void 0,onBack:()=>void 0},decorators:[e=>(0,x.jsx)(`div`,{className:`h-screen`,style:{"--surface-accent":a(`usage`)},children:(0,x.jsx)(e,{})})]},w={},T={render:e=>(0,x.jsx)(S,{metric:`cost`,children:(0,x.jsx)(l,{...e})})},E={args:{session:f,detail:m}},D={render:e=>(0,x.jsx)(S,{estimator:`standard`,children:(0,x.jsx)(l,{...e})})},O={render:e=>(0,x.jsx)(S,{estimator:`anthropic`,children:(0,x.jsx)(l,{...e})})},k={args:{detail:b}},A={args:{detail:h}},j={args:{detail:void 0}},M={args:{agent:y}},N={args:{session:f,detail:m,agent:p}},P={args:{agent:y,origin:{label:`Active Agents`,onReturn:()=>void 0}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    agent: liveClaudeAgent,
    origin: {
      label: 'Active Agents',
      onReturn: () => undefined
    }
  }
}`,...P.parameters?.docs?.source}}},F=[`Claude`,`Cost`,`CopilotDoubleLoad`,`EstimatorOverridden`,`EstimatorAgrees`,`NoSkills`,`Unreadable`,`Loading`,`LiveClaude`,`LiveCopilot`,`FromAnAgentRow`]})))()}I();export{w as Claude,E as CopilotDoubleLoad,T as Cost,O as EstimatorAgrees,D as EstimatorOverridden,P as FromAnAgentRow,M as LiveClaude,N as LiveCopilot,j as Loading,k as NoSkills,A as Unreadable,F as __namedExportsOrder,C as default};