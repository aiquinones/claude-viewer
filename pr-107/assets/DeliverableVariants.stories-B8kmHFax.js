import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,l as n}from"./types-DV-UfqEg.js";import{at as r,g as i,it as a,n as o,r as s}from"./iframe-DYWEEjxs.js";import{a as c,i as l,n as u,r as d,t as f}from"./DeliverableList-CUuj0x-8.js";import{n as p,t as m}from"./SettingsContext-CMzpLude.js";import{d as h,h as g,u as _}from"./agent-fixtures-tWgSNTAK.js";import{n as v,t as y}from"./AgentRow-D0d7utoa.js";import{c as b,p as x}from"./session-detail-fixtures-Bn3SOtaQ.js";var S,C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{n(),r(),v(),p(),u(),c(),g(),i(),b(),S=o(),C=Date.now(),w={title:`Agents/Deliverable chip styles`,parameters:{layout:`padded`}},T={storybook:`Storybook`,link:`Preview`,file:`Plan`,pr:`PR #418`},E=t.map(e=>({kind:e,title:T[e],url:`https://example.com/${e}`})),D=({variant:e,rows:t})=>{let{label:n,note:r}=l(e);return(0,S.jsxs)(`section`,{className:`flex flex-col gap-2 border-b border-border pb-5 last:border-0`,children:[(0,S.jsxs)(`header`,{className:`flex flex-col gap-0.5`,children:[(0,S.jsx)(`h3`,{className:`text-sm font-medium text-foreground`,children:n}),(0,S.jsx)(`p`,{className:`text-xs text-muted-foreground`,children:r})]}),(0,S.jsx)(f,{deliverables:t,onOpen:()=>void 0,variant:e})]})},O={render:()=>(0,S.jsx)(`div`,{className:`flex w-full max-w-[560px] flex-col gap-5 bg-background p-6`,children:d.map(e=>(0,S.jsx)(D,{variant:e,rows:E},e))})},k={render:()=>(0,S.jsx)(`div`,{className:`flex w-full max-w-[560px] flex-col gap-5 bg-background p-6`,children:d.map(e=>(0,S.jsx)(D,{variant:e,rows:h},e))})},A={decorators:[e=>(0,S.jsx)(m,{settings:{...a,stages:{names:x}},children:(0,S.jsx)(e,{})})],render:()=>(0,S.jsx)(`div`,{className:`flex w-full max-w-2xl flex-col gap-3 bg-background p-2`,children:d.map(e=>(0,S.jsxs)(`div`,{className:`flex flex-col gap-1 border-b border-border pb-3 last:border-0`,children:[(0,S.jsx)(`span`,{className:`px-3 text-xs text-muted-foreground`,children:l(e).label}),(0,S.jsx)(y,{agent:_,now:C,workspaceRoot:s,onOpen:()=>void 0,onAnalyze:()=>void 0,onOpenLog:()=>void 0,onOpenDeliverable:()=>void 0,onCopySessionId:()=>void 0,onKill:()=>void 0,deliverableVariant:e})]},e))})},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex w-full max-w-[560px] flex-col gap-5 bg-background p-6">
      {CHIP_VARIANTS.map(variant => <VariantBlock key={variant} variant={variant} rows={everyKind} />)}
    </div>
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex w-full max-w-[560px] flex-col gap-5 bg-background p-6">
      {CHIP_VARIANTS.map(variant => <VariantBlock key={variant} variant={variant} rows={deliverables} />)}
    </div>
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  decorators: [
  // The row prints a stage from the stored names, the same way \`AgentRow\`'s own stories do.
  Story => <SettingsProvider settings={{
    ...DEFAULT_SETTINGS,
    stages: {
      names: stageNames
    }
  }}>
        <Story />
      </SettingsProvider>],
  render: () => <div className="flex w-full max-w-2xl flex-col gap-3 bg-background p-2">
      {CHIP_VARIANTS.map(variant => <div key={variant} className="flex flex-col gap-1 border-b border-border pb-3 last:border-0">
          <span className="px-3 text-xs text-muted-foreground">
            {chipVariantStyle(variant).label}
          </span>
          <AgentRow agent={deliverableAgent} now={NOW} workspaceRoot={WORKSPACE} onOpen={() => undefined} onAnalyze={() => undefined} onOpenLog={() => undefined} onOpenDeliverable={() => undefined} onCopySessionId={() => undefined} onKill={() => undefined} deliverableVariant={variant} />
        </div>)}
    </div>
}`,...A.parameters?.docs?.source}}},j=[`AllVariants`,`RealDeclarations`,`InTheRow`]})))()}M();export{O as AllVariants,A as InTheRow,k as RealDeclarations,j as __namedExportsOrder,w as default};