import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,l as n}from"./types-DV-UfqEg.js";import{n as r}from"./iframe-CSFDWdzb.js";import{a as i,i as a,n as o,r as s,t as c}from"./DeliverableList-Dc5HimdH.js";import{d as l,h as u,u as d}from"./agent-fixtures-BaK9O76D.js";import{n as f,t as p}from"./AgentRowFooter-CdtB0MtO.js";var m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{n(),f(),o(),i(),u(),m=r(),h={title:`Agents/Deliverable chip styles`,parameters:{layout:`padded`}},g={storybook:`Storybook`,link:`Preview`,file:`Plan`,pr:`PR #418`},_=t.map(e=>({kind:e,title:g[e],url:`https://example.com/${e}`})),v=({variant:e,rows:t})=>{let{label:n,note:r}=a(e);return(0,m.jsxs)(`section`,{className:`flex flex-col gap-2 border-b border-border pb-5 last:border-0`,children:[(0,m.jsxs)(`header`,{className:`flex flex-col gap-0.5`,children:[(0,m.jsx)(`h3`,{className:`text-sm font-medium text-foreground`,children:n}),(0,m.jsx)(`p`,{className:`text-xs text-muted-foreground`,children:r})]}),(0,m.jsx)(c,{deliverables:t,onOpen:()=>void 0,variant:e})]})},y={render:()=>(0,m.jsx)(`div`,{className:`flex w-full max-w-[560px] flex-col gap-5 bg-background p-6`,children:s.map(e=>(0,m.jsx)(v,{variant:e,rows:_},e))})},b={render:()=>(0,m.jsx)(`div`,{className:`flex w-full max-w-[560px] flex-col gap-5 bg-background p-6`,children:s.map(e=>(0,m.jsx)(v,{variant:e,rows:l},e))})},x={render:()=>(0,m.jsx)(`div`,{className:`flex w-full max-w-[560px] flex-col gap-4 bg-background py-4`,children:s.map(e=>(0,m.jsxs)(`div`,{className:`flex flex-col gap-1 border-b border-border pb-3 last:border-0`,children:[(0,m.jsx)(`span`,{className:`px-3 pl-6 text-xs text-muted-foreground`,children:a(e).label}),(0,m.jsx)(p,{agent:d,onOpenDeliverable:()=>void 0,deliverableVariant:e})]},e))})},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex w-full max-w-[560px] flex-col gap-5 bg-background p-6">
      {CHIP_VARIANTS.map(variant => <VariantBlock key={variant} variant={variant} rows={everyKind} />)}
    </div>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex w-full max-w-[560px] flex-col gap-5 bg-background p-6">
      {CHIP_VARIANTS.map(variant => <VariantBlock key={variant} variant={variant} rows={deliverables} />)}
    </div>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex w-full max-w-[560px] flex-col gap-4 bg-background py-4">
      {CHIP_VARIANTS.map(variant => <div key={variant} className="flex flex-col gap-1 border-b border-border pb-3 last:border-0">
          <span className="px-3 pl-6 text-xs text-muted-foreground">
            {chipVariantStyle(variant).label}
          </span>
          <AgentRowFooter agent={deliverableAgent} onOpenDeliverable={() => undefined} deliverableVariant={variant} />
        </div>)}
    </div>
}`,...x.parameters?.docs?.source}}},S=[`AllVariants`,`RealDeclarations`,`InTheRow`]})))()}C();export{y as AllVariants,x as InTheRow,b as RealDeclarations,S as __namedExportsOrder,h as default};