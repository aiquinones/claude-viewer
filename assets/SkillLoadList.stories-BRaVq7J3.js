import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ct as t,n,wt as r}from"./iframe-CvauhvaA.js";import{c as i,i as a,n as o,o as s}from"./session-detail-fixtures-Bn3SOtaQ.js";import{i as c,n as l,r as u,t as d}from"./SkillLoadList-DKrIlMRF.js";import{l as f,r as p}from"./usage-fixtures-DRe59If-.js";var m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{t(),l(),u(),i(),p(),m=n(),h=c({invocations:o.invocations,skills:f,estimator:`anthropic`}),g={title:`Usage/SkillLoadList`,component:d,args:{loads:h,tool:`claude`,estimator:`anthropic`,sessionEstimator:`anthropic`,reason:`This is a Claude Code session, so it ran Claude’s tokenizer.`,onUseSessionEstimator:()=>void 0,onOpenSkill:()=>void 0},decorators:[e=>(0,m.jsx)(`div`,{className:`w-[36rem] max-w-full p-4`,style:{"--surface-accent":r(`usage`)},children:(0,m.jsx)(e,{})})]},_={},v={args:{loads:c({invocations:o.invocations,skills:f,estimator:`standard`}),estimator:`standard`}},y={args:{loads:c({invocations:s.invocations,skills:f,estimator:`standard`}),estimator:`standard`,sessionEstimator:`standard`,reason:`This Copilot session mostly ran gpt-5.6-luna, which is not a Claude model.`}},b={args:{loads:c({invocations:[{skill:`ship-it`,at:Date.now(),via:`event`,chars:2400},{skill:`audit`,at:Date.now(),via:`tool`}],skills:f,estimator:`standard`}),estimator:`standard`,sessionEstimator:`standard`}},x={args:{loads:c({invocations:a.invocations,skills:f,estimator:`standard`}),tool:`codex`,estimator:`standard`,sessionEstimator:`standard`,reason:`This is a Codex session, which does not run a Claude model.`}},S={args:{loads:[]}},C={args:{loads:[],tool:`codex`}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    loads: toSkillLoads({
      invocations: claudeDetail.invocations,
      skills: usageSkills,
      estimator: 'standard'
    }),
    estimator: 'standard'
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    loads: toSkillLoads({
      invocations: codexDetail.invocations,
      skills: usageSkills,
      estimator: 'standard'
    }),
    tool: 'codex',
    estimator: 'standard',
    sessionEstimator: 'standard',
    reason: 'This is a Codex session, which does not run a Claude model.'
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    loads: []
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    loads: [],
    tool: 'codex'
  }
}`,...C.parameters?.docs?.source}}},w=[`Loaded`,`Overridden`,`CopilotDoubleLoad`,`NotInstalled`,`Codex`,`None`,`NoneOnCodex`]})))()}T();export{x as Codex,y as CopilotDoubleLoad,_ as Loaded,S as None,C as NoneOnCodex,b as NotInstalled,v as Overridden,w as __namedExportsOrder,g as default};