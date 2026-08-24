import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{at as t,it as n,n as r}from"./iframe-CIc2-SFi.js";import{n as i,t as a}from"./context-u3L7GrvR.js";import{i as o,n as s}from"./format-size-9dlhABtg.js";import{c,u as l}from"./usage-format-CJ8G9Mwm.js";import{i as u,r as d}from"./surfaces-CeIzbiTH.js";import{a as f,c as p,i as m,l as h,n as g,o as _,r as v,s as y,t as b,u as x}from"./SessionChart-CnTrbmzv.js";import{i as S,n as C,o as w}from"./session-detail-fixtures-DjfPWwVC.js";var T,E,D,O,k,A,j,M,N,P,F;function I(){return(I=e((()=>{a(),t(),x(),v(),g(),o(),d(),l(),w(),T=r(),E=y({turns:C.turns,metric:`output-tokens`,costBasis:`all`}),D=_({points:E,invocations:C.invocations}),O={title:`Usage/SessionChart`,component:b,args:{points:E,loads:D,max:m(E),unit:`output tokens`,format:c,empty:`No requests recorded for this session.`},decorators:[e=>(0,T.jsx)(`div`,{className:`w-[42rem] max-w-full p-4`,style:{"--surface-accent":u(`usage`)},children:(0,T.jsx)(e,{})})]},k={},A={args:(()=>{let e=E.slice(0,8);return{points:e,loads:_({points:e,invocations:C.invocations}),max:m(e)}})()},j={args:{points:E.slice(0,1),loads:[],max:m(E.slice(0,1))}},M={args:(()=>{let e=f(C.contexts),t=i({context:C.contexts[C.contexts.length-1],settings:{...n.context,warnAt:{value:6e4,source:`user`}}}),r=h({reading:t,peak:m(e)});return{points:e,loads:_({points:e,invocations:C.invocations}),guides:p({reading:t,max:r}),max:r,unit:`context`,format:s}})()},N={args:(()=>{let e=y({turns:S.turns,metric:`output-tokens`,costBasis:`all`});return{points:e,loads:_({points:e,invocations:S.invocations}),max:m(e)}})()},P={args:{points:[],loads:[],max:0}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
      metric: 'output-tokens',
      costBasis: 'all'
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
}`,...P.parameters?.docs?.source}}},F=[`Session`,`Short`,`SinglePoint`,`WithGuides`,`CopilotDoubleLoad`,`Empty`]})))()}I();export{N as CopilotDoubleLoad,P as Empty,k as Session,A as Short,j as SinglePoint,M as WithGuides,F as __namedExportsOrder,O as default};