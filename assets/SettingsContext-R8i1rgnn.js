import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{at as t,ht as n,it as r,ln as i,mt as a,n as o}from"./iframe-rtz49Lbb.js";var s,c,l,u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{s=i(),n(),t(),c=o(),l=(0,s.createContext)({settings:r,openSettings:()=>void 0,setUsage:()=>void 0,openEstimator:()=>void 0,setEstimator:()=>void 0,setTheme:()=>void 0,setStageNames:()=>void 0}),u=({settings:e=r,openSettings:t=()=>void 0,setUsage:n=()=>void 0,openEstimator:i=()=>void 0,setEstimator:a=()=>void 0,setTheme:o=()=>void 0,setStageNames:s=()=>void 0,children:u})=>(0,c.jsx)(l.Provider,{value:{settings:e,openSettings:t,setUsage:n,openEstimator:i,setEstimator:a,setTheme:o,setStageNames:s},children:u}),d=()=>(0,s.useContext)(l).settings,f=()=>(0,s.useContext)(l).openSettings,p=()=>(0,s.useContext)(l).setUsage,m=()=>(0,s.useContext)(l).openEstimator,h=()=>(0,s.useContext)(l).setTheme,g=()=>(0,s.useContext)(l).setStageNames,_=()=>(0,s.useContext)(l).settings.tokens.estimator.value,v=()=>{let e=_();return(0,s.useCallback)(t=>a({chars:t,estimator:e}),[e])},u.__docgenInfo={description:``,methods:[],displayName:`SettingsProvider`,props:{children:{required:!0,tsType:{name:`ReactNode`},description:``},settings:{defaultValue:{value:`{
  tokens: {
    estimator: { value: DEFAULT_TOKEN_ESTIMATOR, source: 'default' }
  },
  theme: {
    mode: { value: DEFAULT_THEME_MODE, source: 'default' }
  },
  budgets: {
    skills: {
      description: { tokens: DEFAULT_DESCRIPTION_BUDGET, source: 'default' },
      content: { tokens: DEFAULT_CONTENT_BUDGET, source: 'default' },
      overrides: {}
    }
  },
  usage: {
    metric: { value: DEFAULT_USAGE_METRIC, source: 'default' },
    scope: { value: DEFAULT_USAGE_SCOPE, source: 'default' }
  },
  context: {
    warnAt: { value: DEFAULT_CONTEXT_WARN_AT, source: 'default' },
    errorAt: { value: DEFAULT_CONTEXT_ERROR_AT, source: 'default' },
    windowFallback: { value: DEFAULT_CONTEXT_WINDOW_FALLBACK, source: 'default' },
    windows: {}
  },
  stages: {
    names: {}
  }
}`,computed:!1},required:!1},openSettings:{defaultValue:{value:`() => undefined`,computed:!1},required:!1},setUsage:{defaultValue:{value:`() => undefined`,computed:!1},required:!1},openEstimator:{defaultValue:{value:`() => undefined`,computed:!1},required:!1},setEstimator:{defaultValue:{value:`() => undefined`,computed:!1},required:!1},setTheme:{defaultValue:{value:`() => undefined`,computed:!1},required:!1},setStageNames:{defaultValue:{value:`() => undefined`,computed:!1},required:!1}},composes:[`Partial`]}})))()}export{m as a,h as c,_ as i,p as l,y as n,f as o,v as r,g as s,u as t,d as u};