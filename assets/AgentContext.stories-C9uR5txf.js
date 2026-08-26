import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{at as t,it as n,n as r}from"./iframe-BcKe7zli.js";import{n as i,t as a}from"./SettingsContext-CnNdN-Yj.js";import{n as o,t as s}from"./AgentContext-DgLMH9xm.js";import{b as c,d as l,i as u,m as d,n as f,p,s as m,v as h,y as g}from"./agent-fixtures-CyMKSaI8.js";var _,v,y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{t(),o(),l(),i(),_=r(),v={title:`Agents/AgentContext`,component:s,decorators:[e=>(0,_.jsx)(`div`,{className:`w-[380px] p-6 pb-64`,children:(0,_.jsx)(e,{})})]},y={args:{context:c.context}},b={args:{context:g.context}},x={args:{context:f.context}},S={args:{context:h.context}},C={args:{context:d.context}},w={args:{context:g.context},decorators:[e=>(0,_.jsx)(a,{settings:{...n,context:{...n.context,warnAt:{value:15e4,source:`user`},errorAt:{value:25e4,source:`workspace`}}},children:(0,_.jsx)(e,{})})]},T={args:{context:m.context}},E={args:{context:u.context}},D={args:{context:p.context}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    context: workingAgent.context
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    context: waitingAgent.context
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    context: askingAgent.context
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    context: unknownModelAgent.context
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    context: overWindowAgent.context
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    context: waitingAgent.context
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
    context: copilotWorkingAgent.context
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    context: copilotBlockedAgent.context
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    context: noTranscriptAgent.context
  }
}`,...D.parameters?.docs?.source}}},O=[`Within`,`Near`,`Over`,`UnknownModel`,`PastTheWindow`,`YourOwnThresholds`,`Copilot`,`CopilotDottedModelId`,`NothingMeasuredYet`]})))()}k();export{T as Copilot,E as CopilotDottedModelId,b as Near,D as NothingMeasuredYet,x as Over,C as PastTheWindow,S as UnknownModel,y as Within,w as YourOwnThresholds,O as __namedExportsOrder,v as default};