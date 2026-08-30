import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dn as t,n}from"./iframe-ByBSfpzM.js";import{n as r,t as i}from"./EstimatorDialog-C9adUb40.js";var a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{a=t(),r(),o=n(),s={title:`Settings/EstimatorDialog`,component:i,args:{current:`standard`,onApply:()=>void 0,onDismiss:()=>void 0}},c={},l={args:{current:`anthropic`}},u={play:async({canvasElement:e})=>{e.querySelectorAll(`[role="radio"]`)[1]?.click()}},d={render:()=>{let[e,t]=(0,a.useState)(`standard`);return(0,o.jsx)(i,{current:e,onApply:t,onDismiss:()=>void 0})}},f={globals:{viewport:{value:`narrowPanel`}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    current: 'anthropic'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }: {
    canvasElement: HTMLElement;
  }) => {
    const options = canvasElement.querySelectorAll<HTMLElement>('[role="radio"]');
    options[1]?.click();
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [current, setCurrent] = useState<TokenEstimator>('standard');
    return <EstimatorDialog current={current} onApply={setCurrent} onDismiss={() => undefined} />;
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  globals: {
    viewport: {
      value: 'narrowPanel'
    }
  }
}`,...f.parameters?.docs?.source}}},p=[`Standard`,`Anthropic`,`PickingTheOther`,`Applying`,`NarrowPanel`]})))()}m();export{l as Anthropic,d as Applying,f as NarrowPanel,u as PickingTheOther,c as Standard,p as __namedExportsOrder,s as default};