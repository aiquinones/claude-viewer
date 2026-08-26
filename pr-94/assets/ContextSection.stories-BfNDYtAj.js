import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ct as t,at as n,it as r,n as i,wt as a}from"./iframe-BcKe7zli.js";import{n as o,t as s}from"./SettingsContext-CnNdN-Yj.js";import{i as c,n as l,o as u,u as d}from"./session-detail-fixtures-i6NA3UbE.js";import{n as f,t as p}from"./ContextSection-e0cBhjNa.js";var m,h,g,_,v,y,b;function x(){return(x=e((()=>{n(),f(),o(),t(),u(),m=i(),h={title:`Usage/ContextSection`,component:p,args:{detail:l},decorators:[e=>(0,m.jsx)(`div`,{className:`w-[42rem] max-w-full p-4`,style:{"--surface-accent":a(`usage`)},children:(0,m.jsx)(e,{})})]},g={},_={decorators:[e=>(0,m.jsx)(s,{settings:{...r,context:{...r.context,warnAt:{value:4e4,source:`user`},errorAt:{value:9e4,source:`workspace`}}},children:(0,m.jsx)(e,{})})]},v={args:{detail:c}},y={args:{detail:d}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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