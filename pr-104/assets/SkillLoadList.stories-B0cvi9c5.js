import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ct as t,n,wt as r}from"./iframe-ByBSfpzM.js";import{c as i,n as a,o}from"./session-detail-fixtures-DaNWuuOo.js";import{i as s,n as c,r as l,t as u}from"./SkillLoadList-4bVlHSIx.js";import{l as d,r as f}from"./usage-fixtures-DdZBqxkG.js";var p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{t(),c(),l(),i(),f(),p=n(),m=s({invocations:a.invocations,skills:d,estimator:`anthropic`}),h={title:`Usage/SkillLoadList`,component:u,args:{loads:m,tool:`claude`,estimator:`anthropic`,sessionEstimator:`anthropic`,reason:`This is a Claude Code session, so it ran Claude’s tokenizer.`,onUseSessionEstimator:()=>void 0,onOpenSkill:()=>void 0},decorators:[e=>(0,p.jsx)(`div`,{className:`w-[36rem] max-w-full p-4`,style:{"--surface-accent":r(`usage`)},children:(0,p.jsx)(e,{})})]},g={},_={args:{loads:s({invocations:a.invocations,skills:d,estimator:`standard`}),estimator:`standard`}},v={args:{loads:s({invocations:o.invocations,skills:d,estimator:`standard`}),estimator:`standard`,sessionEstimator:`standard`,reason:`This Copilot session mostly ran gpt-5.6-luna, which is not a Claude model.`}},y={args:{loads:s({invocations:[{skill:`ship-it`,at:Date.now(),via:`event`,chars:2400},{skill:`audit`,at:Date.now(),via:`tool`}],skills:d,estimator:`standard`}),estimator:`standard`,sessionEstimator:`standard`}},b={args:{loads:[]}},x={args:{loads:[],tool:`codex`}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    loads: [],
    tool: 'codex'
  }
}`,...x.parameters?.docs?.source}}},S=[`Loaded`,`Overridden`,`CopilotDoubleLoad`,`NotInstalled`,`None`,`NoneOnCodex`]})))()}C();export{v as CopilotDoubleLoad,g as Loaded,b as None,x as NoneOnCodex,y as NotInstalled,_ as Overridden,S as __namedExportsOrder,h as default};