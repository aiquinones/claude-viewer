import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{at as t,it as n,n as r}from"./iframe-BaaE8k-b.js";import{n as i,t as a}from"./SettingsContext-CZTAfRBU.js";import{i as o,r as s}from"./surfaces-G20-LIJZ.js";import{n as c,t as l}from"./SessionAnalysisView-Dk7LUeSr.js";import{c as u,r as d}from"./usage-fixtures-e02vJPqw.js";import{a as f,i as p,n as m,o as h,r as g,s as _,t as v}from"./session-detail-fixtures-DjfPWwVC.js";var y,b,x,S,C,w,T,E,D,O,k,A;function j(){return(j=e((()=>{s(),t(),i(),c(),h(),d(),y=r(),b=({metric:e,costBasis:t,estimator:r,children:i})=>{let o={...n,tokens:{estimator:{value:r??`standard`,source:r?`user`:`default`}},usage:{...n.usage,metric:{value:e??`output-tokens`,source:e?`user`:`default`},costBasis:{value:t??`all`,source:t?`user`:`default`}}};return(0,y.jsx)(a,{settings:o,children:i})},x={title:`Usage/SessionAnalysisView`,component:l,args:{session:g,detail:m,onRequestDetail:()=>void 0,skills:u,onOpenSkill:()=>void 0,onCopyId:()=>void 0,onSearch:()=>void 0,onRefresh:()=>void 0,onBack:()=>void 0},decorators:[e=>(0,y.jsx)(`div`,{className:`h-screen`,style:{"--surface-accent":o(`usage`)},children:(0,y.jsx)(e,{})})]},S={},C={render:e=>(0,y.jsx)(b,{metric:`cost`,children:(0,y.jsx)(l,{...e})})},w={args:{session:f,detail:p}},T={render:e=>(0,y.jsx)(b,{estimator:`standard`,children:(0,y.jsx)(l,{...e})})},E={render:e=>(0,y.jsx)(b,{estimator:`anthropic`,children:(0,y.jsx)(l,{...e})})},D={args:{detail:v}},O={args:{detail:_}},k={args:{detail:void 0}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: args => <WithSettings metric="cost">
      <SessionAnalysisView {...args} />
    </WithSettings>
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    session: copilotSession,
    detail: copilotDetail
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: args => <WithSettings estimator="standard">
      <SessionAnalysisView {...args} />
    </WithSettings>
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: args => <WithSettings estimator="anthropic">
      <SessionAnalysisView {...args} />
    </WithSettings>
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    detail: bareDetail
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    detail: missingDetail
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    detail: undefined
  }
}`,...k.parameters?.docs?.source}}},A=[`Claude`,`Cost`,`CopilotDoubleLoad`,`EstimatorOverridden`,`EstimatorAgrees`,`NoSkills`,`Unreadable`,`Loading`]})))()}j();export{S as Claude,w as CopilotDoubleLoad,C as Cost,E as EstimatorAgrees,T as EstimatorOverridden,k as Loading,D as NoSkills,O as Unreadable,A as __namedExportsOrder,x as default};