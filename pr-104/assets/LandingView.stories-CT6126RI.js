import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{L as t,V as n,a as r,g as i,n as a}from"./iframe-ByBSfpzM.js";import{p as o,t as s}from"./agent-fixtures-CPaoWpUs.js";import{n as c,t as l}from"./LandingView-Cd02XaNc.js";var u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{o(),i(),c(),u=a(),d={title:`Landing/LandingView`,component:l,args:{agents:s,onOpenSurface:()=>void 0,onUnavailableSurface:()=>void 0,onSearch:()=>void 0,onRefresh:()=>void 0},decorators:[e=>(0,u.jsx)(`div`,{className:`h-screen`,children:(0,u.jsx)(e,{})})]},f={args:{snapshot:t({skills:r})}},p={args:{snapshot:{...t({skills:r.filter(e=>e.scope!==`project`),systemPrompt:n}),workspaceRoot:void 0}}},m={args:{snapshot:t({skills:r})},globals:{viewport:{value:`narrowPanel`}}},h={args:{agents:[],snapshot:t({skills:[],systemPrompt:[]})}},g={args:{snapshot:t({skills:r,workspaceRoot:`/Users/dev/repos/company/platform/services/api-gateway-experimental`})}},_={args:{agents:[],usage:void 0,snapshot:t({skills:[],systemPrompt:[],memory:null,pending:[`skills`,`systemPrompt`,`memory`]})}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    snapshot: snapshot({
      skills: allSkills
    })
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    snapshot: {
      ...snapshot({
        skills: allSkills.filter(skill => skill.scope !== 'project'),
        systemPrompt: userOnlyPromptFiles
      }),
      workspaceRoot: undefined
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    agents: [],
    snapshot: snapshot({
      skills: [],
      systemPrompt: []
    })
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    snapshot: snapshot({
      skills: allSkills,
      workspaceRoot: '/Users/dev/repos/company/platform/services/api-gateway-experimental'
    })
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    agents: [],
    usage: undefined,
    snapshot: snapshot({
      skills: [],
      systemPrompt: [],
      memory: null,
      pending: ['skills', 'systemPrompt', 'memory']
    })
  }
}`,..._.parameters?.docs?.source}}},v=[`Default`,`NoWorkspace`,`NarrowPanel`,`NothingConfigured`,`LongWorkspacePath`,`StillReading`]})))()}y();export{f as Default,g as LongWorkspacePath,m as NarrowPanel,p as NoWorkspace,h as NothingConfigured,_ as StillReading,v as __namedExportsOrder,d as default};