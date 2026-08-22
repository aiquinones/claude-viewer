import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-C_jrl_Hj.js";import{n,t as r}from"./MenuChoice-MS2yIbFQ.js";var i,a,o,s,c,l,u,d;function f(){return(f=e((()=>{n(),i=t(),a=[{id:`inherit`,label:`Inherit from editor`,hint:`Follow the editor's color theme, which is what the panel has always done.`},{id:`dark`,label:`Dark`,hint:`A dark palette of the panel's own.`,soon:!0},{id:`light`,label:`Light`,hint:`A light palette of the panel's own.`,soon:!0}],o={title:`Chrome/MenuChoice`,component:r,args:{label:`Theme`,options:a,value:`inherit`,onChoose:()=>void 0},decorators:[e=>(0,i.jsx)(`div`,{className:`p-6`,children:(0,i.jsx)(`div`,{className:`w-max max-w-96 rounded-md border border-border bg-popover p-1.5 text-xs`,children:(0,i.jsx)(e,{})})})]},s={args:{source:`default`}},c={args:{source:`user`}},l={args:{source:`workspace`}},u={args:{source:`user`,value:`dark`,options:a.map(e=>({...e,soon:!1}))}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    source: 'default'
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    source: 'user'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    source: 'workspace'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    source: 'user',
    value: 'dark',
    options: OPTIONS.map(option => ({
      ...option,
      soon: false
    }))
  }
}`,...u.parameters?.docs?.source}}},d=[`Default`,`SetByUser`,`SetForWorkspace`,`NothingSoon`]})))()}f();export{s as Default,u as NothingSoon,c as SetByUser,l as SetForWorkspace,d as __namedExportsOrder,o as default};