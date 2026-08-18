import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{O as t,S as n,V as r,b as i,g as a,h as o,l as s,n as c,r as l}from"./iframe-Dy3gRZ5d.js";import{n as u,t as d}from"./PromptFileRow-Ch8KwQrw.js";var f,p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{a(),u(),f=c(),p={title:`SystemPrompt/PromptFileRow`,component:d,args:{groupChars:t.chars,workspaceRoot:l,selected:!1,onSelect:()=>void 0},decorators:[e=>(0,f.jsx)(`div`,{className:`w-[520px] py-2`,children:(0,f.jsx)(e,{})})]},m={args:{file:{...r,order:1}}},h={args:{file:{...t,order:2}}},g={args:{file:{...o,order:3}}},_={args:{file:{...n,order:6}}},v={args:{file:{...i,order:4}}},y={args:{file:{...s,order:5}}},b={args:{file:t,selected:!0}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    file: {
      ...userPrompt,
      order: 1
    }
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    file: {
      ...projectPrompt,
      order: 2
    }
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    file: {
      ...importedAgents,
      order: 3
    }
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    file: {
      ...nestedPrompt,
      order: 6
    }
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    file: {
      ...missingImport,
      order: 4
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    file: {
      ...circularImport,
      order: 5
    }
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    file: projectPrompt,
    selected: true
  }
}`,...b.parameters?.docs?.source}}},x=[`UserFile`,`ProjectFile`,`Imported`,`Conditional`,`BrokenImport`,`Circular`,`Selected`]})))()}S();export{v as BrokenImport,y as Circular,_ as Conditional,g as Imported,h as ProjectFile,b as Selected,m as UserFile,x as __namedExportsOrder,p as default};