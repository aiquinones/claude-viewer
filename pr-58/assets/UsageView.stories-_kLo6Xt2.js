import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{at as t,it as n,n as r}from"./iframe-ClcsezqQ.js";import{n as i,t as a}from"./SettingsContext-CXltzVy2.js";import{n as o,t as s}from"./UsageView-B0gpEXw6.js";import{a as c,c as l,i as u,n as d,o as f,r as p,s as m,t as h}from"./usage-fixtures-DaYJl_Ge.js";import{i as g,o as _,r as v,t as y}from"./usage-history-fixtures-Dzm3bk3b.js";var b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I;function L(){return(L=e((()=>{t(),i(),p(),g(),o(),b=r(),x=({metric:e,scope:t,costBasis:r,children:i})=>{let o={...n,usage:{metric:{value:e??`output-tokens`,source:e?`user`:`default`},scope:{value:t??`all`,source:t?`user`:`default`},costBasis:{value:r??`all`,source:r?`user`:`default`}}};return(0,b.jsx)(a,{settings:o,children:i})},S={title:`Usage/UsageView`,component:s,args:{report:d,history:y,workspaceRoot:`/Users/dev/repos/example-app`,initialTab:`skills`,skills:l,onOpenSkill:()=>void 0,onOpenSession:()=>void 0,onSearch:()=>void 0,onRefresh:()=>void 0,onBack:()=>void 0},decorators:[e=>(0,b.jsx)(`div`,{className:`h-screen`,children:(0,b.jsx)(e,{})})]},C={},w={args:{initialWindow:`week`}},T={args:{report:h},render:e=>(0,b.jsx)(x,{metric:`cost`,children:(0,b.jsx)(s,{...e})})},E={args:{report:h}},D={args:{report:c},render:e=>(0,b.jsx)(x,{metric:`cost`,costBasis:`output`,children:(0,b.jsx)(s,{...e})})},O={args:{report:m},render:e=>(0,b.jsx)(x,{metric:`cost`,children:(0,b.jsx)(s,{...e})})},k={args:{report:f}},A={args:{report:u}},j={args:{report:void 0}},M={args:{initialTab:`sessions`}},N={args:{initialTab:`sessions`,history:_}},P={args:{initialTab:`sessions`,history:v}},F={args:{initialTab:`sessions`,history:void 0}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    initialWindow: 'week'
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    report: bothClis
  },
  render: args => <WithSettings metric="cost">
      <UsageView {...args} />
    </WithSettings>
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    report: bothClis
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    report: outputOnlyBasis
  },
  render: args => <WithSettings metric="cost" costBasis="output">
      <UsageView {...args} />
    </WithSettings>
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    report: unpricedModel
  },
  render: args => <WithSettings metric="cost">
      <UsageView {...args} />
    </WithSettings>
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    report: quietDay
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    report: noUsage
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    report: undefined
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'sessions'
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'sessions',
    history: quietHistory
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'sessions',
    history: emptyHistory
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'sessions',
    history: undefined
  }
}`,...F.parameters?.docs?.source}}},I=[`Day`,`Week`,`Cost`,`BothClis`,`CostFromOutputOnly`,`UnpricedModel`,`QuietDay`,`Empty`,`Scanning`,`Sessions`,`SessionsQuiet`,`SessionsEmpty`,`SessionsScanning`]})))()}L();export{E as BothClis,T as Cost,D as CostFromOutputOnly,C as Day,A as Empty,k as QuietDay,j as Scanning,M as Sessions,P as SessionsEmpty,N as SessionsQuiet,F as SessionsScanning,O as UnpricedModel,w as Week,I as __namedExportsOrder,S as default};