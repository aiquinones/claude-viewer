import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{at as t,it as n,n as r}from"./iframe-jcHePZlb.js";import{n as i,t as a}from"./AgentContext-Dl49FmwX.js";import{n as o,t as s}from"./SettingsContext-BhMMRyx9.js";import{_ as c,f as l,g as u,h as d,i as f,n as p,o as m,p as h,u as g}from"./agent-fixtures-CeP0Si6X.js";var _,v,y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{t(),i(),g(),o(),_=r(),v={title:`Agents/AgentContext`,component:a,decorators:[e=>(0,_.jsx)(`div`,{className:`w-[380px] p-6 pb-64`,children:(0,_.jsx)(e,{})})]},y={args:{agent:c}},b={args:{agent:u}},x={args:{agent:p}},S={args:{agent:d}},C={args:{agent:h}},w={args:{agent:u},decorators:[e=>(0,_.jsx)(s,{settings:{...n,context:{...n.context,warnAt:{value:15e4,source:`user`},errorAt:{value:25e4,source:`workspace`}}},children:(0,_.jsx)(e,{})})]},T={args:{agent:m}},E={args:{agent:f}},D={args:{agent:l}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
    agent: unknownModelAgent
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    agent: overWindowAgent
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotWorkingAgent
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    agent: copilotBlockedAgent
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    agent: noTranscriptAgent
  }
}`,...D.parameters?.docs?.source}}},O=[`Within`,`Near`,`Over`,`UnknownModel`,`PastTheWindow`,`YourOwnThresholds`,`Copilot`,`CopilotDottedModelId`,`NothingMeasuredYet`]})))()}k();export{T as Copilot,E as CopilotDottedModelId,b as Near,D as NothingMeasuredYet,x as Over,C as PastTheWindow,S as UnknownModel,y as Within,w as YourOwnThresholds,O as __namedExportsOrder,v as default};