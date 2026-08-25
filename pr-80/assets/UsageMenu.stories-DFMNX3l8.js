import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{at as t,it as n,n as r}from"./iframe-DzFFPwaH.js";import{n as i,t as a}from"./SettingsContext-CrWYP_q7.js";import{n as o,t as s}from"./UsageMenu-Cb8HU2Ul.js";var c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{t(),i(),o(),c=r(),l=({metric:e,scope:t,costBasis:r,source:i=`user`,children:o})=>{let s={...n,usage:{...n.usage,...e?{metric:{value:e,source:i}}:{},...t?{scope:{value:t,source:i}}:{},...r?{costBasis:{value:r,source:i}}:{}}};return(0,c.jsx)(a,{settings:s,children:o})},u={title:`Usage/UsageMenu`,component:s,decorators:[e=>(0,c.jsx)(`div`,{className:`flex h-[32rem] justify-end p-6`,children:(0,c.jsx)(e,{})})]},d={render:()=>(0,c.jsx)(l,{source:`default`,children:(0,c.jsx)(s,{})})},f={render:()=>(0,c.jsx)(l,{metric:`cost`,scope:`workspace`,costBasis:`output`,children:(0,c.jsx)(s,{})})},p={render:()=>(0,c.jsx)(l,{scope:`workspace`,source:`workspace`,children:(0,c.jsx)(s,{})})},m={globals:{viewport:{value:`narrowPanel`}},render:()=>(0,c.jsx)(l,{metric:`cost`,children:(0,c.jsx)(s,{})})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <WithUsage source="default">
      <UsageMenu />
    </WithUsage>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <WithUsage metric="cost" scope="workspace" costBasis="output">
      <UsageMenu />
    </WithUsage>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <WithUsage scope="workspace" source="workspace">
      <UsageMenu />
    </WithUsage>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  globals: {
    viewport: {
      value: 'narrowPanel'
    }
  },
  render: () => <WithUsage metric="cost">
      <UsageMenu />
    </WithUsage>
}`,...m.parameters?.docs?.source}}},h=[`Default`,`Customized`,`SetForWorkspace`,`NarrowPanel`]})))()}g();export{f as Customized,d as Default,m as NarrowPanel,p as SetForWorkspace,h as __namedExportsOrder,u as default};