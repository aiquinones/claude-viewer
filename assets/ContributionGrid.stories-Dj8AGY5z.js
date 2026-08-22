import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-CCFUdQ9e.js";import{i as n,r}from"./surfaces-D2M0EOtk.js";import{c as i,n as a,s as o,t as s}from"./ContributionGrid-PZB_D2ZW.js";import{i as c,o as l,r as u,t as d}from"./usage-history-fixtures-DlKL4wJP.js";var f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{r(),a(),i(),c(),f=t(),p=({history:e,metric:t})=>{let r=o({sessions:e.sessions,metric:t,now:Date.now(),retentionDays:e.retention.days});return(0,f.jsx)(`div`,{className:`max-w-3xl p-4`,style:{"--surface-accent":n(`usage`)},children:(0,f.jsx)(s,{grid:r,metric:t})})},m={title:`Usage/ContributionGrid`,component:s},h={render:()=>(0,f.jsx)(p,{history:d,metric:`tokens`})},g={render:()=>(0,f.jsx)(p,{history:d,metric:`sessions`})},_={render:()=>(0,f.jsx)(p,{history:l,metric:`tokens`})},v={render:()=>(0,f.jsx)(p,{history:u,metric:`tokens`})},y={globals:{viewport:{value:`narrowPanel`}},render:()=>(0,f.jsx)(p,{history:d,metric:`tokens`})},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <OnSurface history={busyYear} metric="tokens" />
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <OnSurface history={busyYear} metric="sessions" />
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <OnSurface history={quietHistory} metric="tokens" />
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <OnSurface history={emptyHistory} metric="tokens" />
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  globals: {
    viewport: {
      value: 'narrowPanel'
    }
  },
  render: () => <OnSurface history={busyYear} metric="tokens" />
}`,...y.parameters?.docs?.source}}},b=[`Tokens`,`Sessions`,`Quiet`,`Empty`,`NarrowPanel`]})))()}x();export{v as Empty,y as NarrowPanel,_ as Quiet,g as Sessions,h as Tokens,b as __namedExportsOrder,m as default};