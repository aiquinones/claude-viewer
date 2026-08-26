import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ct as t,n,wt as r}from"./iframe-Dyw2alYo.js";import{i,n as a,r as o,t as s}from"./SkillLoadList-BECURoGE.js";import{r as c,s as l}from"./usage-fixtures-Dk6pn7xK.js";import{i as u,n as d,o as f}from"./session-detail-fixtures-i6NA3UbE.js";var p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{t(),a(),o(),f(),c(),p=n(),m=i({invocations:d.invocations,skills:l,estimator:`anthropic`}),h={title:`Usage/SkillLoadList`,component:s,args:{loads:m,estimator:`anthropic`,sessionEstimator:`anthropic`,reason:`This is a Claude Code session, so it ran Claude’s tokenizer.`,onUseSessionEstimator:()=>void 0,onOpenSkill:()=>void 0},decorators:[e=>(0,p.jsx)(`div`,{className:`w-[36rem] max-w-full p-4`,style:{"--surface-accent":r(`usage`)},children:(0,p.jsx)(e,{})})]},g={},_={args:{loads:i({invocations:d.invocations,skills:l,estimator:`standard`}),estimator:`standard`}},v={args:{loads:i({invocations:u.invocations,skills:l,estimator:`standard`}),estimator:`standard`,sessionEstimator:`standard`,reason:`This Copilot session mostly ran gpt-5.6-luna, which is not a Claude model.`}},y={args:{loads:i({invocations:[{skill:`ship-it`,at:Date.now(),via:`event`,chars:2400},{skill:`audit`,at:Date.now(),via:`tool`}],skills:l,estimator:`standard`}),estimator:`standard`,sessionEstimator:`standard`}},b={args:{loads:[]}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    loads: toSkillLoads({
      invocations: claudeDetail.invocations,
      skills: usageSkills,
      estimator: 'standard'
    }),
    estimator: 'standard'
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    loads: toSkillLoads({
      invocations: copilotDetail.invocations,
      skills: usageSkills,
      estimator: 'standard'
    }),
    estimator: 'standard',
    sessionEstimator: 'standard',
    reason: 'This Copilot session mostly ran gpt-5.6-luna, which is not a Claude model.'
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    loads: toSkillLoads({
      invocations: [{
        skill: 'ship-it',
        at: Date.now(),
        via: 'event',
        chars: 2_400
      }, {
        skill: 'audit',
        at: Date.now(),
        via: 'tool'
      }],
      skills: usageSkills,
      estimator: 'standard'
    }),
    estimator: 'standard',
    sessionEstimator: 'standard'
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    loads: []
  }
}`,...b.parameters?.docs?.source}}},x=[`Loaded`,`Overridden`,`CopilotDoubleLoad`,`NotInstalled`,`None`]})))()}S();export{v as CopilotDoubleLoad,g as Loaded,b as None,y as NotInstalled,_ as Overridden,x as __namedExportsOrder,h as default};