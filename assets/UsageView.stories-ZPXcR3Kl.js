import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{at as t,it as n,n as r}from"./iframe-CCFUdQ9e.js";import{n as i,t as a}from"./SettingsContext-U3kMGjCu.js";import{n as o,t as s}from"./UsageView-DUl5EGV_.js";import{a as c,c as l,i as u,n as d,o as f,r as p,s as m,t as h}from"./usage-fixtures-h0n3i2QB.js";import{c as g,i as _,o as v,r as y,s as b,t as x}from"./usage-history-fixtures-DlKL4wJP.js";var S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H;function U(){return(U=e((()=>{t(),i(),p(),_(),o(),S=r(),C=({metric:e,scope:t,costBasis:r,children:i})=>{let o={...n,usage:{metric:{value:e??`output-tokens`,source:e?`user`:`default`},scope:{value:t??`all`,source:t?`user`:`default`},costBasis:{value:r??`all`,source:r?`user`:`default`}}};return(0,S.jsx)(a,{settings:o,children:i})},w={title:`Usage/UsageView`,component:s,args:{report:d,history:x,workspaceRoot:`/Users/dev/repos/example-app`,initialTab:`sessions`,skills:l,onOpenSkill:()=>void 0,onOpenSession:()=>void 0,onSearch:()=>void 0,onRefresh:()=>void 0,onBack:()=>void 0},decorators:[e=>(0,S.jsx)(`div`,{className:`h-screen`,children:(0,S.jsx)(e,{})})]},T={args:{initialTab:`skills`}},E={args:{initialTab:`skills`,initialWindow:`week`}},D={args:{initialTab:`skills`,report:h},render:e=>(0,S.jsx)(C,{metric:`cost`,children:(0,S.jsx)(s,{...e})})},O={args:{initialTab:`skills`,report:h}},k={args:{initialTab:`skills`,report:c},render:e=>(0,S.jsx)(C,{metric:`cost`,costBasis:`output`,children:(0,S.jsx)(s,{...e})})},A={args:{initialTab:`skills`,report:m},render:e=>(0,S.jsx)(C,{metric:`cost`,children:(0,S.jsx)(s,{...e})})},j={args:{initialTab:`skills`,report:f}},M={args:{initialTab:`skills`,report:u}},N={args:{initialTab:`skills`,report:void 0}},P={},F={args:{history:v}},I={args:{history:y},render:e=>(0,S.jsx)(C,{scope:`workspace`,children:(0,S.jsx)(s,{...e})})},L={args:{history:void 0}},R={args:{initialTool:`copilot`}},z={args:{initialMetric:`sessions`}},B={args:{history:g}},V={args:{history:b}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills'
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    initialWindow: 'week'
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    report: bothClis
  },
  render: args => <WithSettings metric="cost">
      <UsageView {...args} />
    </WithSettings>
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    report: bothClis
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    report: outputOnlyBasis
  },
  render: args => <WithSettings metric="cost" costBasis="output">
      <UsageView {...args} />
    </WithSettings>
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    report: unpricedModel
  },
  render: args => <WithSettings metric="cost">
      <UsageView {...args} />
    </WithSettings>
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    report: quietDay
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    report: noUsage
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    report: undefined
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    history: quietHistory
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    history: emptyHistory
  },
  render: args => <WithSettings scope="workspace">
      <UsageView {...args} />
    </WithSettings>
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    history: undefined
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    initialTool: 'copilot'
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    initialMetric: 'sessions'
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    history: shortRetention
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    history: resumedOldSession
  }
}`,...V.parameters?.docs?.source}}},H=[`Day`,`Week`,`Cost`,`BothClis`,`CostFromOutputOnly`,`UnpricedModel`,`QuietDay`,`Empty`,`Scanning`,`Sessions`,`SessionsQuiet`,`SessionsEmpty`,`SessionsScanning`,`SessionsCopilot`,`SessionsByCount`,`SessionsShortRetention`,`SessionsResumedOldSession`]})))()}U();export{O as BothClis,D as Cost,k as CostFromOutputOnly,T as Day,M as Empty,j as QuietDay,N as Scanning,P as Sessions,z as SessionsByCount,R as SessionsCopilot,I as SessionsEmpty,F as SessionsQuiet,V as SessionsResumedOldSession,L as SessionsScanning,B as SessionsShortRetention,A as UnpricedModel,E as Week,H as __namedExportsOrder,w as default};