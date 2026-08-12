import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{N as t,a as n,g as r,n as i}from"./iframe-CXFIMbnf.js";import{i as a,l as o,o as s,r as c,s as l,t as u}from"./agent-fixtures-ulKuHoOo.js";import{n as d,t as f}from"./AgentsView-BBIBtdlV.js";var p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{a(),r(),d(),p=i(),m={title:`Agents/AgentsView`,component:f,args:{onOpenFile:()=>void 0,onSearch:()=>void 0,onRefresh:()=>void 0,onBack:()=>void 0},decorators:[e=>(0,p.jsx)(`div`,{className:`h-screen`,children:(0,p.jsx)(e,{})})]},h={args:{agents:u,snapshot:t({skills:n})}},g={args:{agents:[],snapshot:t({skills:n})}},_={args:{agents:[o],snapshot:t({skills:n})}},v={args:{agents:l,snapshot:{...t({skills:n}),workspaceRoot:void 0}}},y={args:{agents:[s,c],snapshot:t({skills:n})}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    agents: allAgents,
    snapshot: snapshot({
      skills: allSkills
    })
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    agents: [],
    snapshot: snapshot({
      skills: allSkills
    })
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    agents: [workingAgent],
    snapshot: snapshot({
      skills: allSkills
    })
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    agents: remoteAgents,
    snapshot: {
      ...snapshot({
        skills: allSkills
      }),
      workspaceRoot: undefined
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    agents: [noTranscriptAgent, idleAgent],
    snapshot: snapshot({
      skills: allSkills
    })
  }
}`,...y.parameters?.docs?.source}}},b=[`Default`,`NoSessions`,`OneWorking`,`NoWorkspace`,`NoTranscript`]})))()}x();export{h as Default,g as NoSessions,y as NoTranscript,v as NoWorkspace,_ as OneWorking,b as __namedExportsOrder,m as default};