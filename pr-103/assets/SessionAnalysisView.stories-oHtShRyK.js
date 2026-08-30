import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ct as t,at as n,it as r,n as i,wt as a}from"./iframe-CsVp7LyP.js";import{n as o,t as s}from"./SettingsContext-frDIep6N.js";import{a as c,c as l,i as u,l as d,n as f,o as p,r as m,s as h,t as g}from"./session-detail-fixtures-i6NA3UbE.js";import{n as _,t as v}from"./SessionAnalysisView-D7uMm5YZ.js";import{r as y,s as b}from"./usage-fixtures-CIHw7tRS.js";var x,S,C,w,T,E,D,O,k,A,j,M,N,P;function F(){return(F=e((()=>{t(),n(),o(),_(),p(),y(),x=i(),S=({estimator:e,children:t})=>{let n={...r,tokens:{estimator:{value:e??`standard`,source:e?`user`:`default`}}};return(0,x.jsx)(s,{settings:n,children:t})},C={title:`Usage/SessionAnalysisView`,component:v,args:{session:m,workspaceRoot:m.cwd,detail:f,onWatch:()=>void 0,skills:b,onOpenSkill:()=>void 0,onOpenAgents:()=>void 0,onCopyId:()=>void 0,onSearch:()=>void 0,onRefresh:()=>void 0,onBack:()=>void 0},decorators:[e=>(0,x.jsx)(`div`,{className:`h-screen`,style:{"--surface-accent":a(`usage`)},children:(0,x.jsx)(e,{})})]},w={},T={args:{session:c,detail:u}},E={render:e=>(0,x.jsx)(S,{estimator:`standard`,children:(0,x.jsx)(v,{...e})})},D={render:e=>(0,x.jsx)(S,{estimator:`anthropic`,children:(0,x.jsx)(v,{...e})})},O={args:{detail:g}},k={args:{detail:d}},A={args:{detail:void 0}},j={args:{agent:h}},M={args:{session:c,detail:u,agent:l}},N={args:{agent:h,origin:{label:`Active Agents`,onReturn:()=>void 0}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    session: copilotSession,
    detail: copilotDetail
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: args => <WithSettings estimator="standard">
      <SessionAnalysisView {...args} />
    </WithSettings>
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: args => <WithSettings estimator="anthropic">
      <SessionAnalysisView {...args} />
    </WithSettings>
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    detail: bareDetail
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    detail: missingDetail
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    detail: undefined
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    agent: liveClaudeAgent
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    session: copilotSession,
    detail: copilotDetail,
    agent: liveCopilotAgent
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    agent: liveClaudeAgent,
    origin: {
      label: 'Active Agents',
      onReturn: () => undefined
    }
  }
}`,...N.parameters?.docs?.source}}},P=[`Claude`,`CopilotDoubleLoad`,`EstimatorOverridden`,`EstimatorAgrees`,`NoSkills`,`Unreadable`,`Loading`,`LiveClaude`,`LiveCopilot`,`FromAnAgentRow`]})))()}F();export{w as Claude,T as CopilotDoubleLoad,D as EstimatorAgrees,E as EstimatorOverridden,N as FromAnAgentRow,j as LiveClaude,M as LiveCopilot,A as Loading,O as NoSkills,k as Unreadable,P as __namedExportsOrder,C as default};