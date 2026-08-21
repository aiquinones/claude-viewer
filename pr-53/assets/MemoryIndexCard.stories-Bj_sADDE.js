import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{K as t,Q as n,Y as r,Z as i,n as a}from"./iframe-D4bcnUjr.js";import{n as o,t as s}from"./MemoryIndexCard-BnjdmxJl.js";var c,l,u,d,f,p,m;function h(){return(h=e((()=>{o(),r(),c=a(),l={title:`Memory/MemoryIndexCard`,component:s,args:{onOpenFile:()=>void 0},decorators:[e=>(0,c.jsx)(`div`,{className:`w-[620px] p-3`,children:(0,c.jsx)(e,{})})]},u={args:{index:i}},d={args:{index:n}},f={args:{index:{...t,issues:[{severity:`warning`,message:`no MEMORY.md — nothing points at these files, so no session will read them`}]}}},p={args:{index:t}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    index: memoryIndex
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    index: memoryIndexWithDangling
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    index: {
      ...emptyMemoryIndex,
      issues: [{
        severity: 'warning',
        message: 'no MEMORY.md — nothing points at these files, so no session will read them'
      }]
    }
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    index: emptyMemoryIndex
  }
}`,...p.parameters?.docs?.source}}},m=[`Default`,`WithDanglingEntry`,`NoIndexFile`,`Empty`]})))()}h();export{u as Default,p as Empty,f as NoIndexFile,d as WithDanglingEntry,m as __namedExportsOrder,l as default};