import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ct as t,Kt as n,Wt as r,n as i,wt as a}from"./iframe-BDy95zVS.js";import{a as o,n as s,r as c,t as l}from"./StageRadar-DrY2s--V.js";import{d as u,u as d}from"./stage-labels-CPutIw-e.js";import{d as f,f as p,i as m,n as h,o as g}from"./session-detail-fixtures-i6NA3UbE.js";var _,v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{n(),s(),u(),c(),t(),g(),_=i(),v=(e,t=f)=>o({turns:e.turns,invocations:e.invocations,contexts:e.contexts,metric:`output-tokens`,names:t}),y={title:`Usage/StageRadar`,component:l,args:{title:`Output tokens per stage`,stages:v(h),read:e=>e.value,format:r,unit:`output tokens`},decorators:[e=>(0,_.jsx)(`div`,{className:`p-4`,style:{"--surface-accent":a(`usage`)},children:(0,_.jsx)(e,{})})]},b={},x={args:{title:`Context growth`,read:e=>e.growth,format:d,unit:`context`}},S={args:{stages:v(p)}},C={args:{stages:v(m)}},w={args:{stages:v(h,{"dev-feature":`Build`})}},T={args:{stages:v(h,{"dev-feature":`The whole feature development cycle`})}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Context growth',
    read: (stage: SessionStage) => stage.growth,
    format: formatGrowth,
    unit: 'context'
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    stages: stagesOf(twoStageDetail)
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    stages: stagesOf(copilotDetail)
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    stages: stagesOf(claudeDetail, {
      'dev-feature': 'Build'
    })
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    stages: stagesOf(claudeDetail, {
      'dev-feature': 'The whole feature development cycle'
    })
  }
}`,...T.parameters?.docs?.source}}},E=[`FourStages`,`ContextGrowth`,`TwoStages`,`OneStage`,`SkillsIgnored`,`LongName`]})))()}D();export{x as ContextGrowth,b as FourStages,T as LongName,C as OneStage,w as SkillsIgnored,S as TwoStages,E as __namedExportsOrder,y as default};