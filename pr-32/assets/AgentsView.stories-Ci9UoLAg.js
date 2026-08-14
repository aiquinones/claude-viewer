import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{N as t,a as n,g as r,n as i}from"./iframe-F48zrQk4.js";import{c as a,d as o,n as s,p as c,s as l,t as u,u as d}from"./agent-fixtures-CkT8b2K6.js";import{n as f,t as p}from"./AgentsView-BR5sbebG.js";var m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{a(),r(),f(),m=i(),h={title:`Agents/AgentsView`,component:p,args:{onOpenFile:()=>void 0,onSearch:()=>void 0,onRefresh:()=>void 0,onBack:()=>void 0},decorators:[e=>(0,m.jsx)(`div`,{className:`h-screen`,children:(0,m.jsx)(e,{})})]},g={args:{agents:u,snapshot:t({skills:n})}},_={args:{agents:s,snapshot:t({skills:n})}},v={args:{agents:[],snapshot:t({skills:n})}},y={args:{agents:[c],snapshot:t({skills:n})}},b={args:{agents:o,snapshot:{...t({skills:n}),workspaceRoot:void 0}}},x={args:{agents:[d,l],snapshot:t({skills:n})}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    agents: allAgents,
    snapshot: snapshot({
      skills: allSkills
    })
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    agents: copilotAgents,
    snapshot: snapshot({
      skills: allSkills
    })
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    agents: [],
    snapshot: snapshot({
      skills: allSkills
    })
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    agents: [workingAgent],
    snapshot: snapshot({
      skills: allSkills
    })
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    agents: remoteAgents,
    snapshot: {
      ...snapshot({
        skills: allSkills
      }),
      workspaceRoot: undefined
    }
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    agents: [noTranscriptAgent, idleAgent],
    snapshot: snapshot({
      skills: allSkills
    })
  }
}`,...x.parameters?.docs?.source}}},S=[`Default`,`CopilotOnly`,`NoSessions`,`OneWorking`,`NoWorkspace`,`NoTranscript`]})))()}C();export{_ as CopilotOnly,g as Default,v as NoSessions,x as NoTranscript,b as NoWorkspace,y as OneWorking,S as __namedExportsOrder,h as default};