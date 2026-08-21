import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{A as t,E as n,I as r,T as i,a,g as o,n as s}from"./iframe-BxewVUOQ.js";import{n as c,t as l}from"./SkillView-5Z9HBo0B.js";var u,d,f,p,m,h,g,_,v,y;function b(){return(b=e((()=>{o(),c(),u=s(),d={title:`Skills/SkillView`,component:l,args:{onOpenFile:()=>void 0,onSearch:()=>void 0,onRefresh:()=>void 0,onBack:()=>void 0},decorators:[e=>(0,u.jsx)(`div`,{className:`h-screen`,children:(0,u.jsx)(e,{})})]},f={args:{snapshot:r({skills:a})}},p={args:{snapshot:r({skills:a})},globals:{viewport:{value:`narrowPanel`}}},m={args:{snapshot:{...r({skills:a.filter(e=>e.scope!==`project`)}),workspaceRoot:void 0}}},h={args:{snapshot:r({skills:[]})}},g={args:{snapshot:r({skills:[i]})}},_={args:{snapshot:r({skills:a.filter(e=>e.scope===`plugin`)})}},v={args:{snapshot:r({skills:a}),reveal:t(n)}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    snapshot: snapshot({
      skills: allSkills
    })
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    snapshot: snapshot({
      skills: allSkills
    })
  },
  globals: {
    viewport: {
      value: 'narrowPanel'
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    snapshot: {
      ...snapshot({
        skills: allSkills.filter(skill => skill.scope !== 'project')
      }),
      workspaceRoot: undefined
    }
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    snapshot: snapshot({
      skills: []
    })
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    snapshot: snapshot({
      skills: [plainSkill]
    })
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    snapshot: snapshot({
      skills: allSkills.filter(skill => skill.scope === 'plugin')
    })
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    snapshot: snapshot({
      skills: allSkills
    }),
    reveal: reveal(pluginDeploy)
  }
}`,...v.parameters?.docs?.source}}},y=[`Default`,`NarrowPanel`,`NoWorkspace`,`NoSkills`,`SingleSkill`,`OnlyPluginSkills`,`RevealedShadowedSkill`]})))()}b();export{f as Default,p as NarrowPanel,h as NoSkills,m as NoWorkspace,_ as OnlyPluginSkills,v as RevealedShadowedSkill,g as SingleSkill,y as __namedExportsOrder,d as default};