import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{g as t,ln as n,n as r,r as i}from"./iframe-BqMUbHN9.js";import{S as a,c as o,f as s,h as c,i as l,l as u,m as d,n as f,o as p,p as m,r as h,s as g,u as _,v,x as y}from"./agent-fixtures-B66J9E6T.js";import{n as b,t as x}from"./AgentRow-CVAooJBY.js";var S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B;function V(){return(V=e((()=>{b(),m(),t(),S=r(),C=n(),w={title:`Agents/AgentRow`,component:x,args:{now:Date.now(),workspaceRoot:i,onOpen:()=>void 0,onAnalyze:()=>void 0,onOpenLog:()=>void 0,onCopySessionId:()=>void 0,onKill:()=>void 0},decorators:[e=>(0,S.jsx)(`div`,{className:`w-full max-w-2xl p-2`,children:(0,S.jsx)(e,{})})]},T={args:{agent:a}},E={args:{agent:y}},D={args:{agent:s}},O={args:{agent:d}},k={args:{agent:c}},A={args:{agent:v}},j={args:{agent:_}},M={args:{agent:s}},N={args:{agent:u}},P={args:{agent:p}},F={args:{agent:g}},I={args:{agent:o}},L={args:{agent:l}},R={args:{agent:h}},z={render:e=>(0,S.jsx)(`div`,{className:`flex flex-col gap-1`,children:[a,y,f,u,l].map(t=>(0,C.createElement)(x,{...e,key:t.sessionId,agent:t}))})},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    agent: workingAgent
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    agent: waitingAgent
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    agent: idleAgent
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    agent: longTitleAgent
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    agent: noTranscriptAgent
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    agent: resumedAgent
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    agent: elsewhereAgent
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    agent: idleAgent
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotWorkingAgent
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotBlockedAgent
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotMcpAgent
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotSubagentAgent
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    agent: codexWorkingAgent
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    agent: codexIdleAgent
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-1">
      {[workingAgent, waitingAgent, askingAgent, copilotWorkingAgent, codexWorkingAgent].map(agent => <AgentRow {...args} key={agent.sessionId} agent={agent} />)}
    </div>
}`,...z.parameters?.docs?.source}}},B=[`Working`,`Waiting`,`Idle`,`LongTitle`,`NoTranscript`,`Resumed`,`OtherWorkspace`,`InWorkspaceRoot`,`CopilotWorking`,`CopilotBlocked`,`CopilotMcpTool`,`CopilotSubagents`,`CodexWorking`,`CodexIdle`,`ContextLevels`]})))()}V();export{R as CodexIdle,L as CodexWorking,z as ContextLevels,P as CopilotBlocked,F as CopilotMcpTool,I as CopilotSubagents,N as CopilotWorking,D as Idle,M as InWorkspaceRoot,O as LongTitle,k as NoTranscript,j as OtherWorkspace,A as Resumed,E as Waiting,T as Working,B as __namedExportsOrder,w as default};