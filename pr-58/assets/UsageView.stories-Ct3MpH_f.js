import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{at as t,it as n,n as r}from"./iframe-CZV6QZOv.js";import{n as i,t as a}from"./SettingsContext-BFxAq-T4.js";import{n as o,t as s}from"./UsageView-CBhunXq4.js";import{a as c,c as l,i as u,n as d,o as f,r as p,s as m,t as h}from"./usage-fixtures-Bfk9Rese.js";import{c as g,i as _,o as v,r as y,s as b,t as x}from"./usage-history-fixtures-DlKL4wJP.js";var S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H;function U(){return(U=e((()=>{t(),i(),p(),_(),o(),S=r(),C=({metric:e,scope:t,costBasis:r,children:i})=>{let o={...n,usage:{metric:{value:e??`output-tokens`,source:e?`user`:`default`},scope:{value:t??`all`,source:t?`user`:`default`},costBasis:{value:r??`all`,source:r?`user`:`default`}}};return(0,S.jsx)(a,{settings:o,children:i})},w={title:`Usage/UsageView`,component:s,args:{report:d,history:x,workspaceRoot:`/Users/dev/repos/example-app`,initialTab:`skills`,skills:l,onOpenSkill:()=>void 0,onOpenSession:()=>void 0,onSearch:()=>void 0,onRefresh:()=>void 0,onBack:()=>void 0},decorators:[e=>(0,S.jsx)(`div`,{className:`h-screen`,children:(0,S.jsx)(e,{})})]},T={},E={args:{initialWindow:`week`}},D={args:{report:h},render:e=>(0,S.jsx)(C,{metric:`cost`,children:(0,S.jsx)(s,{...e})})},O={args:{report:h}},k={args:{report:c},render:e=>(0,S.jsx)(C,{metric:`cost`,costBasis:`output`,children:(0,S.jsx)(s,{...e})})},A={args:{report:m},render:e=>(0,S.jsx)(C,{metric:`cost`,children:(0,S.jsx)(s,{...e})})},j={args:{report:f}},M={args:{report:u}},N={args:{report:void 0}},P={args:{initialTab:`sessions`}},F={args:{initialTab:`sessions`,history:v}},I={args:{initialTab:`sessions`,history:y}},L={args:{initialTab:`sessions`,history:void 0}},R={args:{initialTab:`sessions`,initialTool:`copilot`}},z={args:{initialTab:`sessions`,initialMetric:`sessions`}},B={args:{initialTab:`sessions`,history:g}},V={args:{initialTab:`sessions`,history:b}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    initialWindow: 'week'
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    report: bothClis
  },
  render: args => <WithSettings metric="cost">
      <UsageView {...args} />
    </WithSettings>
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    report: bothClis
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    report: outputOnlyBasis
  },
  render: args => <WithSettings metric="cost" costBasis="output">
      <UsageView {...args} />
    </WithSettings>
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    report: unpricedModel
  },
  render: args => <WithSettings metric="cost">
      <UsageView {...args} />
    </WithSettings>
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    report: quietDay
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    report: noUsage
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    report: undefined
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'sessions'
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'sessions',
    history: quietHistory
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'sessions',
    history: emptyHistory
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'sessions',
    history: undefined
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'sessions',
    initialTool: 'copilot'
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'sessions',
    initialMetric: 'sessions'
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'sessions',
    history: shortRetention
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'sessions',
    history: resumedOldSession
  }
}`,...V.parameters?.docs?.source}}},H=[`Day`,`Week`,`Cost`,`BothClis`,`CostFromOutputOnly`,`UnpricedModel`,`QuietDay`,`Empty`,`Scanning`,`Sessions`,`SessionsQuiet`,`SessionsEmpty`,`SessionsScanning`,`SessionsCopilot`,`SessionsByCount`,`SessionsShortRetention`,`SessionsResumedOldSession`]})))()}U();export{O as BothClis,D as Cost,k as CostFromOutputOnly,T as Day,M as Empty,j as QuietDay,N as Scanning,P as Sessions,z as SessionsByCount,R as SessionsCopilot,I as SessionsEmpty,F as SessionsQuiet,V as SessionsResumedOldSession,L as SessionsScanning,B as SessionsShortRetention,A as UnpricedModel,E as Week,H as __namedExportsOrder,w as default};