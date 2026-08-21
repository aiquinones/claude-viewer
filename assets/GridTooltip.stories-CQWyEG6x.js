import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-Qs6gYdh5.js";import{i as n,r}from"./surfaces-Dsk9bZW2.js";import{a as i,n as a,t as o}from"./GridTooltip-k8l1jJSU.js";var s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{i(),a(),r(),s=t(),c=14,l=({week:e,row:t,children:r})=>(0,s.jsx)(`div`,{className:`usage-grid w-max p-6`,style:{"--surface-accent":n(`usage`)},children:(0,s.jsxs)(`div`,{className:`relative`,children:[(0,s.jsx)(`div`,{className:`usage-grid-weeks flex`,children:Array.from({length:c},(n,r)=>(0,s.jsx)(`div`,{className:`usage-grid-days flex flex-col`,children:Array.from({length:7},(n,i)=>(0,s.jsx)(`span`,{className:`usage-grid-day ${r===e&&i===t?`level-4`:``}`},i))},r))}),(0,s.jsx)(o,{week:e,row:t,weeks:c,children:r})]})}),u={title:`Usage/GridTooltip`,component:o},d={render:()=>(0,s.jsx)(l,{week:7,row:3,children:`148.2k output tokens on Tuesday, June 2`})},f={render:()=>(0,s.jsx)(l,{week:0,row:5,children:`3 sessions on Friday, March 14`})},p={render:()=>(0,s.jsx)(l,{week:13,row:1,children:`1.2M output tokens on Monday, August 18`})},m={render:()=>(0,s.jsx)(l,{week:6,row:0,children:`No output tokens on Sunday, July 5`})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Lattice week={7} row={3}>
      148.2k output tokens on Tuesday, June 2
    </Lattice>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <Lattice week={0} row={5}>
      3 sessions on Friday, March 14
    </Lattice>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Lattice week={WEEKS - 1} row={1}>
      1.2M output tokens on Monday, August 18
    </Lattice>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Lattice week={6} row={0}>
      No output tokens on Sunday, July 5
    </Lattice>
}`,...m.parameters?.docs?.source}}},h=[`Centred`,`AtTheLeftEdge`,`AtTheRightEdge`,`TopRow`]})))()}g();export{f as AtTheLeftEdge,p as AtTheRightEdge,d as Centred,m as TopRow,h as __namedExportsOrder,u as default};