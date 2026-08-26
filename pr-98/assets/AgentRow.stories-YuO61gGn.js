import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{at as t,g as n,it as r,ln as i,n as a,r as o}from"./iframe-B7_220UB.js";import{n as s,t as c}from"./SettingsContext-CD56i5wk.js";import{S as l,c as u,f as d,h as f,i as p,l as m,m as h,n as g,o as _,p as v,r as y,s as b,u as x,v as S,x as C}from"./agent-fixtures--fWbQndr.js";import{n as w,t as T}from"./AgentRow-BR1Kbrcj.js";import{d as E,o as D}from"./session-detail-fixtures-i6NA3UbE.js";var O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K;function q(){return(q=e((()=>{t(),w(),s(),v(),n(),D(),O=a(),k=i(),A={title:`Agents/AgentRow`,component:T,args:{now:Date.now(),workspaceRoot:o,onOpen:()=>void 0,onAnalyze:()=>void 0,onOpenLog:()=>void 0,onCopySessionId:()=>void 0,onKill:()=>void 0},decorators:[e=>(0,O.jsx)(c,{settings:{...r,stages:{names:E}},children:(0,O.jsx)(e,{})}),e=>(0,O.jsx)(`div`,{className:`w-full max-w-2xl p-2`,children:(0,O.jsx)(e,{})})]},j={args:{agent:l}},M={args:{agent:C}},N={args:{agent:d}},P={args:{agent:h}},F={args:{agent:f}},I={args:{agent:S}},L={args:{agent:x}},R={args:{agent:d}},z={args:{agent:m}},B={args:{agent:_}},V={args:{agent:b}},H={args:{agent:u}},U={args:{agent:p}},W={args:{agent:y}},G={render:e=>(0,O.jsx)(`div`,{className:`flex flex-col gap-1`,children:[l,C,g,m,p].map(t=>(0,k.createElement)(T,{...e,key:t.sessionId,agent:t}))})},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    agent: workingAgent
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    agent: waitingAgent
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    agent: idleAgent
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    agent: longTitleAgent
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    agent: noTranscriptAgent
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    agent: resumedAgent
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    agent: elsewhereAgent
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    agent: idleAgent
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotWorkingAgent
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotBlockedAgent
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotMcpAgent
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotSubagentAgent
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    agent: codexWorkingAgent
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    agent: codexIdleAgent
  }
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-1">
      {[workingAgent, waitingAgent, askingAgent, copilotWorkingAgent, codexWorkingAgent].map(agent => <AgentRow {...args} key={agent.sessionId} agent={agent} />)}
    </div>
}`,...G.parameters?.docs?.source}}},K=[`Working`,`Waiting`,`Idle`,`LongTitle`,`NoTranscript`,`Resumed`,`OtherWorkspace`,`InWorkspaceRoot`,`CopilotWorking`,`CopilotBlocked`,`CopilotMcpTool`,`CopilotSubagents`,`CodexWorking`,`CodexIdle`,`ContextLevels`]})))()}q();export{W as CodexIdle,U as CodexWorking,G as ContextLevels,B as CopilotBlocked,V as CopilotMcpTool,H as CopilotSubagents,z as CopilotWorking,N as Idle,R as InWorkspaceRoot,P as LongTitle,F as NoTranscript,L as OtherWorkspace,I as Resumed,M as Waiting,j as Working,K as __namedExportsOrder,A as default};