import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{at as t,it as n,n as r}from"./iframe-B9bTX7Vl.js";import{n as i,t as a}from"./SettingsContext-BcC2N7qY.js";import{n as o,t as s}from"./TokenEstimate-DnQo9TLt.js";var c,l,u,d,f,p,m,h,g,_,v,y;function b(){return(b=e((()=>{t(),i(),o(),c=r(),l={title:`Shared/TokenEstimate`,component:s,args:{chars:8400},decorators:[e=>(0,c.jsx)(`div`,{className:`p-6 pb-72 text-xs text-muted-foreground`,children:(0,c.jsx)(e,{})})]},u=({canvasElement:e})=>{e.querySelector(`button`)?.focus()},d=e=>t=>(0,c.jsx)(a,{settings:e,children:(0,c.jsx)(t,{})}),f={...n,tokens:{estimator:{value:`anthropic`,source:`user`}}},p={},m={args:{long:!0}},h={args:{long:!0},play:u},g={args:{long:!0},decorators:[d(f)],play:u},_={args:{chars:240,long:!0},decorators:[d(f)]},v={args:{long:!0},globals:{viewport:{value:`narrowPanel`}},decorators:[e=>(0,c.jsx)(`div`,{className:`flex justify-end p-6 pb-72 text-xs text-muted-foreground`,children:(0,c.jsx)(e,{})})],play:u},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    long: true
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    long: true
  },
  play: openCard
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    long: true
  },
  decorators: [withEstimator(anthropicSettings)],
  play: openCard
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    chars: 240,
    long: true
  },
  decorators: [withEstimator(anthropicSettings)]
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    long: true
  },
  globals: {
    viewport: {
      value: 'narrowPanel'
    }
  },
  decorators: [Story => <div className="flex justify-end p-6 pb-72 text-xs text-muted-foreground">
        <Story />
      </div>],
  play: openCard
}`,...v.parameters?.docs?.source}}},y=[`Short`,`Long`,`StandardCard`,`AnthropicCard`,`SmallFile`,`NarrowPanel`]})))()}b();export{g as AnthropicCard,m as Long,v as NarrowPanel,p as Short,_ as SmallFile,h as StandardCard,y as __namedExportsOrder,l as default};