import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{at as t,it as n,n as r}from"./iframe-CJh_dunT.js";import{n as i,t as a}from"./SettingsContext-B2YPTxgo.js";import{i as o,r as s}from"./surfaces-BgX2rKpN.js";import{n as c,t as l}from"./ContextSection-B6GM2iib.js";import{c as u,i as d,n as f,o as p}from"./session-detail-fixtures-DjfPWwVC.js";var m,h,g,_,v,y,b;function x(){return(x=e((()=>{t(),c(),i(),s(),p(),m=r(),h={title:`Usage/ContextSection`,component:l,args:{detail:f},decorators:[e=>(0,m.jsx)(`div`,{className:`w-[42rem] max-w-full p-4`,style:{"--surface-accent":o(`usage`)},children:(0,m.jsx)(e,{})})]},g={},_={decorators:[e=>(0,m.jsx)(a,{settings:{...n,context:{...n.context,warnAt:{value:4e4,source:`user`},errorAt:{value:9e4,source:`workspace`}}},children:(0,m.jsx)(e,{})})]},v={args:{detail:d}},y={args:{detail:u}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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