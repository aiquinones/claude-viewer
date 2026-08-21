import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{kt as t,n}from"./iframe-CGEZhTT5.js";import{n as r,t as i}from"./CollapsibleHeading-DKpXtYmS.js";import{n as a,t as o}from"./TokenEstimate-fl-0YnhS.js";var s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{s=t(),r(),a(),c=n(),l={title:`Shared/CollapsibleHeading`,component:i,args:{onToggle:()=>void 0},decorators:[e=>(0,c.jsx)(`div`,{className:`w-80 p-2`,children:(0,c.jsx)(e,{})})]},u={args:{title:`This workspace`,note:`4 agents`,collapsed:!1}},d={args:{title:`This workspace`,note:`4 agents`,collapsed:!0}},f={args:{title:`Always loads`,note:`5 files · ~2.1k est. tokens`,collapsed:!0}},p={args:{title:`Plugin · 24`,note:`~1.8k`,tooltip:`Plugin skills · what their descriptions cost in the system prompt`,collapsed:!1}},m={args:{title:`Always loads`,note:(0,c.jsxs)(c.Fragment,{children:[`5 files · `,(0,c.jsx)(o,{chars:8400,long:!0})]}),collapsed:!1}},h={args:{title:`Ideas · 7`,collapsed:!1}},g={render:()=>{let[e,t]=(0,s.useState)(!1);return(0,c.jsx)(i,{title:`Elsewhere`,note:`2 agents`,collapsed:e,onToggle:()=>t(e=>!e)})}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'This workspace',
    note: '4 agents',
    collapsed: false
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'This workspace',
    note: '4 agents',
    collapsed: true
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Always loads',
    note: '5 files · ~2.1k est. tokens',
    collapsed: true
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Plugin · 24',
    note: '~1.8k',
    tooltip: 'Plugin skills · what their descriptions cost in the system prompt',
    collapsed: false
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Always loads',
    note: <>
        5 files · <TokenEstimate chars={8400} long />
      </>,
    collapsed: false
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Ideas · 7',
    collapsed: false
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    return <CollapsibleHeading title="Elsewhere" note="2 agents" collapsed={collapsed} onToggle={() => setCollapsed(previous => !previous)} />;
  }
}`,...g.parameters?.docs?.source}}},_=[`Expanded`,`Collapsed`,`WithSubtotal`,`SplitAcrossBoth`,`NoteWithEstimate`,`NoNote`,`Interactive`]})))()}v();export{d as Collapsed,u as Expanded,g as Interactive,h as NoNote,m as NoteWithEstimate,p as SplitAcrossBoth,f as WithSubtotal,_ as __namedExportsOrder,l as default};