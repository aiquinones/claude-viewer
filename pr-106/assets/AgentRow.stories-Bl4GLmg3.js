import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{at as t,dn as n,g as r,it as i,n as a,r as o}from"./iframe-CvauhvaA.js";import{n as s,t as c}from"./SettingsContext-CCl7jV8a.js";import{T as l,_ as u,c as d,f,h as p,i as m,l as h,m as g,n as _,o as v,r as y,s as b,u as x,v as S,w as C,x as w}from"./agent-fixtures-BatZ6_UJ.js";import{n as T,t as E}from"./AgentRow-DxsqngDz.js";import{c as D,p as O}from"./session-detail-fixtures-Bn3SOtaQ.js";var k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J;function Y(){return(Y=e((()=>{t(),T(),s(),p(),r(),D(),k=a(),A=n(),j={title:`Agents/AgentRow`,component:E,args:{now:Date.now(),workspaceRoot:o,onOpen:()=>void 0,onAnalyze:()=>void 0,onOpenLog:()=>void 0,onOpenDeliverable:()=>void 0,onCopySessionId:()=>void 0,onKill:()=>void 0},decorators:[e=>(0,k.jsx)(c,{settings:{...i,stages:{names:O}},children:(0,k.jsx)(e,{})}),e=>(0,k.jsx)(`div`,{className:`w-full max-w-2xl p-2`,children:(0,k.jsx)(e,{})})]},M={args:{agent:l}},N={args:{agent:C}},P={args:{agent:g}},F={args:{agent:u}},I={args:{agent:S}},L={args:{agent:w}},R={args:{agent:f}},z={args:{agent:g}},B={args:{agent:h}},V={args:{agent:v}},H={args:{agent:b}},U={args:{agent:d}},W={args:{agent:m}},G={args:{agent:y}},K={args:{agent:x}},q={render:e=>(0,k.jsx)(`div`,{className:`flex flex-col gap-1`,children:[l,C,_,h,m].map(t=>(0,A.createElement)(E,{...e,key:t.sessionId,agent:t}))})},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    agent: workingAgent
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    agent: waitingAgent
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    agent: idleAgent
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    agent: longTitleAgent
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    agent: noTranscriptAgent
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    agent: resumedAgent
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    agent: elsewhereAgent
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    agent: idleAgent
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotWorkingAgent
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotBlockedAgent
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotMcpAgent
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotSubagentAgent
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    agent: codexWorkingAgent
  }
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: {
    agent: codexIdleAgent
  }
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    agent: deliverableAgent
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-1">
      {[workingAgent, waitingAgent, askingAgent, copilotWorkingAgent, codexWorkingAgent].map(agent => <AgentRow {...args} key={agent.sessionId} agent={agent} />)}
    </div>
}`,...q.parameters?.docs?.source}}},J=[`Working`,`Waiting`,`Idle`,`LongTitle`,`NoTranscript`,`Resumed`,`OtherWorkspace`,`InWorkspaceRoot`,`CopilotWorking`,`CopilotBlocked`,`CopilotMcpTool`,`CopilotSubagents`,`CodexWorking`,`CodexIdle`,`Deliverables`,`ContextLevels`]})))()}Y();export{G as CodexIdle,W as CodexWorking,q as ContextLevels,V as CopilotBlocked,H as CopilotMcpTool,U as CopilotSubagents,B as CopilotWorking,K as Deliverables,P as Idle,z as InWorkspaceRoot,F as LongTitle,I as NoTranscript,R as OtherWorkspace,L as Resumed,N as Waiting,M as Working,J as __namedExportsOrder,j as default};