import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{g as t,kt as n,n as r,r as i}from"./iframe-CWPoALnX.js";import{n as a,t as o}from"./AgentRow-DQ9Uzmyu.js";import{_ as s,a as c,d as l,f as u,h as d,i as f,l as p,n as m,o as h,s as g,u as _,v}from"./agent-fixtures-C3ZJ17Ez.js";var y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P;function F(){return(F=e((()=>{a(),_(),t(),y=r(),b=n(),x={title:`Agents/AgentRow`,component:o,args:{now:Date.now(),workspaceRoot:i,onOpen:()=>void 0,onOpenLog:()=>void 0,onCopySessionId:()=>void 0,onKill:()=>void 0},decorators:[e=>(0,y.jsx)(`div`,{className:`w-full max-w-2xl p-2`,children:(0,y.jsx)(e,{})})]},S={args:{agent:v}},C={args:{agent:s}},w={args:{agent:p}},T={args:{agent:l}},E={args:{agent:u}},D={args:{agent:d}},O={args:{agent:g}},k={args:{agent:p}},A={args:{agent:h}},j={args:{agent:f}},M={args:{agent:c}},N={render:e=>(0,y.jsx)(`div`,{className:`flex flex-col gap-1`,children:[v,s,m,h].map(t=>(0,b.createElement)(o,{...e,key:t.sessionId,agent:t}))})},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    agent: workingAgent
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    agent: waitingAgent
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    agent: idleAgent
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    agent: longTitleAgent
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    agent: noTranscriptAgent
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    agent: resumedAgent
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    agent: elsewhereAgent
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    agent: idleAgent
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotWorkingAgent
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotBlockedAgent
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotMcpAgent
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-1">
      {[workingAgent, waitingAgent, askingAgent, copilotWorkingAgent].map(agent => <AgentRow {...args} key={agent.sessionId} agent={agent} />)}
    </div>
}`,...N.parameters?.docs?.source}}},P=[`Working`,`Waiting`,`Idle`,`LongTitle`,`NoTranscript`,`Resumed`,`OtherWorkspace`,`InWorkspaceRoot`,`CopilotWorking`,`CopilotBlocked`,`CopilotMcpTool`,`ContextLevels`]})))()}F();export{N as ContextLevels,j as CopilotBlocked,M as CopilotMcpTool,A as CopilotWorking,w as Idle,k as InWorkspaceRoot,T as LongTitle,E as NoTranscript,O as OtherWorkspace,D as Resumed,C as Waiting,S as Working,P as __namedExportsOrder,x as default};