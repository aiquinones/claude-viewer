import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{g as t,ln as n,n as r,r as i}from"./iframe-BDy95zVS.js";import{a,b as o,c as s,d as c,f as l,g as u,i as d,n as f,o as p,p as m,s as h,u as g,y as _}from"./agent-fixtures-zcnJa1_T.js";import{n as v,t as y}from"./AgentRow-DQjiESAa.js";var b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I;function L(){return(L=e((()=>{v(),c(),t(),b=r(),x=n(),S={title:`Agents/AgentRow`,component:y,args:{now:Date.now(),workspaceRoot:i,onOpen:()=>void 0,onAnalyze:()=>void 0,onOpenLog:()=>void 0,onCopySessionId:()=>void 0,onKill:()=>void 0},decorators:[e=>(0,b.jsx)(`div`,{className:`w-full max-w-2xl p-2`,children:(0,b.jsx)(e,{})})]},C={args:{agent:o}},w={args:{agent:_}},T={args:{agent:g}},E={args:{agent:l}},D={args:{agent:m}},O={args:{agent:u}},k={args:{agent:s}},A={args:{agent:g}},j={args:{agent:h}},M={args:{agent:d}},N={args:{agent:a}},P={args:{agent:p}},F={render:e=>(0,b.jsx)(`div`,{className:`flex flex-col gap-1`,children:[o,_,f,h].map(t=>(0,x.createElement)(y,{...e,key:t.sessionId,agent:t}))})},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    agent: workingAgent
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    agent: waitingAgent
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    agent: idleAgent
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    agent: longTitleAgent
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    agent: noTranscriptAgent
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    agent: resumedAgent
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    agent: elsewhereAgent
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    agent: idleAgent
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotWorkingAgent
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotBlockedAgent
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotMcpAgent
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotSubagentAgent
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-1">
      {[workingAgent, waitingAgent, askingAgent, copilotWorkingAgent].map(agent => <AgentRow {...args} key={agent.sessionId} agent={agent} />)}
    </div>
}`,...F.parameters?.docs?.source}}},I=[`Working`,`Waiting`,`Idle`,`LongTitle`,`NoTranscript`,`Resumed`,`OtherWorkspace`,`InWorkspaceRoot`,`CopilotWorking`,`CopilotBlocked`,`CopilotMcpTool`,`CopilotSubagents`,`ContextLevels`]})))()}L();export{F as ContextLevels,M as CopilotBlocked,N as CopilotMcpTool,P as CopilotSubagents,j as CopilotWorking,T as Idle,A as InWorkspaceRoot,E as LongTitle,D as NoTranscript,k as OtherWorkspace,O as Resumed,w as Waiting,C as Working,I as __namedExportsOrder,S as default};