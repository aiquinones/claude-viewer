import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ct as t,n,wt as r}from"./iframe-DkjmdFDu.js";import{c as i,m as a,n as o,o as s,p as c}from"./session-detail-fixtures-Bn3SOtaQ.js";import{n as l,t as u}from"./session-format-DVRg98iK.js";import{a as d,n as f,r as p,t as m}from"./StageRadar-C_UGrqjr.js";import{f as h,p as g}from"./stage-labels-awQmkO-W.js";var _,v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{f(),l(),g(),p(),t(),i(),_=n(),v=(e,t=c)=>d({turns:e.turns,invocations:e.invocations,contexts:e.contexts,names:t}),y={title:`Usage/StageRadar`,component:m,args:{title:`Cost per stage`,stages:v(o),read:e=>e.value,format:e=>u({value:e,tool:`claude`}),unit:`cost`},decorators:[e=>(0,_.jsx)(`div`,{className:`p-4`,style:{"--surface-accent":r(`usage`)},children:(0,_.jsx)(e,{})})]},b={},x={args:{title:`Context growth`,read:e=>e.growth,format:h,unit:`context`}},S={args:{stages:v(a)}},C={args:{stages:v(s)}},w={args:{stages:v(o,{"dev-feature":`Build`})}},T={args:{stages:v(o,{"dev-feature":`The whole feature development cycle`})}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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