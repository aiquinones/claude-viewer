import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ct as t,at as n,it as r,n as i,wt as a}from"./iframe-MHXp9LG4.js";import{n as o,t as s}from"./SettingsContext-2ZUpkJ7e.js";import{c,f as l,n as u,o as d}from"./session-detail-fixtures-Bn3SOtaQ.js";import{n as f,t as p}from"./ContextSection-BRAs3JiC.js";var m,h,g,_,v,y,b;function x(){return(x=e((()=>{n(),f(),o(),t(),c(),m=i(),h={title:`Usage/ContextSection`,component:p,args:{detail:u},decorators:[e=>(0,m.jsx)(`div`,{className:`w-[42rem] max-w-full p-4`,style:{"--surface-accent":a(`usage`)},children:(0,m.jsx)(e,{})})]},g={},_={decorators:[e=>(0,m.jsx)(s,{settings:{...r,context:{...r.context,warnAt:{value:4e4,source:`user`},errorAt:{value:9e4,source:`workspace`}}},children:(0,m.jsx)(e,{})})]},v={args:{detail:d}},y={args:{detail:l}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <SettingsProvider settings={{
    ...DEFAULT_SETTINGS,
    context: {
      ...DEFAULT_SETTINGS.context,
      warnAt: {
        value: 40_000,
        source: 'user'
      },
      errorAt: {
        value: 90_000,
        source: 'workspace'
      }
    }
  }}>
        <Story />
      </SettingsProvider>]
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    detail: copilotDetail
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    detail: noContextDetail
  }
}`,...y.parameters?.docs?.source}}},b=[`Session`,`PastBothThresholds`,`Copilot`,`NoReadings`]})))()}x();export{v as Copilot,y as NoReadings,_ as PastBothThresholds,g as Session,b as __namedExportsOrder,h as default};