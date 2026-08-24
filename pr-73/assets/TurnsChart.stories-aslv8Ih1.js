import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-DgMGEB4r.js";import{c as n,u as r}from"./usage-format-CJ8G9Mwm.js";import{i,r as a}from"./surfaces-ltwftzTa.js";import{a as o,i as s,n as c,r as l,t as u}from"./TurnsChart-Z2Xf__ln.js";import{i as d,n as f,o as p}from"./session-detail-fixtures-CSHnxy5u.js";var m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{a(),l(),c(),r(),p(),m=t(),h=o({turns:f.turns,metric:`output-tokens`,costBasis:`all`}),g={title:`Usage/TurnsChart`,component:u,args:{bars:h,marks:s({bars:h,invocations:f.invocations}),metric:`output-tokens`,format:n},decorators:[e=>(0,m.jsx)(`div`,{className:`w-[42rem] max-w-full p-4`,style:{"--surface-accent":i(`usage`)},children:(0,m.jsx)(e,{})})]},_={},v={args:{bars:h.slice(0,8),marks:s({bars:h.slice(0,8),invocations:f.invocations})}},y={args:(()=>{let e=o({turns:d.turns,metric:`output-tokens`,costBasis:`all`});return{bars:e,marks:s({bars:e,invocations:d.invocations})}})()},b={args:{bars:[],marks:[]}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    bars: bars.slice(0, 8),
    marks: toLoadMarks({
      bars: bars.slice(0, 8),
      invocations: claudeDetail.invocations
    })
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: (() => {
    const copilotBars = toTurnBars({
      turns: copilotDetail.turns,
      metric: 'output-tokens',
      costBasis: 'all'
    });
    return {
      bars: copilotBars,
      marks: toLoadMarks({
        bars: copilotBars,
        invocations: copilotDetail.invocations
      })
    };
  })()
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    bars: [],
    marks: []
  }
}`,...b.parameters?.docs?.source}}},x=[`Session`,`Short`,`CopilotDoubleLoad`,`Empty`]})))()}S();export{y as CopilotDoubleLoad,b as Empty,_ as Session,v as Short,x as __namedExportsOrder,g as default};