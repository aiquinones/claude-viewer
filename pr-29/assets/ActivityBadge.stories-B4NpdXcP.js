import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{lt as t,n,rt as r}from"./iframe-DCjat3KN.js";import{n as i,t as a}from"./ActivityBadge-BqUCgXlF.js";var o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{t(),i(),o=n(),s={title:`Agents/ActivityBadge`,component:a},c={args:{activity:`running`,tail:`working`}},l={args:{activity:`blocked`,tail:`working`}},u={args:{activity:`idle`,tail:`settled`}},d={args:{activity:`blocked`,tail:`blocked`}},f={render:()=>(0,o.jsx)(`div`,{className:`flex flex-col gap-3`,children:r.map(e=>(0,o.jsx)(a,{activity:e,tail:`working`},e))})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    activity: 'running',
    tail: 'working'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    activity: 'blocked',
    tail: 'working'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    activity: 'idle',
    tail: 'settled'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    activity: 'blocked',
    tail: 'blocked'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-3">
      {AGENT_ACTIVITIES.map(activity => <ActivityBadge key={activity} activity={activity} tail="working" />)}
    </div>
}`,...f.parameters?.docs?.source}}},p=[`Running`,`Blocked`,`Idle`,`BlockedStated`,`EveryState`]})))()}m();export{l as Blocked,d as BlockedStated,f as EveryState,u as Idle,c as Running,p as __namedExportsOrder,s as default};