import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ct as t,Kt as n,Wt as r,n as i,wt as a}from"./iframe-a4iOpKfw.js";import{a as o,d as s,l as c,n as l,p as u,t as d,u as f}from"./StageRadar-B7MwmRCx.js";import{d as p,i as m,n as h,o as g,t as _}from"./session-detail-fixtures-7P0df3iC.js";var v,y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{n(),l(),f(),s(),t(),g(),v=i(),y=(e,t={})=>u({turns:e.turns,invocations:e.invocations,contexts:e.contexts,metric:`output-tokens`,costBasis:`all`,names:t}),b={title:`Usage/StageRadar`,component:d,args:{title:`Output tokens per stage`,stages:y(h),read:e=>e.value,format:r,unit:`output tokens`,empty:o},decorators:[e=>(0,v.jsx)(`div`,{className:`p-4`,style:{"--surface-accent":a(`usage`)},children:(0,v.jsx)(e,{})})]},x={},S={args:{title:`Context growth`,read:e=>e.growth,format:c,unit:`context`}},C={args:{stages:y(p)}},w={args:{stages:y(m)}},T={args:{stages:y(_)}},E={args:{stages:y(h,{"dev-feature":`Build`,"create-pr":`Ship`,publish:`Release`})}},D={args:{stages:y(h,{"dev-feature":`The whole feature development cycle`})}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Context growth',
    read: (stage: SessionStage) => stage.growth,
    format: formatGrowth,
    unit: 'context'
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    stages: stagesOf(twoStageDetail)
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    stages: stagesOf(copilotDetail)
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    stages: stagesOf(bareDetail)
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    stages: stagesOf(claudeDetail, {
      'dev-feature': 'Build',
      'create-pr': 'Ship',
      publish: 'Release'
    })
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    stages: stagesOf(claudeDetail, {
      'dev-feature': 'The whole feature development cycle'
    })
  }
}`,...D.parameters?.docs?.source}}},O=[`FourStages`,`ContextGrowth`,`TwoStages`,`OneStage`,`NoStages`,`Renamed`,`LongName`]})))()}k();export{S as ContextGrowth,x as FourStages,D as LongName,T as NoStages,w as OneStage,E as Renamed,C as TwoStages,O as __namedExportsOrder,b as default};