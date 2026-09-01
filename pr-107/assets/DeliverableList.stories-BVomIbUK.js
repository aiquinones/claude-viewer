import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,l as n}from"./types-DV-UfqEg.js";import{n as r}from"./iframe-CSFDWdzb.js";import{a as i,n as a,r as o,t as s}from"./DeliverableList-Dc5HimdH.js";import{d as c,h as l}from"./agent-fixtures-BaK9O76D.js";var u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{n(),a(),i(),l(),u=r(),d={title:`Agents/DeliverableList`,component:s,args:{onOpen:()=>void 0},argTypes:{variant:{control:`inline-radio`,options:o}},decorators:[e=>(0,u.jsx)(`div`,{className:`w-[420px] p-6`,children:(0,u.jsx)(e,{})})]},f={args:{deliverables:c}},p={args:{deliverables:t.map(e=>({kind:e,title:e,url:`https://example.com/${e}`}))}},m={args:{deliverables:[c[0]]}},h={args:{deliverables:[...c,{kind:`link`,title:`Coverage report`,url:`https://example.com/coverage`},{kind:`file`,title:`Migration notes`,path:`/Users/dev/repos/example-app/docs/notes.md`}]}},g={args:{deliverables:[{kind:`link`,title:`The staging deployment of the settings pane, rebuilt from this branch`,url:`https://staging.example.com/settings`}]}},_={args:{deliverables:[]}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    deliverables
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    deliverables: DELIVERABLE_KINDS.map((kind): Deliverable => ({
      kind,
      title: kind,
      url: \`https://example.com/\${kind}\`
    }))
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    deliverables: [deliverables[0]]
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    deliverables: [{
      kind: 'link',
      title: 'The staging deployment of the settings pane, rebuilt from this branch',
      url: 'https://staging.example.com/settings'
    }]
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    deliverables: []
  }
}`,..._.parameters?.docs?.source}}},v=[`Mixed`,`EveryKind`,`One`,`Wrapping`,`LongTitle`,`Empty`]})))()}y();export{_ as Empty,p as EveryKind,g as LongTitle,f as Mixed,m as One,h as Wrapping,v as __namedExportsOrder,d as default};