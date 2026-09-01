import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{L as t,V as n,a as r,g as i,i as a,n as o,s}from"./iframe-MHXp9LG4.js";import{n as c,t as l}from"./SystemPromptView-SOJjXYZM.js";var u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{i(),c(),u=o(),d={title:`SystemPrompt/SystemPromptView`,component:l,args:{onSearch:()=>void 0,onRefresh:()=>void 0,onBack:()=>void 0},decorators:[e=>(0,u.jsx)(`div`,{className:`h-screen`,children:(0,u.jsx)(e,{})})]},f={args:{snapshot:t({skills:r,systemPrompt:a})}},p={args:{snapshot:{...t({skills:r,systemPrompt:n}),workspaceRoot:void 0}}},m={args:{snapshot:t({skills:r,systemPrompt:[]})}},h={args:{snapshot:t({skills:r,systemPrompt:s})}},g={args:{snapshot:t({skills:r,systemPrompt:a})}},_={args:{snapshot:t({skills:[],systemPrompt:[],pending:[`systemPrompt`]})}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    snapshot: snapshot({
      skills: allSkills,
      systemPrompt: allPromptFiles
    })
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    snapshot: {
      ...snapshot({
        skills: allSkills,
        systemPrompt: userOnlyPromptFiles
      }),
      workspaceRoot: undefined
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    snapshot: snapshot({
      skills: allSkills,
      systemPrompt: []
    })
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    snapshot: snapshot({
      skills: allSkills,
      systemPrompt: brokenPromptFiles
    })
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    snapshot: snapshot({
      skills: allSkills,
      systemPrompt: allPromptFiles
    })
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    snapshot: snapshot({
      skills: [],
      systemPrompt: [],
      pending: ['systemPrompt']
    })
  }
}`,..._.parameters?.docs?.source}}},v=[`Default`,`NoWorkspace`,`NoFiles`,`BrokenImports`,`ClickARowToRender`,`StillReading`]})))()}y();export{h as BrokenImports,g as ClickARowToRender,f as Default,m as NoFiles,p as NoWorkspace,_ as StillReading,v as __namedExportsOrder,d as default};