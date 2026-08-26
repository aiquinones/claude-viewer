import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{at as t,it as n,n as r}from"./iframe-gL6tl4-b.js";import{n as i,t as a}from"./SettingsContext-BStiu3qm.js";import{n as o,t as s}from"./UsageView-ajfkNEjq.js";import{a as c,i as l,n as u,o as d,r as f,s as p,t as m}from"./usage-fixtures-DUxL2jMT.js";import{a as h,c as g,i as _,l as v,n as y,t as b,u as x}from"./usage-history-fixtures-DCkgAFWN.js";var S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G;function K(){return(K=e((()=>{t(),i(),f(),h(),o(),S=r(),C=({metric:e,scope:t,children:r})=>{let i={...n,usage:{metric:{value:e??`output-tokens`,source:e?`user`:`default`},scope:{value:t??`all`,source:t?`user`:`default`}}};return(0,S.jsx)(a,{settings:i,children:r})},w={title:`Usage/UsageView`,component:s,args:{report:u,history:b,workspaceRoot:`/Users/dev/repos/example-app`,initialTab:`sessions`,skills:p,onOpenSkill:()=>void 0,sessionDetail:void 0,onWatchSession:()=>void 0,agents:[],onCopySessionId:()=>void 0,onClearRequest:()=>void 0,onOpenSurface:()=>void 0,onSearch:()=>void 0,onRefresh:()=>void 0,onBack:()=>void 0},decorators:[e=>(0,S.jsx)(`div`,{className:`h-screen`,children:(0,S.jsx)(e,{})})]},T={args:{initialTab:`skills`}},E={args:{initialTab:`skills`,initialWindow:`week`}},D={args:{initialTab:`skills`,report:m},render:e=>(0,S.jsx)(C,{metric:`cost`,children:(0,S.jsx)(s,{...e})})},O={args:{initialTab:`skills`,report:m}},k={args:{initialTab:`skills`,report:d},render:e=>(0,S.jsx)(C,{metric:`cost`,children:(0,S.jsx)(s,{...e})})},A={args:{initialTab:`skills`,report:c}},j={args:{initialTab:`skills`,report:l}},M={args:{initialTab:`skills`,report:void 0}},N={},P={args:{history:g}},F={args:{history:_},render:e=>(0,S.jsx)(C,{scope:`workspace`,children:(0,S.jsx)(s,{...e})})},I={args:{history:void 0}},L={args:{history:y}},R={args:{history:x}},z={args:{history:v}},B={args:{history:void 0,request:{sessionId:`session-1`,tool:`claude`,nonce:1,from:`active-agents`}}},V={args:{history:void 0,request:{sessionId:`session-1`,tool:`claude`,nonce:1}}},H={args:{request:{sessionId:`session-1`,tool:`claude`,nonce:1,from:`active-agents`}}},U={args:{request:{sessionId:`session-not-on-disk`,tool:`claude`,nonce:1,from:`active-agents`}}},W={args:{request:{sessionId:`session-not-on-disk`,tool:`copilot`,nonce:1,from:`active-agents`}},render:e=>(0,S.jsx)(C,{scope:`workspace`,children:(0,S.jsx)(s,{...e})})},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
    report: unpricedModel
  },
  render: args => <WithSettings metric="cost">
      <UsageView {...args} />
    </WithSettings>
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    report: quietDay
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    report: noUsage
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    report: undefined
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    history: quietHistory
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    history: emptyHistory
  },
  render: args => <WithSettings scope="workspace">
      <UsageView {...args} />
    </WithSettings>
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    history: undefined
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    history: copilotOnlyHistory
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    history: shortRetention
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    history: resumedOldSession
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    history: undefined,
    request: {
      sessionId: 'session-1',
      tool: 'claude',
      nonce: 1,
      from: 'active-agents'
    }
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    history: undefined,
    request: {
      sessionId: 'session-1',
      tool: 'claude',
      nonce: 1
    }
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    request: {
      sessionId: 'session-1',
      tool: 'claude',
      nonce: 1,
      from: 'active-agents'
    }
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    request: {
      sessionId: 'session-not-on-disk',
      tool: 'claude',
      nonce: 1,
      from: 'active-agents'
    }
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    request: {
      sessionId: 'session-not-on-disk',
      tool: 'copilot',
      nonce: 1,
      from: 'active-agents'
    }
  },
  render: args => <WithSettings scope="workspace">
      <UsageView {...args} />
    </WithSettings>
}`,...W.parameters?.docs?.source}}},G=[`Day`,`Week`,`Cost`,`BothClis`,`UnpricedModel`,`QuietDay`,`Empty`,`Scanning`,`Sessions`,`SessionsQuiet`,`SessionsEmpty`,`SessionsScanning`,`SessionsCopilot`,`SessionsShortRetention`,`SessionsResumedOldSession`,`AnalyzeResolving`,`AnalyzeResolvingFromLink`,`AnalyzeOpens`,`AnalyzeNotFound`,`AnalyzeNotFoundScoped`]})))()}K();export{U as AnalyzeNotFound,W as AnalyzeNotFoundScoped,H as AnalyzeOpens,B as AnalyzeResolving,V as AnalyzeResolvingFromLink,O as BothClis,D as Cost,T as Day,j as Empty,A as QuietDay,M as Scanning,N as Sessions,L as SessionsCopilot,F as SessionsEmpty,P as SessionsQuiet,z as SessionsResumedOldSession,I as SessionsScanning,R as SessionsShortRetention,k as UnpricedModel,E as Week,G as __namedExportsOrder,w as default};