import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{at as t,ft as n,it as r,kt as i,n as a,pt as o}from"./iframe-DKDjAqv-.js";var s,c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{s=i(),o(),t(),c=a(),l=(0,s.createContext)({settings:r,openSettings:()=>void 0,setUsage:()=>void 0,openEstimator:()=>void 0,setEstimator:()=>void 0}),u=({settings:e=r,openSettings:t=()=>void 0,setUsage:n=()=>void 0,openEstimator:i=()=>void 0,setEstimator:a=()=>void 0,children:o})=>(0,c.jsx)(l.Provider,{value:{settings:e,openSettings:t,setUsage:n,openEstimator:i,setEstimator:a},children:o}),d=()=>(0,s.useContext)(l).settings,f=()=>(0,s.useContext)(l).openSettings,p=()=>(0,s.useContext)(l).setUsage,m=()=>(0,s.useContext)(l).openEstimator,h=()=>(0,s.useContext)(l).settings.tokens.estimator.value,g=()=>{let e=h();return(0,s.useCallback)(t=>n({chars:t,estimator:e}),[e])},u.__docgenInfo={description:``,methods:[],displayName:`SettingsProvider`,props:{children:{required:!0,tsType:{name:`ReactNode`},description:``},settings:{defaultValue:{value:`{
  tokens: {
    estimator: { value: DEFAULT_TOKEN_ESTIMATOR, source: 'default' }
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
    scope: { value: DEFAULT_USAGE_SCOPE, source: 'default' },
    costBasis: { value: DEFAULT_USAGE_COST_BASIS, source: 'default' }
  },
  context: {
    warnAt: { value: DEFAULT_CONTEXT_WARN_AT, source: 'default' },
    errorAt: { value: DEFAULT_CONTEXT_ERROR_AT, source: 'default' },
    windowFallback: { value: DEFAULT_CONTEXT_WINDOW_FALLBACK, source: 'default' },
    windows: {}
  }
}`,computed:!1},required:!1},openSettings:{defaultValue:{value:`() => undefined`,computed:!1},required:!1},setUsage:{defaultValue:{value:`() => undefined`,computed:!1},required:!1},openEstimator:{defaultValue:{value:`() => undefined`,computed:!1},required:!1},setEstimator:{defaultValue:{value:`() => undefined`,computed:!1},required:!1}},composes:[`Partial`]}})))()}export{m as a,d as c,h as i,_ as n,f as o,g as r,p as s,u as t};