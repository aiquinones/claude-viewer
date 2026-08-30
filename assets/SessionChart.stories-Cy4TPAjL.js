import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ct as t,Ft as n,Nt as r,at as i,it as a,n as o,wt as s}from"./iframe-BvyLxF4R.js";import{n as c,t as l}from"./context-DF2_Uw2C.js";import{c as u,n as d,o as f}from"./session-detail-fixtures-CH3mNyNV.js";import{a as p,i as m,n as h,r as g,t as _}from"./SessionChart-D8iIBRYV.js";import{a as v,i as y,n as b,r as x,t as S}from"./series-qu1EHuHq.js";import{n as C,t as w}from"./session-format-Z52L8lQU.js";var T,E,D,O,k,A,j,M,N,P,F,I;function L(){return(L=e((()=>{l(),i(),p(),S(),h(),n(),C(),t(),u(),T=o(),E=y(d.turns),D=v({points:E,invocations:d.invocations}),O={title:`Usage/SessionChart`,component:_,args:{points:E,loads:D,max:b(E),unit:`cost`,format:e=>w({value:e,tool:`claude`}),empty:`No requests recorded for this session.`},decorators:[e=>(0,T.jsx)(`div`,{className:`w-[42rem] max-w-full p-4`,style:{"--surface-accent":s(`usage`)},children:(0,T.jsx)(e,{})})]},k={},A={args:(()=>{let e=E.slice(0,8);return{points:e,loads:v({points:e,invocations:d.invocations}),max:b(e)}})()},j={args:{points:E.slice(0,1),loads:[],max:b(E.slice(0,1))}},M={args:(()=>{let e=x(d.contexts),t=c({context:d.contexts[d.contexts.length-1],settings:{...a.context,warnAt:{value:6e4,source:`user`}}}),n=m({reading:t,peak:b(e)});return{points:e,loads:v({points:e,invocations:d.invocations}),guides:g({reading:t,max:n}),max:n,unit:`context`,format:r}})()},N={args:(()=>{let e=y(f.turns);return{points:e,loads:v({points:e,invocations:f.invocations}),max:b(e),unit:`cost`,format:e=>w({value:e,tool:`copilot`})}})()},P={args:{points:[],loads:[],max:0}},F={args:(()=>{let e=E.reduce((e,t,n)=>t.value>E[e].value?n:e,0);return{loads:v({points:E,invocations:[`dev-feature`,`create-pr`,`claude-api`,`design`,`post-mortem`,`publish`].map(t=>({skill:t,at:E[e].at,via:`command`}))})}})()},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
    const series = toCostSeries(copilotDetail.turns);
    return {
      points: series,
      loads: toLoadPoints({
        points: series,
        invocations: copilotDetail.invocations
      }),
      max: peakOf(series),
      unit: 'cost',
      format: (value: number) => formatCost({
        value,
        tool: 'copilot'
      })
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
    const tallest: number = points.reduce((best: number, point: SeriesPoint, index: number) => point.value > points[best].value ? index : best, 0);
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