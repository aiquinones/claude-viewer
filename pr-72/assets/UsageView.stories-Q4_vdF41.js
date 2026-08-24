import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{at as t,it as n,n as r}from"./iframe-Ccx8pIed.js";import{n as i,t as a}from"./SettingsContext-D_RAVi0r.js";import{n as o,t as s}from"./UsageView-DqgHEved.js";import{a as c,c as l,i as u,n as d,o as f,r as p,s as m,t as h}from"./usage-fixtures-n07lhUR-.js";import{a as g,c as _,i as v,l as y,n as b,t as x,u as S}from"./usage-history-fixtures-DCmA5SsM.js";var C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H;function U(){return(U=e((()=>{t(),i(),p(),g(),o(),C=r(),w=({metric:e,scope:t,costBasis:r,children:i})=>{let o={...n,usage:{metric:{value:e??`output-tokens`,source:e?`user`:`default`},scope:{value:t??`all`,source:t?`user`:`default`},costBasis:{value:r??`all`,source:r?`user`:`default`}}};return(0,C.jsx)(a,{settings:o,children:i})},T={title:`Usage/UsageView`,component:s,args:{report:d,history:x,workspaceRoot:`/Users/dev/repos/example-app`,initialTab:`sessions`,skills:l,onOpenSkill:()=>void 0,onOpenSession:()=>void 0,onSearch:()=>void 0,onRefresh:()=>void 0,onBack:()=>void 0},decorators:[e=>(0,C.jsx)(`div`,{className:`h-screen`,children:(0,C.jsx)(e,{})})]},E={args:{initialTab:`skills`}},D={args:{initialTab:`skills`,initialWindow:`week`}},O={args:{initialTab:`skills`,report:h},render:e=>(0,C.jsx)(w,{metric:`cost`,children:(0,C.jsx)(s,{...e})})},k={args:{initialTab:`skills`,report:h}},A={args:{initialTab:`skills`,report:c},render:e=>(0,C.jsx)(w,{metric:`cost`,costBasis:`output`,children:(0,C.jsx)(s,{...e})})},j={args:{initialTab:`skills`,report:m},render:e=>(0,C.jsx)(w,{metric:`cost`,children:(0,C.jsx)(s,{...e})})},M={args:{initialTab:`skills`,report:f}},N={args:{initialTab:`skills`,report:u}},P={args:{initialTab:`skills`,report:void 0}},F={},I={args:{history:_}},L={args:{history:v},render:e=>(0,C.jsx)(w,{scope:`workspace`,children:(0,C.jsx)(s,{...e})})},R={args:{history:void 0}},z={args:{history:b}},B={args:{history:S}},V={args:{history:y}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills'
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    initialWindow: 'week'
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    report: bothClis
  },
  render: args => <WithSettings metric="cost">
      <UsageView {...args} />
    </WithSettings>
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    report: bothClis
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    report: outputOnlyBasis
  },
  render: args => <WithSettings metric="cost" costBasis="output">
      <UsageView {...args} />
    </WithSettings>
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    report: unpricedModel
  },
  render: args => <WithSettings metric="cost">
      <UsageView {...args} />
    </WithSettings>
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    report: quietDay
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    report: noUsage
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    report: undefined
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    history: quietHistory
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    history: emptyHistory
  },
  render: args => <WithSettings scope="workspace">
      <UsageView {...args} />
    </WithSettings>
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    history: undefined
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    history: copilotOnlyHistory
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    history: shortRetention
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    history: resumedOldSession
  }
}`,...V.parameters?.docs?.source}}},H=[`Day`,`Week`,`Cost`,`BothClis`,`CostFromOutputOnly`,`UnpricedModel`,`QuietDay`,`Empty`,`Scanning`,`Sessions`,`SessionsQuiet`,`SessionsEmpty`,`SessionsScanning`,`SessionsCopilot`,`SessionsShortRetention`,`SessionsResumedOldSession`]})))()}U();export{k as BothClis,O as Cost,A as CostFromOutputOnly,E as Day,N as Empty,M as QuietDay,P as Scanning,F as Sessions,z as SessionsCopilot,L as SessionsEmpty,I as SessionsQuiet,V as SessionsResumedOldSession,R as SessionsScanning,B as SessionsShortRetention,j as UnpricedModel,D as Week,H as __namedExportsOrder,T as default};