import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-D7xoosLR.js";import{n,t as r}from"./MenuChoice-DS_IpFv9.js";var i,a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{n(),i=t(),a=[{id:`inherit`,label:`Inherit from editor`},{id:`dark`,label:`Dark`,soon:!0},{id:`light`,label:`Light`,soon:!0}],o=a.map(e=>({...e,hint:`What picking ${e.label.toLowerCase()} would mean, said in a sentence.`})),s={title:`Chrome/MenuChoice`,component:r,args:{label:`Theme`,options:a,value:`inherit`,onChoose:()=>void 0},decorators:[e=>(0,i.jsx)(`div`,{className:`p-6`,children:(0,i.jsx)(`div`,{className:`w-max max-w-96 rounded-md border border-border bg-popover p-1.5 text-xs`,children:(0,i.jsx)(e,{})})})]},c={args:{source:`default`}},l={args:{source:`user`,options:o}},u={args:{source:`user`}},d={args:{source:`workspace`}},f={args:{source:`user`,value:`dark`,options:a.map(e=>({...e,soon:!1}))}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    source: 'default'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    source: 'user',
    options: HINTED
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    source: 'user'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    source: 'workspace'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    source: 'user',
    value: 'dark',
    options: OPTIONS.map(option => ({
      ...option,
      soon: false
    }))
  }
}`,...f.parameters?.docs?.source}}},p=[`Default`,`WithHints`,`SetByUser`,`SetForWorkspace`,`NothingSoon`]})))()}m();export{c as Default,f as NothingSoon,u as SetByUser,d as SetForWorkspace,l as WithHints,p as __namedExportsOrder,s as default};