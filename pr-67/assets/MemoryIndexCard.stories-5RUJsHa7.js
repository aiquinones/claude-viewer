import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{K as t,Q as n,Y as r,Z as i,n as a}from"./iframe-BJCHi4uU.js";import{n as o,t as s}from"./MemoryIndexCard-DmpYI8Eg.js";var c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{o(),r(),c=a(),l={title:`Memory/MemoryIndexCard`,component:s,args:{selected:!1,onSelect:()=>void 0,onOpenFile:()=>void 0},decorators:[e=>(0,c.jsx)(`div`,{className:`w-[620px] p-3`,children:(0,c.jsx)(e,{})})]},u={args:{index:i}},d={args:{index:i,selected:!0}},f={args:{index:n}},p={args:{index:{...t,issues:[{severity:`warning`,message:`no MEMORY.md — nothing points at these files, so no session will read them`}]}}},m={args:{index:t}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    index: memoryIndex
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    index: memoryIndex,
    selected: true
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    index: memoryIndexWithDangling
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    index: {
      ...emptyMemoryIndex,
      issues: [{
        severity: 'warning',
        message: 'no MEMORY.md — nothing points at these files, so no session will read them'
      }]
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    index: emptyMemoryIndex
  }
}`,...m.parameters?.docs?.source}}},h=[`Default`,`Selected`,`WithDanglingEntry`,`NoIndexFile`,`Empty`]})))()}g();export{u as Default,m as Empty,p as NoIndexFile,d as Selected,f as WithDanglingEntry,h as __namedExportsOrder,l as default};