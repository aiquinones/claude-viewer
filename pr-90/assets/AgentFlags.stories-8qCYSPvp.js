import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-Ct3ufPd1.js";import{b as n,d as r,g as i,p as a}from"./agent-fixtures-jdx0kAWl.js";import{n as o,t as s}from"./AgentFlags-BdqcAkse.js";var c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{o(),r(),c=t(),l={title:`Agents/AgentFlags`,component:s,decorators:[e=>(0,c.jsx)(`div`,{className:`flex justify-start p-6 pb-40`,children:(0,c.jsx)(e,{})})]},u={args:{agent:n}},d={args:{agent:a}},f={args:{agent:i}},p={args:{agent:{...i,issues:[{severity:`warning`,message:`no transcript on disk yet — nothing has been written for this session`}]}}},m={args:{agent:{...n,issues:[{severity:`error`,message:`could not read the event log: EACCES permission denied`}]}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    agent: workingAgent
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    agent: noTranscriptAgent
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    agent: resumedAgent
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    agent: {
      ...resumedAgent,
      issues: [{
        severity: 'warning',
        message: 'no transcript on disk yet — nothing has been written for this session'
      }]
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    agent: {
      ...workingAgent,
      issues: [{
        severity: 'error',
        message: 'could not read the event log: EACCES permission denied'
      }]
    }
  }
}`,...m.parameters?.docs?.source}}},h=[`Nothing`,`Warning`,`DuplicatePid`,`Both`,`ErrorIssue`]})))()}g();export{p as Both,f as DuplicatePid,m as ErrorIssue,u as Nothing,d as Warning,h as __namedExportsOrder,l as default};