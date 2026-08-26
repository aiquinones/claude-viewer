import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{g as t,ln as n,n as r,r as i}from"./iframe-i9bFL9TH.js";import{b as a,d as o,f as s,i as c,l,n as u,p as d,u as f,y as p}from"./agent-fixtures-mykA9BQd.js";import{n as m,t as h}from"./AgentRobotRow-CeRZ993x.js";var g,_,v,y,b,x,S,C,w,T,E,D,O,k;function A(){return(A=e((()=>{o(),m(),t(),g=r(),_=n(),v={title:`Agents/AgentRobotRow`,component:h,args:{workspaceRoot:i,onOpen:()=>void 0,onAnalyze:()=>void 0,onOpenLog:()=>void 0,onCopySessionId:()=>void 0,onKill:()=>void 0},decorators:[e=>(0,g.jsx)(`div`,{className:`p-3`,children:(0,g.jsx)(e,{})})],render:e=>(0,g.jsx)(h,{...e,now:Date.now()})},y={args:{agent:a}},b={args:{agent:p}},x={args:{agent:u}},S={args:{agent:f}},C={args:{agent:c}},w={args:{agent:s}},T={args:{agent:d}},E={render:e=>(0,g.jsxs)(`div`,{className:`flex flex-col gap-1`,children:[(0,g.jsx)(h,{...e,agent:p,now:Date.now()}),(0,g.jsx)(h,{...e,agent:a,now:Date.now()})]})},D={render:e=>(0,g.jsx)(`div`,{className:`flex flex-col gap-1`,children:[a,p,u].map(t=>(0,_.createElement)(h,{...e,key:t.sessionId,agent:t,now:Date.now()}))})},O={render:e=>(0,g.jsx)(`div`,{className:`flex flex-col gap-1`,children:l.map(t=>(0,_.createElement)(h,{...e,key:t.sessionId,agent:t,now:Date.now()}))})},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    agent: workingAgent
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    agent: waitingAgent
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    agent: askingAgent
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    agent: idleAgent
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotBlockedAgent
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
  render: args => <div className="flex flex-col gap-1">
      <AgentRobotRow {...args} agent={waitingAgent} now={Date.now()} />
      <AgentRobotRow {...args} agent={workingAgent} now={Date.now()} />
    </div>
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-1">
      {[workingAgent, waitingAgent, askingAgent].map(agent => <AgentRobotRow {...args} key={agent.sessionId} agent={agent} now={Date.now()} />)}
    </div>
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-1">
      {everyMoodAgents.map(agent => <AgentRobotRow {...args} key={agent.sessionId} agent={agent} now={Date.now()} />)}
    </div>
}`,...O.parameters?.docs?.source}}},k=[`Working`,`Waiting`,`Asking`,`Idle`,`CopilotBlocked`,`LongTitle`,`NoTranscript`,`WithAndWithoutAPullRequest`,`ContextLevels`,`EveryMood`]})))()}A();export{x as Asking,D as ContextLevels,C as CopilotBlocked,O as EveryMood,S as Idle,w as LongTitle,T as NoTranscript,b as Waiting,E as WithAndWithoutAPullRequest,y as Working,k as __namedExportsOrder,v as default};