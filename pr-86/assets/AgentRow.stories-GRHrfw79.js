import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{g as t,ln as n,n as r,r as i}from"./iframe-BXJhjAIZ.js";import{_ as a,a as o,d as s,f as c,h as l,i as u,l as d,n as f,o as p,s as m,u as h,v as g}from"./agent-fixtures-DFBjdyhO.js";import{n as _,t as v}from"./AgentRow-DtrFtjAc.js";var y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P;function F(){return(F=e((()=>{_(),h(),t(),y=r(),b=n(),x={title:`Agents/AgentRow`,component:v,args:{now:Date.now(),workspaceRoot:i,onOpen:()=>void 0,onAnalyze:()=>void 0,onOpenLog:()=>void 0,onCopySessionId:()=>void 0,onKill:()=>void 0},decorators:[e=>(0,y.jsx)(`div`,{className:`w-full max-w-2xl p-2`,children:(0,y.jsx)(e,{})})]},S={args:{agent:g}},C={args:{agent:a}},w={args:{agent:d}},T={args:{agent:s}},E={args:{agent:c}},D={args:{agent:l}},O={args:{agent:m}},k={args:{agent:d}},A={args:{agent:p}},j={args:{agent:u}},M={args:{agent:o}},N={render:e=>(0,y.jsx)(`div`,{className:`flex flex-col gap-1`,children:[g,a,f,p].map(t=>(0,b.createElement)(v,{...e,key:t.sessionId,agent:t}))})},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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