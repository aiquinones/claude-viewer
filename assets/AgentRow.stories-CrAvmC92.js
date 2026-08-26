import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{at as t,g as n,it as r,ln as i,n as a,r as o}from"./iframe-QBWE1gS0.js";import{n as s,t as c}from"./SettingsContext-C509xLcF.js";import{a as l,b as u,c as d,d as f,f as p,g as m,i as h,n as g,o as _,p as v,s as y,u as b,y as x}from"./agent-fixtures-DcEcV4XE.js";import{n as S,t as C}from"./AgentRow-Bkf5ku63.js";import{d as w,o as T}from"./session-detail-fixtures-i6NA3UbE.js";var E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H;function U(){return(U=e((()=>{t(),S(),s(),f(),n(),T(),E=a(),D=i(),O={title:`Agents/AgentRow`,component:C,args:{now:Date.now(),workspaceRoot:o,onOpen:()=>void 0,onAnalyze:()=>void 0,onOpenLog:()=>void 0,onCopySessionId:()=>void 0,onKill:()=>void 0},decorators:[e=>(0,E.jsx)(c,{settings:{...r,stages:{names:w}},children:(0,E.jsx)(e,{})}),e=>(0,E.jsx)(`div`,{className:`w-full max-w-2xl p-2`,children:(0,E.jsx)(e,{})})]},k={args:{agent:u}},A={args:{agent:x}},j={args:{agent:b}},M={args:{agent:p}},N={args:{agent:v}},P={args:{agent:m}},F={args:{agent:d}},I={args:{agent:b}},L={args:{agent:y}},R={args:{agent:h}},z={args:{agent:l}},B={args:{agent:_}},V={render:e=>(0,E.jsx)(`div`,{className:`flex flex-col gap-1`,children:[u,x,g,y].map(t=>(0,D.createElement)(C,{...e,key:t.sessionId,agent:t}))})},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    agent: workingAgent
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    agent: waitingAgent
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    agent: idleAgent
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    agent: longTitleAgent
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    agent: noTranscriptAgent
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    agent: resumedAgent
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    agent: elsewhereAgent
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    agent: idleAgent
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotWorkingAgent
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotBlockedAgent
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotMcpAgent
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotSubagentAgent
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-1">
      {[workingAgent, waitingAgent, askingAgent, copilotWorkingAgent].map(agent => <AgentRow {...args} key={agent.sessionId} agent={agent} />)}
    </div>
}`,...V.parameters?.docs?.source}}},H=[`Working`,`Waiting`,`Idle`,`LongTitle`,`NoTranscript`,`Resumed`,`OtherWorkspace`,`InWorkspaceRoot`,`CopilotWorking`,`CopilotBlocked`,`CopilotMcpTool`,`CopilotSubagents`,`ContextLevels`]})))()}U();export{V as ContextLevels,R as CopilotBlocked,z as CopilotMcpTool,B as CopilotSubagents,L as CopilotWorking,j as Idle,I as InWorkspaceRoot,M as LongTitle,N as NoTranscript,F as OtherWorkspace,P as Resumed,A as Waiting,k as Working,H as __namedExportsOrder,O as default};