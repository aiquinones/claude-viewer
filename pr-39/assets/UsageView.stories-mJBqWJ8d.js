import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{U as t,W as n,n as r}from"./iframe-afBwb2lN.js";import{n as i,t as a}from"./SettingsContext-_PtjlPVy.js";import{n as o,t as s}from"./UsageView-Du2vG8Jh.js";import{a as c,i as l,n as u,o as d,r as f,s as p,t as m}from"./usage-fixtures-CE6BE8nj.js";var h,g,_,v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{n(),i(),f(),o(),h=r(),g=({metric:e,scope:n,children:r})=>{let i={...t,usage:{metric:{value:e??`output-tokens`,source:e?`user`:`default`},scope:{value:n??`all`,source:n?`user`:`default`}}};return(0,h.jsx)(a,{settings:i,children:r})},_={title:`Usage/UsageView`,component:s,args:{report:u,skills:p,onOpenSkill:()=>void 0,onSearch:()=>void 0,onRefresh:()=>void 0,onBack:()=>void 0},decorators:[e=>(0,h.jsx)(`div`,{className:`h-screen`,children:(0,h.jsx)(e,{})})]},v={},y={args:{initialWindow:`week`}},b={args:{report:m},render:e=>(0,h.jsx)(g,{metric:`cost`,children:(0,h.jsx)(s,{...e})})},x={args:{report:m}},S={args:{report:d},render:e=>(0,h.jsx)(g,{metric:`cost`,children:(0,h.jsx)(s,{...e})})},C={args:{report:c}},w={args:{report:l}},T={args:{report:void 0}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    initialWindow: 'week'
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    report: bothClis
  },
  render: args => <WithSettings metric="cost">
      <UsageView {...args} />
    </WithSettings>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    report: bothClis
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    report: unpricedModel
  },
  render: args => <WithSettings metric="cost">
      <UsageView {...args} />
    </WithSettings>
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    report: quietDay
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    report: noUsage
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    report: undefined
  }
}`,...T.parameters?.docs?.source}}},E=[`Day`,`Week`,`Cost`,`BothClis`,`UnpricedModel`,`QuietDay`,`Empty`,`Scanning`]})))()}D();export{x as BothClis,b as Cost,v as Day,w as Empty,C as QuietDay,T as Scanning,S as UnpricedModel,y as Week,E as __namedExportsOrder,_ as default};