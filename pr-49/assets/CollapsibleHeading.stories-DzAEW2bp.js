import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{_t as t,n}from"./iframe-Da1VaRQK.js";import{n as r,t as i}from"./CollapsibleHeading-BBYlJPUT.js";var a,o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{a=t(),r(),o=n(),s={title:`Shared/CollapsibleHeading`,component:i,args:{onToggle:()=>void 0},decorators:[e=>(0,o.jsx)(`div`,{className:`w-80 p-2`,children:(0,o.jsx)(e,{})})]},c={args:{title:`This workspace`,note:`4 agents`,collapsed:!1}},l={args:{title:`This workspace`,note:`4 agents`,collapsed:!0}},u={args:{title:`Always loads`,note:`5 files · ~2.1k est. tokens`,collapsed:!0}},d={args:{title:`Plugin · 24`,note:`~1.8k`,tooltip:`Plugin skills · ~1.8k est. tokens of descriptions in the system prompt`,collapsed:!1}},f={args:{title:`Ideas · 7`,collapsed:!1}},p={render:()=>{let[e,t]=(0,a.useState)(!1);return(0,o.jsx)(i,{title:`Elsewhere`,note:`2 agents`,collapsed:e,onToggle:()=>t(e=>!e)})}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'This workspace',
    note: '4 agents',
    collapsed: false
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'This workspace',
    note: '4 agents',
    collapsed: true
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Always loads',
    note: '5 files · ~2.1k est. tokens',
    collapsed: true
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Plugin · 24',
    note: '~1.8k',
    tooltip: 'Plugin skills · ~1.8k est. tokens of descriptions in the system prompt',
    collapsed: false
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Ideas · 7',
    collapsed: false
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    return <CollapsibleHeading title="Elsewhere" note="2 agents" collapsed={collapsed} onToggle={() => setCollapsed(previous => !previous)} />;
  }
}`,...p.parameters?.docs?.source}}},m=[`Expanded`,`Collapsed`,`WithSubtotal`,`SplitAcrossBoth`,`NoNote`,`Interactive`]})))()}h();export{l as Collapsed,c as Expanded,p as Interactive,f as NoNote,d as SplitAcrossBoth,u as WithSubtotal,m as __namedExportsOrder,s as default};