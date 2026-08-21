import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{U as t,W as n,n as r}from"./iframe-BxewVUOQ.js";import{n as i,t as a}from"./SettingsContext-DFCKeHsu.js";import{n as o,t as s}from"./UsageView-aK3DHZqT.js";import{a as c,c as l,i as u,n as d,o as f,r as p,s as m,t as h}from"./usage-fixtures-CjEutVFb.js";var g,_,v,y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{n(),i(),p(),o(),g=r(),_=({metric:e,scope:n,costBasis:r,children:i})=>{let o={...t,usage:{metric:{value:e??`output-tokens`,source:e?`user`:`default`},scope:{value:n??`all`,source:n?`user`:`default`},costBasis:{value:r??`all`,source:r?`user`:`default`}}};return(0,g.jsx)(a,{settings:o,children:i})},v={title:`Usage/UsageView`,component:s,args:{report:d,skills:l,onOpenSkill:()=>void 0,onSearch:()=>void 0,onRefresh:()=>void 0,onBack:()=>void 0},decorators:[e=>(0,g.jsx)(`div`,{className:`h-screen`,children:(0,g.jsx)(e,{})})]},y={},b={args:{initialWindow:`week`}},x={args:{report:h},render:e=>(0,g.jsx)(_,{metric:`cost`,children:(0,g.jsx)(s,{...e})})},S={args:{report:h}},C={args:{report:c},render:e=>(0,g.jsx)(_,{metric:`cost`,costBasis:`output`,children:(0,g.jsx)(s,{...e})})},w={args:{report:m},render:e=>(0,g.jsx)(_,{metric:`cost`,children:(0,g.jsx)(s,{...e})})},T={args:{report:f}},E={args:{report:u}},D={args:{report:void 0}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    initialWindow: 'week'
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    report: bothClis
  },
  render: args => <WithSettings metric="cost">
      <UsageView {...args} />
    </WithSettings>
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    report: bothClis
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    report: outputOnlyBasis
  },
  render: args => <WithSettings metric="cost" costBasis="output">
      <UsageView {...args} />
    </WithSettings>
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    report: unpricedModel
  },
  render: args => <WithSettings metric="cost">
      <UsageView {...args} />
    </WithSettings>
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    report: quietDay
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    report: noUsage
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    report: undefined
  }
}`,...D.parameters?.docs?.source}}},O=[`Day`,`Week`,`Cost`,`BothClis`,`CostFromOutputOnly`,`UnpricedModel`,`QuietDay`,`Empty`,`Scanning`]})))()}k();export{S as BothClis,x as Cost,C as CostFromOutputOnly,y as Day,E as Empty,T as QuietDay,D as Scanning,w as UnpricedModel,b as Week,O as __namedExportsOrder,v as default};