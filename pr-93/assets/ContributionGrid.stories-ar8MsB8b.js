import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ct as t,n,wt as r}from"./iframe-BDy95zVS.js";import{i,n as a,r as o,t as s}from"./ContributionGrid-By_y7znM.js";import{a as c,c as l,i as u,t as d}from"./usage-history-fixtures-DCkgAFWN.js";var f,p,m,h,g,_,v,y;function b(){return(b=e((()=>{t(),a(),i(),c(),f=n(),p=({history:e})=>{let t=o({sessions:e.sessions,now:Date.now(),retentionDays:e.retention.days});return(0,f.jsx)(`div`,{className:`max-w-3xl p-4`,style:{"--surface-accent":r(`usage`)},children:(0,f.jsx)(s,{grid:t})})},m={title:`Usage/ContributionGrid`,component:s},h={render:()=>(0,f.jsx)(p,{history:d})},g={render:()=>(0,f.jsx)(p,{history:l})},_={render:()=>(0,f.jsx)(p,{history:u})},v={globals:{viewport:{value:`narrowPanel`}},render:()=>(0,f.jsx)(p,{history:d})},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <OnSurface history={busyYear} />
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <OnSurface history={quietHistory} />
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <OnSurface history={emptyHistory} />
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  globals: {
    viewport: {
      value: 'narrowPanel'
    }
  },
  render: () => <OnSurface history={busyYear} />
}`,...v.parameters?.docs?.source}}},y=[`Busy`,`Quiet`,`Empty`,`NarrowPanel`]})))()}b();export{h as Busy,_ as Empty,v as NarrowPanel,g as Quiet,y as __namedExportsOrder,m as default};