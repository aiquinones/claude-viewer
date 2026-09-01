import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{C as t,V as n,dn as r,g as i,i as a,n as o,s}from"./iframe-hbv4fJYg.js";import{n as c,t as l}from"./PromptList-BkN1Uix7.js";var u,d,f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{u=r(),i(),c(),d=o(),f=(0,u.createRef)(),p={title:`SystemPrompt/PromptList`,component:l,args:{workspaceRoot:`/Users/dev/repos/example-app`,selectedOrder:void 0,selectionRef:f,onSelect:()=>void 0},decorators:[e=>(0,d.jsx)(`div`,{className:`w-[560px] px-2`,children:(0,d.jsx)(e,{})})]},m={args:{files:a}},h={args:{files:n}},g={args:{files:[{...t,order:1}]}},_={args:{files:s}},v={args:{files:a,selectedOrder:2}},y={args:{files:a}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    files: allPromptFiles
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    files: userOnlyPromptFiles
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    files: [{
      ...nestedPrompt,
      order: 1
    }]
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    files: brokenPromptFiles
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    files: allPromptFiles,
    selectedOrder: 2
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    files: allPromptFiles
  }
}`,...y.parameters?.docs?.source}}},b=[`Default`,`NoConditionalFiles`,`OnlyConditionalFiles`,`WithBrokenImports`,`WithSelection`,`Collapsible`]})))()}x();export{y as Collapsible,m as Default,h as NoConditionalFiles,g as OnlyConditionalFiles,_ as WithBrokenImports,v as WithSelection,b as __namedExportsOrder,p as default};