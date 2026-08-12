import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{K as t,Y as n,n as r}from"./iframe-CXFIMbnf.js";import{n as i,t as a}from"./ActivityBadge-GAJ8KLLG.js";var o,s,c,l,u,d,f;function p(){return(p=e((()=>{n(),i(),o=r(),s={title:`Agents/ActivityBadge`,component:a},c={args:{activity:`running`}},l={args:{activity:`blocked`}},u={args:{activity:`idle`}},d={render:()=>(0,o.jsx)(`div`,{className:`flex flex-col gap-3`,children:t.map(e=>(0,o.jsx)(a,{activity:e},e))})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    activity: 'running'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    activity: 'blocked'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    activity: 'idle'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-3">
      {AGENT_ACTIVITIES.map(activity => <ActivityBadge key={activity} activity={activity} />)}
    </div>
}`,...d.parameters?.docs?.source}}},f=[`Running`,`Blocked`,`Idle`,`EveryState`]})))()}p();export{l as Blocked,d as EveryState,u as Idle,c as Running,f as __namedExportsOrder,s as default};