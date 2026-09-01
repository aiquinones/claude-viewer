import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dn as t,n}from"./iframe-hbv4fJYg.js";import{n as r,r as i}from"./usage-options-D_Cu6b4Q.js";import{n as a,t as o}from"./UsageChoice-gD4yvr9S.js";var s,c,l,u,d,f,p;function m(){return(m=e((()=>{s=t(),a(),i(),c=n(),l={title:`Usage/UsageChoice`,component:o},u={render:()=>{let[e,t]=(0,s.useState)(`day`);return(0,c.jsx)(o,{label:`Window`,options:r,value:e,onChange:t})}},d={render:()=>{let[e,t]=(0,s.useState)(`claude`);return(0,c.jsx)(o,{label:`CLI`,options:[{id:`claude`,label:`Claude Code`,hint:"Sessions under `~/.claude/projects`. The window comes from `cleanupPeriodDays`."},{id:`copilot`,label:`Copilot CLI`,hint:"Sessions under `~/.copilot/session-state`. No documented retention period, so the window is whatever was found."}],value:e,onChange:t})}},f={render:()=>{let[e,t]=(0,s.useState)(`all`);return(0,c.jsx)(o,{label:`Sessions`,options:[{id:`all`,label:`All sessions`,hint:`Every session on this machine.`},{id:`workspace`,label:`This workspace`,hint:`Only sessions under the open folder.`}],value:e,onChange:t})}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<UsageWindow>('day');
    return <UsageChoice label="Window" options={WINDOW_OPTIONS} value={value} onChange={setValue} />;
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string>('claude');
    return <UsageChoice label="CLI" options={[{
      id: 'claude',
      label: 'Claude Code',
      hint: 'Sessions under \`~/.claude/projects\`. The window comes from \`cleanupPeriodDays\`.'
    }, {
      id: 'copilot',
      label: 'Copilot CLI',
      hint: 'Sessions under \`~/.copilot/session-state\`. No documented retention period, so the window is whatever was found.'
    }]} value={value} onChange={setValue} />;
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<string>('all');
    return <UsageChoice label="Sessions" options={[{
      id: 'all',
      label: 'All sessions',
      hint: 'Every session on this machine.'
    }, {
      id: 'workspace',
      label: 'This workspace',
      hint: 'Only sessions under the open folder.'
    }]} value={value} onChange={setValue} />;
  }
}`,...f.parameters?.docs?.source}}},p=[`Window`,`TickedHints`,`UnevenLabels`]})))()}m();export{d as TickedHints,f as UnevenLabels,u as Window,p as __namedExportsOrder,l as default};