import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ct as t,Ft as n,Kt as r,Nt as i,Wt as a,at as o,it as s,n as c,wt as l}from"./iframe-BcKe7zli.js";import{n as u,t as d}from"./context-u3L7GrvR.js";import{i as f,n as p,o as m}from"./session-detail-fixtures-i6NA3UbE.js";import{a as h,i as g,n as _,r as v,t as y}from"./SessionChart-afT8ZhBM.js";import{a as b,i as x,n as S,r as C,t as w}from"./series-B8r8NxCi.js";var T,E,D,O,k,A,j,M,N,P,F,I;function L(){return(L=e((()=>{d(),o(),h(),w(),_(),n(),t(),r(),m(),T=c(),E=b({turns:p.turns,metric:`output-tokens`}),D=x({points:E,invocations:p.invocations}),O={title:`Usage/SessionChart`,component:y,args:{points:E,loads:D,max:S(E),unit:`output tokens`,format:a,empty:`No requests recorded for this session.`},decorators:[e=>(0,T.jsx)(`div`,{className:`w-[42rem] max-w-full p-4`,style:{"--surface-accent":l(`usage`)},children:(0,T.jsx)(e,{})})]},k={},A={args:(()=>{let e=E.slice(0,8);return{points:e,loads:x({points:e,invocations:p.invocations}),max:S(e)}})()},j={args:{points:E.slice(0,1),loads:[],max:S(E.slice(0,1))}},M={args:(()=>{let e=C(p.contexts),t=u({context:p.contexts[p.contexts.length-1],settings:{...s.context,warnAt:{value:6e4,source:`user`}}}),n=g({reading:t,peak:S(e)});return{points:e,loads:x({points:e,invocations:p.invocations}),guides:v({reading:t,max:n}),max:n,unit:`context`,format:i}})()},N={args:(()=>{let e=b({turns:f.turns,metric:`output-tokens`});return{points:e,loads:x({points:e,invocations:f.invocations}),max:S(e)}})()},P={args:{points:[],loads:[],max:0}},F={args:(()=>{let e=E.reduce((e,t,n)=>t.value>E[e].value?n:e,0);return{loads:x({points:E,invocations:[`dev-feature`,`create-pr`,`claude-api`,`design`,`post-mortem`,`publish`].map(t=>({skill:t,at:E[e].at,via:`command`}))})}})()},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: (() => {
    const short = points.slice(0, 8);
    return {
      points: short,
      loads: toLoadPoints({
        points: short,
        invocations: claudeDetail.invocations
      }),
      max: peakOf(short)
    };
  })()
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    points: points.slice(0, 1),
    loads: [],
    max: peakOf(points.slice(0, 1))
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: (() => {
    const series = toContextSeries(claudeDetail.contexts);
    const reading = readContext({
      context: claudeDetail.contexts[claudeDetail.contexts.length - 1],
      settings: {
        ...DEFAULT_SETTINGS.context,
        warnAt: {
          value: 60_000,
          source: 'user'
        }
      }
    });
    const max = contextMax({
      reading,
      peak: peakOf(series)
    });
    return {
      points: series,
      loads: toLoadPoints({
        points: series,
        invocations: claudeDetail.invocations
      }),
      guides: contextGuides({
        reading,
        max
      }),
      max,
      unit: 'context',
      format: formatContextTokens
    };
  })()
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: (() => {
    const series = toMetricSeries({
      turns: copilotDetail.turns,
      metric: 'output-tokens'
    });
    return {
      points: series,
      loads: toLoadPoints({
        points: series,
        invocations: copilotDetail.invocations
      }),
      max: peakOf(series)
    };
  })()
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    points: [],
    loads: [],
    max: 0
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: (() => {
    const tallest = points.reduce((best, point, index) => point.value > points[best].value ? index : best, 0);
    const names = ['dev-feature', 'create-pr', 'claude-api', 'design', 'post-mortem', 'publish'];
    return {
      loads: toLoadPoints({
        points,
        invocations: names.map(skill => ({
          skill,
          at: points[tallest].at,
          via: 'command' as const
        }))
      })
    };
  })()
}`,...F.parameters?.docs?.source}}},I=[`Session`,`Short`,`SinglePoint`,`WithGuides`,`CopilotDoubleLoad`,`Empty`,`CrowdedLoad`]})))()}L();export{N as CopilotDoubleLoad,F as CrowdedLoad,P as Empty,k as Session,A as Short,j as SinglePoint,M as WithGuides,I as __namedExportsOrder,O as default};