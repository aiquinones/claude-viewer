import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ct as t,Kt as n,Wt as r,n as i,wt as a}from"./iframe-B7_220UB.js";import{d as o,f as s,i as c,n as l,o as u}from"./session-detail-fixtures-i6NA3UbE.js";import{a as d,n as f,r as p,t as m}from"./StageRadar-DUvnP2ZV.js";import{d as h,u as g}from"./stage-labels-C-Hy-grS.js";var _,v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{n(),f(),h(),p(),t(),u(),_=i(),v=(e,t=o)=>d({turns:e.turns,invocations:e.invocations,contexts:e.contexts,metric:`output-tokens`,names:t}),y={title:`Usage/StageRadar`,component:m,args:{title:`Output tokens per stage`,stages:v(l),read:e=>e.value,format:r,unit:`output tokens`},decorators:[e=>(0,_.jsx)(`div`,{className:`p-4`,style:{"--surface-accent":a(`usage`)},children:(0,_.jsx)(e,{})})]},b={},x={args:{title:`Context growth`,read:e=>e.growth,format:g,unit:`context`}},S={args:{stages:v(s)}},C={args:{stages:v(c)}},w={args:{stages:v(l,{"dev-feature":`Build`})}},T={args:{stages:v(l,{"dev-feature":`The whole feature development cycle`})}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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