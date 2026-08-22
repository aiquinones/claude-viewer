import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{L as t,a as n,g as r,n as i}from"./iframe-9rM6qb18.js";import{n as a,t as o}from"./AgentsView-IdhB4Ghd.js";import{_ as s,c,f as l,l as u,m as d,r as f,t as p,u as m}from"./agent-fixtures-j3VqYYnh.js";var h,g,_,v,y,b,x,S,C,w,T,E,D,O,k;function A(){return(A=e((()=>{m(),r(),a(),h=i(),g={title:`Agents/AgentsView`,component:o,args:{onOpenAgent:()=>void 0,onOpenFile:()=>void 0,onSearch:()=>void 0,onRefresh:()=>void 0,onBack:()=>void 0},decorators:[e=>(0,h.jsx)(`div`,{className:`h-screen`,children:(0,h.jsx)(e,{})})]},_={args:{agents:p,snapshot:t({skills:n})}},v={args:{agents:f,snapshot:t({skills:n})}},y={args:{agents:[],snapshot:t({skills:n})}},b={args:{agents:p,snapshot:t({skills:n}),initialCollapsed:[`elsewhere`]}},x={args:{agents:p,snapshot:t({skills:n}),initialCollapsed:[`here`,`elsewhere`]}},S={args:{agents:[s],snapshot:t({skills:n})}},C={args:{agents:d,snapshot:{...t({skills:n}),workspaceRoot:void 0}}},w={args:{agents:d,snapshot:{...t({skills:n}),workspaceRoot:void 0},initialCollapsed:[`elsewhere`]}},T={args:{agents:[l,u],snapshot:t({skills:n})}},E={args:{agents:p,snapshot:t({skills:n}),initialMode:`robots`}},D={args:{agents:c,snapshot:t({skills:n}),initialMode:`robots`}},O={args:{agents:f,snapshot:t({skills:n}),initialMode:`robots`}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    agents: allAgents,
    snapshot: snapshot({
      skills: allSkills
    })
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    agents: copilotAgents,
    snapshot: snapshot({
      skills: allSkills
    })
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    agents: [],
    snapshot: snapshot({
      skills: allSkills
    })
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    agents: allAgents,
    snapshot: snapshot({
      skills: allSkills
    }),
    initialCollapsed: ['elsewhere']
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    agents: allAgents,
    snapshot: snapshot({
      skills: allSkills
    }),
    initialCollapsed: ['here', 'elsewhere']
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    agents: [workingAgent],
    snapshot: snapshot({
      skills: allSkills
    })
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    agents: remoteAgents,
    snapshot: {
      ...snapshot({
        skills: allSkills
      }),
      workspaceRoot: undefined
    }
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    agents: remoteAgents,
    snapshot: {
      ...snapshot({
        skills: allSkills
      }),
      workspaceRoot: undefined
    },
    initialCollapsed: ['elsewhere']
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    agents: [noTranscriptAgent, idleAgent],
    snapshot: snapshot({
      skills: allSkills
    })
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    agents: allAgents,
    snapshot: snapshot({
      skills: allSkills
    }),
    initialMode: 'robots'
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    agents: everyMoodAgents,
    snapshot: snapshot({
      skills: allSkills
    }),
    initialMode: 'robots'
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    agents: copilotAgents,
    snapshot: snapshot({
      skills: allSkills
    }),
    initialMode: 'robots'
  }
}`,...O.parameters?.docs?.source}}},k=[`Default`,`CopilotOnly`,`NoSessions`,`Collapsed`,`AllCollapsed`,`OneWorking`,`NoWorkspace`,`NoWorkspaceCollapsed`,`NoTranscript`,`Robots`,`RobotsEveryMood`,`RobotsCopilotOnly`]})))()}A();export{x as AllCollapsed,b as Collapsed,v as CopilotOnly,_ as Default,y as NoSessions,T as NoTranscript,C as NoWorkspace,w as NoWorkspaceCollapsed,S as OneWorking,E as Robots,O as RobotsCopilotOnly,D as RobotsEveryMood,k as __namedExportsOrder,g as default};