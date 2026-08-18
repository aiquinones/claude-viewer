import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{g as t,n,r,ut as i}from"./iframe-BcGT_Q-v.js";import{c as a,d as o,f as s,h as c,i as l,l as u,m as d,n as f,u as p}from"./agent-fixtures-eh1QQ0sI.js";import{n as m,t as h}from"./AgentRobotRow-7tjxcAc5.js";var g,_,v,y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{p(),m(),t(),g=n(),_=i(),v={title:`Agents/AgentRobotRow`,component:h,args:{workspaceRoot:r,onOpen:()=>void 0},decorators:[e=>(0,g.jsx)(`div`,{className:`p-3`,children:(0,g.jsx)(e,{})})],render:e=>(0,g.jsx)(h,{...e,now:Date.now()})},y={args:{agent:c}},b={args:{agent:d}},x={args:{agent:f}},S={args:{agent:u}},C={args:{agent:l}},w={args:{agent:o}},T={args:{agent:s}},E={render:e=>(0,g.jsxs)(`div`,{className:`flex flex-col gap-1`,children:[(0,g.jsx)(h,{...e,agent:d,now:Date.now()}),(0,g.jsx)(h,{...e,agent:c,now:Date.now()})]})},D={render:e=>(0,g.jsx)(`div`,{className:`flex flex-col gap-1`,children:a.map(t=>(0,_.createElement)(h,{...e,key:t.sessionId,agent:t,now:Date.now()}))})},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
      {everyMoodAgents.map(agent => <AgentRobotRow {...args} key={agent.sessionId} agent={agent} now={Date.now()} />)}
    </div>
}`,...D.parameters?.docs?.source}}},O=[`Working`,`Waiting`,`Asking`,`Idle`,`CopilotBlocked`,`LongTitle`,`NoTranscript`,`WithAndWithoutAPullRequest`,`EveryMood`]})))()}k();export{x as Asking,C as CopilotBlocked,D as EveryMood,S as Idle,w as LongTitle,T as NoTranscript,b as Waiting,E as WithAndWithoutAPullRequest,y as Working,O as __namedExportsOrder,v as default};