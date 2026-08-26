import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{c as t,t as n}from"./types-BfeRrQM4.js";import{n as r}from"./iframe-CkuxjHzj.js";import{n as i,t as a}from"./ActivityBadge-sbLqbs5X.js";var o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{t(),i(),o=r(),s={title:`Agents/ActivityBadge`,component:a},c={args:{activity:`running`,tail:`working`}},l={args:{activity:`blocked`,tail:`working`}},u={args:{activity:`idle`,tail:`settled`}},d={args:{activity:`blocked`,tail:`blocked`}},f={args:{activity:`running`,tail:`working`,onSelect:()=>void 0}},p={render:()=>(0,o.jsx)(`div`,{className:`flex flex-col gap-3`,children:n.map(e=>(0,o.jsx)(a,{activity:e,tail:`working`},e))})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
  args: {
    activity: 'running',
    tail: 'working',
    onSelect: () => undefined
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-3">
      {AGENT_ACTIVITIES.map(activity => <ActivityBadge key={activity} activity={activity} tail="working" />)}
    </div>
}`,...p.parameters?.docs?.source}}},m=[`Running`,`Blocked`,`Idle`,`BlockedStated`,`Selectable`,`EveryState`]})))()}h();export{l as Blocked,d as BlockedStated,p as EveryState,u as Idle,c as Running,f as Selectable,m as __namedExportsOrder,s as default};