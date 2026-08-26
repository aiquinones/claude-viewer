import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{ht as t,ln as n,n as r,pt as i}from"./iframe-BcKe7zli.js";import{n as a,t as o}from"./EstimatorFormula-Bmkdc-hE.js";var s,c,l,u,d,f,p;function m(){return(m=e((()=>{s=n(),t(),a(),c=r(),l={title:`Settings/EstimatorFormula`,component:o,decorators:[e=>(0,c.jsx)(`div`,{className:`w-md p-6`,children:(0,c.jsx)(e,{})})]},u={args:{estimator:`standard`}},d={args:{estimator:`anthropic`}},f={render:()=>{let[e,t]=(0,s.useState)(`standard`);return(0,c.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,c.jsx)(o,{estimator:e}),(0,c.jsx)(`div`,{className:`flex gap-2`,children:i.map(n=>(0,c.jsx)(`button`,{type:`button`,onClick:()=>t(n),className:`cursor-pointer rounded-md border border-border px-2 py-1 text-xs ${n===e?`bg-accent text-foreground`:`text-muted-foreground`}`,children:n},n))})]})}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    estimator: 'standard'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    estimator: 'anthropic'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [estimator, setEstimator] = useState<TokenEstimator>('standard');
    return <div className="flex flex-col gap-3">
        <EstimatorFormula estimator={estimator} />
        <div className="flex gap-2">
          {TOKEN_ESTIMATORS.map(option => <button key={option} type="button" onClick={() => setEstimator(option)} className={\`cursor-pointer rounded-md border border-border px-2 py-1 text-xs \${option === estimator ? 'bg-accent text-foreground' : 'text-muted-foreground'}\`}>
              {option}
            </button>)}
        </div>
      </div>;
  }
}`,...f.parameters?.docs?.source}}},p=[`Standard`,`Anthropic`,`Switching`]})))()}m();export{d as Anthropic,u as Standard,f as Switching,p as __namedExportsOrder,l as default};