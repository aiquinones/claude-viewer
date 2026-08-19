import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{I as t,a as n,g as r,n as i}from"./iframe-Dk3SJjXj.js";import{n as a,t as o}from"./AgentsView-Cv-J-XQh.js";import{c as s,f as c,h as l,l as u,p as d,r as f,t as p,u as m}from"./agent-fixtures-Dq_LA-hO.js";var h,g,_,v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{m(),r(),a(),h=i(),g={title:`Agents/AgentsView`,component:o,args:{onOpenAgent:()=>void 0,onOpenFile:()=>void 0,onSearch:()=>void 0,onRefresh:()=>void 0,onBack:()=>void 0},decorators:[e=>(0,h.jsx)(`div`,{className:`h-screen`,children:(0,h.jsx)(e,{})})]},_={args:{agents:p,snapshot:t({skills:n})}},v={args:{agents:f,snapshot:t({skills:n})}},y={args:{agents:[],snapshot:t({skills:n})}},b={args:{agents:[l],snapshot:t({skills:n})}},x={args:{agents:d,snapshot:{...t({skills:n}),workspaceRoot:void 0}}},S={args:{agents:[c,u],snapshot:t({skills:n})}},C={args:{agents:p,snapshot:t({skills:n}),initialMode:`robots`}},w={args:{agents:s,snapshot:t({skills:n}),initialMode:`robots`}},T={args:{agents:f,snapshot:t({skills:n}),initialMode:`robots`}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
    agents: [workingAgent],
    snapshot: snapshot({
      skills: allSkills
    })
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    agents: remoteAgents,
    snapshot: {
      ...snapshot({
        skills: allSkills
      }),
      workspaceRoot: undefined
    }
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    agents: [noTranscriptAgent, idleAgent],
    snapshot: snapshot({
      skills: allSkills
    })
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    agents: allAgents,
    snapshot: snapshot({
      skills: allSkills
    }),
    initialMode: 'robots'
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    agents: everyMoodAgents,
    snapshot: snapshot({
      skills: allSkills
    }),
    initialMode: 'robots'
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    agents: copilotAgents,
    snapshot: snapshot({
      skills: allSkills
    }),
    initialMode: 'robots'
  }
}`,...T.parameters?.docs?.source}}},E=[`Default`,`CopilotOnly`,`NoSessions`,`OneWorking`,`NoWorkspace`,`NoTranscript`,`Robots`,`RobotsEveryMood`,`RobotsCopilotOnly`]})))()}D();export{v as CopilotOnly,_ as Default,y as NoSessions,S as NoTranscript,x as NoWorkspace,b as OneWorking,C as Robots,T as RobotsCopilotOnly,w as RobotsEveryMood,E as __namedExportsOrder,g as default};