import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,l as n}from"./types-DV-UfqEg.js";import{n as r}from"./iframe-MHXp9LG4.js";import{n as i,t as a}from"./DeliverableList-DjucMyKT.js";import{d as o,h as s}from"./agent-fixtures-CSX2GirW.js";var c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{n(),i(),s(),c=r(),l={title:`Agents/DeliverableList`,component:a,args:{onOpen:()=>void 0},decorators:[e=>(0,c.jsx)(`div`,{className:`w-[420px] p-6`,children:(0,c.jsx)(e,{})})]},u={args:{deliverables:o}},d={args:{deliverables:t.map(e=>({kind:e,title:e,url:`https://example.com/${e}`}))}},f={args:{deliverables:[o[0]]}},p={args:{deliverables:[...o,{kind:`link`,title:`Coverage report`,url:`https://example.com/coverage`},{kind:`file`,title:`Migration notes`,path:`/Users/dev/repos/example-app/docs/notes.md`}]}},m={args:{deliverables:[{kind:`link`,title:`The staging deployment of the settings pane, rebuilt from this branch`,url:`https://staging.example.com/settings`}]}},h={args:{deliverables:[]}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    deliverables
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    deliverables: DELIVERABLE_KINDS.map((kind): Deliverable => ({
      kind,
      title: kind,
      url: \`https://example.com/\${kind}\`
    }))
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    deliverables: [deliverables[0]]
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    deliverables: [...deliverables, {
      kind: 'link',
      title: 'Coverage report',
      url: 'https://example.com/coverage'
    }, {
      kind: 'file',
      title: 'Migration notes',
      path: '/Users/dev/repos/example-app/docs/notes.md'
    }]
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    deliverables: [{
      kind: 'link',
      title: 'The staging deployment of the settings pane, rebuilt from this branch',
      url: 'https://staging.example.com/settings'
    }]
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    deliverables: []
  }
}`,...h.parameters?.docs?.source}}},g=[`Mixed`,`EveryKind`,`One`,`Wrapping`,`LongTitle`,`Empty`]})))()}_();export{h as Empty,d as EveryKind,m as LongTitle,u as Mixed,f as One,p as Wrapping,g as __namedExportsOrder,l as default};