import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ct as t,n,wt as r}from"./iframe-D_0FizBy.js";import{n as i,t as a}from"./HoverBubble-BYlarT7O.js";import{n as o,t as s}from"./GridDaySummary-BrLjik3n.js";var c,l,u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{i(),o(),t(),c=n(),l=420,u=10,d=({claude:e,copilot:t,at:n})=>({day:new Date(n).toISOString().slice(0,10),at:n,sessions:e+t,byTool:{claude:e,copilot:t},level:Math.min(e+t,4),future:!1}),f=({x:e,y:t,day:n})=>(0,c.jsx)(`div`,{className:`usage-grid p-10`,style:{"--surface-accent":r(`usage`)},children:(0,c.jsxs)(`div`,{className:`relative rounded-md border border-dashed border-border`,style:{width:l,height:88},children:[(0,c.jsx)(`span`,{className:`usage-grid-day level-4 absolute`,style:{left:e-u/2,top:t},"aria-hidden":!0}),(0,c.jsx)(a,{x:e,y:t,frameWidth:l,children:(0,c.jsx)(s,{day:n})})]})}),p={title:`Usage/HoverBubble`,component:a},m={render:()=>(0,c.jsx)(f,{x:210,y:44,day:d({claude:8,copilot:4,at:new Date(2026,11,3,12).getTime()})})},h={render:()=>(0,c.jsx)(f,{x:18,y:52,day:d({claude:3,copilot:0,at:new Date(2026,2,14,12).getTime()})})},g={render:()=>(0,c.jsx)(f,{x:404,y:26,day:d({claude:2,copilot:11,at:new Date(2026,7,17,12).getTime()})})},_={render:()=>(0,c.jsx)(f,{x:200,y:0,day:d({claude:0,copilot:0,at:new Date(2026,6,5,12).getTime()})})},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Frame x={210} y={44} day={day({
    claude: 8,
    copilot: 4,
    at: new Date(2026, 11, 3, 12).getTime()
  })} />
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <Frame x={18} y={52} day={day({
    claude: 3,
    copilot: 0,
    at: new Date(2026, 2, 14, 12).getTime()
  })} />
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <Frame x={FRAME_PX - 16} y={26} day={day({
    claude: 2,
    copilot: 11,
    at: new Date(2026, 7, 17, 12).getTime()
  })} />
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <Frame x={200} y={0} day={day({
    claude: 0,
    copilot: 0,
    at: new Date(2026, 6, 5, 12).getTime()
  })} />
}`,..._.parameters?.docs?.source}}},v=[`Centred`,`AtTheLeftEdge`,`AtTheRightEdge`,`PeekingAboveTheFrame`]})))()}y();export{h as AtTheLeftEdge,g as AtTheRightEdge,m as Centred,_ as PeekingAboveTheFrame,v as __namedExportsOrder,p as default};