import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{at as t,it as n,n as r}from"./iframe-CZV6QZOv.js";import{n as i,t as a}from"./AgentContext-Cqd726cg.js";import{n as o,t as s}from"./SettingsContext-BFxAq-T4.js";import{_ as c,f as l,g as u,h as d,n as f,o as p,p as m,u as h}from"./agent-fixtures-TjywyVU2.js";var g,_,v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{t(),i(),h(),o(),g=r(),_={title:`Agents/AgentContext`,component:a,decorators:[e=>(0,g.jsx)(`div`,{className:`w-[380px] p-6 pb-64`,children:(0,g.jsx)(e,{})})]},v={args:{agent:c}},y={args:{agent:u}},b={args:{agent:f}},x={args:{agent:d}},S={args:{agent:m}},C={args:{agent:u},decorators:[e=>(0,g.jsx)(s,{settings:{...n,context:{...n.context,warnAt:{value:15e4,source:`user`},errorAt:{value:25e4,source:`workspace`}}},children:(0,g.jsx)(e,{})})]},w={args:{agent:p}},T={args:{agent:l}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    agent: workingAgent
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    agent: waitingAgent
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    agent: askingAgent
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    agent: unknownModelAgent
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    agent: overWindowAgent
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    agent: waitingAgent
  },
  decorators: [Story => <SettingsProvider settings={{
    ...DEFAULT_SETTINGS,
    context: {
      ...DEFAULT_SETTINGS.context,
      warnAt: {
        value: 150_000,
        source: 'user'
      },
      errorAt: {
        value: 250_000,
        source: 'workspace'
      }
    }
  }}>
        <Story />
      </SettingsProvider>]
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotWorkingAgent
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    agent: noTranscriptAgent
  }
}`,...T.parameters?.docs?.source}}},E=[`Within`,`Near`,`Over`,`UnknownModel`,`PastTheWindow`,`YourOwnThresholds`,`Copilot`,`NothingMeasuredYet`]})))()}D();export{w as Copilot,y as Near,T as NothingMeasuredYet,b as Over,S as PastTheWindow,x as UnknownModel,v as Within,C as YourOwnThresholds,E as __namedExportsOrder,_ as default};