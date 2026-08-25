import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{C as t,H as n,g as r,h as i,k as a,l as o,n as s,r as c,x as l}from"./iframe-a4iOpKfw.js";import{n as u,t as d}from"./PromptFileRow-CNidTtVI.js";var f,p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{r(),u(),f=s(),p={title:`SystemPrompt/PromptFileRow`,component:d,args:{groupChars:a.chars,workspaceRoot:c,selected:!1,onSelect:()=>void 0},decorators:[e=>(0,f.jsx)(`div`,{className:`w-[520px] py-2`,children:(0,f.jsx)(e,{})})]},m={args:{file:{...n,order:1}}},h={args:{file:{...a,order:2}}},g={args:{file:{...i,order:3}}},_={args:{file:{...t,order:6}}},v={args:{file:{...l,order:4}}},y={args:{file:{...o,order:5}}},b={args:{file:a,selected:!0}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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