import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{at as t,it as n,n as r}from"./iframe-DYWEEjxs.js";import{n as i,t as a}from"./SettingsContext-CMzpLude.js";import{n as o,t as s}from"./UsageView-BAjRPqic.js";import{a as c,c as l,i as u,l as d,n as f,r as p,t as m}from"./usage-fixtures-CRITKOHz.js";import{a as h,c as g,i as _,l as v,n as y,t as b,u as x}from"./usage-history-fixtures-DCkgAFWN.js";var S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W;function G(){return(G=e((()=>{t(),i(),p(),h(),o(),S=r(),C=({scope:e,children:t})=>{let r={...n,usage:{scope:{value:e??`all`,source:e?`user`:`default`}}};return(0,S.jsx)(a,{settings:r,children:t})},w={title:`Usage/UsageView`,component:s,args:{report:f,history:b,workspaceRoot:`/Users/dev/repos/example-app`,initialTab:`sessions`,skills:d,onOpenSkill:()=>void 0,sessionDetail:void 0,onWatchSession:()=>void 0,agents:[],onCopySessionId:()=>void 0,onClearRequest:()=>void 0,onOpenSurface:()=>void 0,onSearch:()=>void 0,onRefresh:()=>void 0,onBack:()=>void 0},decorators:[e=>(0,S.jsx)(`div`,{className:`h-screen`,children:(0,S.jsx)(e,{})})]},T={args:{initialTab:`skills`}},E={args:{initialTab:`skills`,initialWindow:`week`}},D={args:{initialTab:`skills`,report:m}},O={args:{initialTab:`skills`,report:l}},k={args:{initialTab:`skills`,report:c}},A={args:{initialTab:`skills`,report:u}},j={args:{initialTab:`skills`,report:void 0}},M={},N={args:{history:g}},P={args:{history:_},render:e=>(0,S.jsx)(C,{scope:`workspace`,children:(0,S.jsx)(s,{...e})})},F={args:{history:void 0}},I={args:{history:y}},L={args:{history:x}},R={args:{history:v}},z={args:{history:void 0,request:{sessionId:`session-1`,tool:`claude`,nonce:1,from:`active-agents`}}},B={args:{history:void 0,request:{sessionId:`session-1`,tool:`claude`,nonce:1}}},V={args:{request:{sessionId:`session-1`,tool:`claude`,nonce:1,from:`active-agents`}}},H={args:{request:{sessionId:`session-not-on-disk`,tool:`claude`,nonce:1,from:`active-agents`}}},U={args:{request:{sessionId:`session-not-on-disk`,tool:`copilot`,nonce:1,from:`active-agents`}},render:e=>(0,S.jsx)(C,{scope:`workspace`,children:(0,S.jsx)(s,{...e})})},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    report: unpricedModel
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    report: quietDay
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    report: noUsage
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    initialTab: 'skills',
    report: undefined
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    history: quietHistory
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    history: emptyHistory
  },
  render: args => <WithSettings scope="workspace">
      <UsageView {...args} />
    </WithSettings>
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    history: undefined
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    history: copilotOnlyHistory
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    history: shortRetention
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    history: resumedOldSession
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    history: undefined,
    request: {
      sessionId: 'session-1',
      tool: 'claude',
      nonce: 1,
      from: 'active-agents'
    }
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    history: undefined,
    request: {
      sessionId: 'session-1',
      tool: 'claude',
      nonce: 1
    }
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    request: {
      sessionId: 'session-1',
      tool: 'claude',
      nonce: 1,
      from: 'active-agents'
    }
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    request: {
      sessionId: 'session-not-on-disk',
      tool: 'claude',
      nonce: 1,
      from: 'active-agents'
    }
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}},W=[`Day`,`Week`,`BothClis`,`UnpricedModel`,`QuietDay`,`Empty`,`Scanning`,`Sessions`,`SessionsQuiet`,`SessionsEmpty`,`SessionsScanning`,`SessionsCopilot`,`SessionsShortRetention`,`SessionsResumedOldSession`,`AnalyzeResolving`,`AnalyzeResolvingFromLink`,`AnalyzeOpens`,`AnalyzeNotFound`,`AnalyzeNotFoundScoped`]})))()}G();export{H as AnalyzeNotFound,U as AnalyzeNotFoundScoped,V as AnalyzeOpens,z as AnalyzeResolving,B as AnalyzeResolvingFromLink,D as BothClis,T as Day,A as Empty,k as QuietDay,j as Scanning,M as Sessions,I as SessionsCopilot,P as SessionsEmpty,N as SessionsQuiet,R as SessionsResumedOldSession,F as SessionsScanning,L as SessionsShortRetention,O as UnpricedModel,E as Week,W as __namedExportsOrder,w as default};