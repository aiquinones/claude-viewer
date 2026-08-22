import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{g as t,kt as n,n as r,r as i}from"./iframe-B3XJ6WRD.js";import{n as a,t as o}from"./AgentRow-D6cJeyJd.js";import{_ as s,a as c,d as l,f as u,g as d,i as f,l as p,n as m,o as h,s as g,u as _}from"./agent-fixtures-gL9MGKV2.js";var v,y,b,x,S,C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{a(),_(),t(),v=r(),y=n(),b={title:`Agents/AgentRow`,component:o,args:{now:Date.now(),workspaceRoot:i,onOpen:()=>void 0,onOpenLog:()=>void 0,onCopySessionId:()=>void 0,onKill:()=>void 0},decorators:[e=>(0,v.jsx)(`div`,{className:`w-full max-w-2xl p-2`,children:(0,v.jsx)(e,{})})]},x={args:{agent:s}},S={args:{agent:d}},C={args:{agent:p}},w={args:{agent:l}},T={args:{agent:u}},E={args:{agent:g}},D={args:{agent:h}},O={args:{agent:f}},k={args:{agent:c}},A={render:e=>(0,v.jsx)(`div`,{className:`flex flex-col gap-1`,children:[s,d,m,h].map(t=>(0,y.createElement)(o,{...e,key:t.sessionId,agent:t}))})},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    agent: workingAgent
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    agent: waitingAgent
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    agent: idleAgent
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    agent: longTitleAgent
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    agent: noTranscriptAgent
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    agent: elsewhereAgent
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotWorkingAgent
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotBlockedAgent
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotMcpAgent
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-1">
      {[workingAgent, waitingAgent, askingAgent, copilotWorkingAgent].map(agent => <AgentRow {...args} key={agent.sessionId} agent={agent} />)}
    </div>
}`,...A.parameters?.docs?.source}}},j=[`Working`,`Waiting`,`Idle`,`LongTitle`,`NoTranscript`,`OtherWorkspace`,`CopilotWorking`,`CopilotBlocked`,`CopilotMcpTool`,`ContextLevels`]})))()}M();export{A as ContextLevels,O as CopilotBlocked,k as CopilotMcpTool,D as CopilotWorking,C as Idle,w as LongTitle,T as NoTranscript,E as OtherWorkspace,S as Waiting,x as Working,j as __namedExportsOrder,b as default};