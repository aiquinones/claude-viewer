import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-Ct3ufPd1.js";import{n,t as r}from"./RetentionInfo-Ndijg1Uj.js";var i,a,o,s,c,l,u,d,f;function p(){return(p=e((()=>{n(),i=t(),a={title:`Usage/RetentionInfo`,component:r,args:{retention:{days:30,source:`default`},workspaceRoot:`/Users/dev/repos/example-app`,oldestClaudeDays:3},decorators:[e=>(0,i.jsx)(`div`,{className:`p-4 pb-64`,children:(0,i.jsxs)(`h2`,{className:`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground`,children:[`Last 5 weeks`,(0,i.jsx)(e,{})]})})]},o=({canvasElement:e})=>{e.querySelector(`[aria-label]`)?.focus()},s={},c={play:o},l={play:o,args:{retention:{days:7,source:`user`,path:`/Users/dev/.claude/settings.json`},oldestClaudeDays:3}},u={play:o,args:{retention:{days:14,source:`managed`,path:`/Library/Application Support/ClaudeCode/managed-settings.json`},oldestClaudeDays:5}},d={play:o,args:{oldestClaudeDays:96}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  play: openCard
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  play: openCard,
  args: {
    retention: {
      days: 7,
      source: 'user',
      path: '/Users/dev/.claude/settings.json'
    },
    oldestClaudeDays: 3
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  play: openCard,
  args: {
    retention: {
      days: 14,
      source: 'managed',
      path: '/Library/Application Support/ClaudeCode/managed-settings.json'
    },
    oldestClaudeDays: 5
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  play: openCard,
  args: {
    oldestClaudeDays: 96
  }
}`,...d.parameters?.docs?.source}}},f=[`Closed`,`Default`,`SetByYou`,`Managed`,`ReachesPastTheSweep`]})))()}p();export{s as Closed,c as Default,u as Managed,d as ReachesPastTheSweep,l as SetByYou,f as __namedExportsOrder,a as default};