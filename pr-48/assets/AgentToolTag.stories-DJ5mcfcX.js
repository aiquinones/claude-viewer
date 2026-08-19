import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{ft as t,gt as n,n as r}from"./iframe-Chv6712e.js";import{n as i,t as a}from"./AgentToolTag-B-vel-2b.js";var o,s,c,l,u,d;function f(){return(f=e((()=>{n(),i(),o=r(),s={title:`Agents/AgentToolTag`,component:a},c={args:{tool:`claude`}},l={args:{tool:`copilot`}},u={render:()=>(0,o.jsx)(`div`,{className:`flex flex-col gap-2`,children:t.map(e=>(0,o.jsx)(a,{tool:e},e))})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    tool: 'claude'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    tool: 'copilot'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2">
      {AGENT_TOOLS.map(tool => <AgentToolTag key={tool} tool={tool} />)}
    </div>
}`,...u.parameters?.docs?.source}}},d=[`Claude`,`Copilot`,`EveryTool`]})))()}f();export{c as Claude,l as Copilot,u as EveryTool,d as __namedExportsOrder,s as default};