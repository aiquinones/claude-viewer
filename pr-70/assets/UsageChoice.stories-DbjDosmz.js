import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{jt as t,n}from"./iframe-C_jrl_Hj.js";import{n as r,t as i}from"./UsageChoice-fhH4_nZD.js";var a,o,s,c,l,u,d,f;function p(){return(p=e((()=>{a=t(),r(),o=n(),s=[{id:`output-tokens`,label:`Tokens`,hint:`Output tokens — measured by both CLIs.`},{id:`cost`,label:`Cost`,hint:`Dollars for Claude Code, AIU for Copilot CLI.`}],c={title:`Usage/UsageChoice`,component:i},l={render:()=>{let[e,t]=(0,a.useState)(`output-tokens`);return(0,o.jsx)(i,{label:`Metric`,options:s,value:e,onChange:t})}},u={render:()=>{let[e,t]=(0,a.useState)(`claude`);return(0,o.jsx)(i,{label:`CLI`,options:[{id:`claude`,label:`Claude Code`,hint:"Sessions under `~/.claude/projects`. The window comes from `cleanupPeriodDays`."},{id:`copilot`,label:`Copilot CLI`,hint:"Sessions under `~/.copilot/session-state`. No documented retention period, so the window is whatever was found."}],value:e,onChange:t})}},d={render:()=>{let[e,t]=(0,a.useState)(`all`);return(0,o.jsx)(i,{label:`Sessions`,options:[{id:`all`,label:`All sessions`,hint:`Every session on this machine.`},{id:`workspace`,label:`This workspace`,hint:`Only sessions under the open folder.`}],value:e,onChange:t})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<UsageMetric>('output-tokens');
    return <UsageChoice label="Metric" options={METRICS} value={value} onChange={setValue} />;
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}},f=[`Metric`,`TickedHints`,`UnevenLabels`]})))()}p();export{l as Metric,u as TickedHints,d as UnevenLabels,f as __namedExportsOrder,c as default};