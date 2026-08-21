import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{kt as t,n}from"./iframe-Ctl-aJWj.js";import{n as r,t as i}from"./UsageChoice-uR6BxWcn.js";var a,o,s,c,l,u,d;function f(){return(f=e((()=>{a=t(),r(),o=n(),s=[{id:`output-tokens`,label:`Tokens`,hint:`Output tokens — measured by both CLIs.`},{id:`cost`,label:`Cost`,hint:`Dollars for Claude Code, AIU for Copilot CLI.`}],c={title:`Usage/UsageChoice`,component:i},l={render:()=>{let[e,t]=(0,a.useState)(`output-tokens`);return(0,o.jsx)(i,{label:`Metric`,options:s,value:e,onChange:t})}},u={render:()=>{let[e,t]=(0,a.useState)(`all`);return(0,o.jsx)(i,{label:`Sessions`,options:[{id:`all`,label:`All sessions`,hint:`Every session on this machine.`},{id:`workspace`,label:`This workspace`,hint:`Only sessions under the open folder.`}],value:e,onChange:t})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState<UsageMetric>('output-tokens');
    return <UsageChoice label="Metric" options={METRICS} value={value} onChange={setValue} />;
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}},d=[`Metric`,`UnevenLabels`]})))()}f();export{l as Metric,u as UnevenLabels,d as __namedExportsOrder,c as default};