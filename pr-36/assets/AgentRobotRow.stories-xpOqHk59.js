import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{ct as t,g as n,n as r,r as i}from"./iframe-CqpD256r.js";import{c as a,d as o,f as s,h as c,i as l,l as u,m as d,n as f,u as p}from"./agent-fixtures-CMbQUuOo.js";import{n as m,t as h}from"./AgentRobotRow-HzyOeo31.js";var g,_,v,y,b,x,S,C,w,T,E,D;function O(){return(O=e((()=>{p(),m(),n(),g=r(),_=t(),v={title:`Agents/AgentRobotRow`,component:h,args:{workspaceRoot:i,onOpen:()=>void 0},decorators:[e=>(0,g.jsx)(`div`,{className:`p-3`,children:(0,g.jsx)(e,{})})],render:e=>(0,g.jsx)(h,{...e,now:Date.now()})},y={args:{agent:c}},b={args:{agent:d}},x={args:{agent:f}},S={args:{agent:u}},C={args:{agent:l}},w={args:{agent:o}},T={args:{agent:s}},E={render:e=>(0,g.jsx)(`div`,{className:`flex flex-col gap-1`,children:a.map(t=>(0,_.createElement)(h,{...e,key:t.sessionId,agent:t,now:Date.now()}))})},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
      {everyMoodAgents.map(agent => <AgentRobotRow {...args} key={agent.sessionId} agent={agent} now={Date.now()} />)}
    </div>
}`,...E.parameters?.docs?.source}}},D=[`Working`,`Waiting`,`Asking`,`Idle`,`CopilotBlocked`,`LongTitle`,`NoTranscript`,`EveryMood`]})))()}O();export{x as Asking,C as CopilotBlocked,E as EveryMood,S as Idle,w as LongTitle,T as NoTranscript,b as Waiting,y as Working,D as __namedExportsOrder,v as default};