import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ct as t,Ft as n,Kt as r,Nt as i,Wt as a,at as o,it as s,n as c,wt as l}from"./iframe-BDy95zVS.js";import{n as u,t as d}from"./context-u3L7GrvR.js";import{a as f,i as p,n as m,r as h,t as g}from"./SessionChart-BqRDboAE.js";import{a as _,i as v,n as y,r as b,t as x}from"./series-B8r8NxCi.js";import{i as S,n as C,o as w}from"./session-detail-fixtures-i6NA3UbE.js";var T,E,D,O,k,A,j,M,N,P,F,I;function L(){return(L=e((()=>{d(),o(),f(),x(),m(),n(),t(),r(),w(),T=c(),E=_({turns:C.turns,metric:`output-tokens`}),D=v({points:E,invocations:C.invocations}),O={title:`Usage/SessionChart`,component:g,args:{points:E,loads:D,max:y(E),unit:`output tokens`,format:a,empty:`No requests recorded for this session.`},decorators:[e=>(0,T.jsx)(`div`,{className:`w-[42rem] max-w-full p-4`,style:{"--surface-accent":l(`usage`)},children:(0,T.jsx)(e,{})})]},k={},A={args:(()=>{let e=E.slice(0,8);return{points:e,loads:v({points:e,invocations:C.invocations}),max:y(e)}})()},j={args:{points:E.slice(0,1),loads:[],max:y(E.slice(0,1))}},M={args:(()=>{let e=b(C.contexts),t=u({context:C.contexts[C.contexts.length-1],settings:{...s.context,warnAt:{value:6e4,source:`user`}}}),n=p({reading:t,peak:y(e)});return{points:e,loads:v({points:e,invocations:C.invocations}),guides:h({reading:t,max:n}),max:n,unit:`context`,format:i}})()},N={args:(()=>{let e=_({turns:S.turns,metric:`output-tokens`});return{points:e,loads:v({points:e,invocations:S.invocations}),max:y(e)}})()},P={args:{points:[],loads:[],max:0}},F={args:(()=>{let e=E.reduce((e,t,n)=>t.value>E[e].value?n:e,0);return{loads:v({points:E,invocations:[`dev-feature`,`create-pr`,`claude-api`,`design`,`post-mortem`,`publish`].map(t=>({skill:t,at:E[e].at,via:`command`}))})}})()},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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