import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-DbQK32Gq.js";import{n,t as r}from"./UsageInfo-CjVAuTjn.js";import{i,n as a,o,r as s,t as c}from"./usage-fixtures-CeFQbM2T.js";var l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{s(),n(),l=t(),u={title:`Usage/UsageInfo`,component:r,args:{breakdown:a.windows.day},decorators:[(e,t)=>t.parameters.inPane?(0,l.jsx)(e,{}):(0,l.jsx)(`div`,{className:`p-6 pt-96`,children:(0,l.jsx)(e,{})})]},d={},f={args:{breakdown:c.windows.day}},p={args:{breakdown:o.windows.day}},m={args:{breakdown:i.windows.day}},h={parameters:{inPane:!0},decorators:[e=>(0,l.jsxs)(`div`,{className:`flex h-screen flex-col`,children:[(0,l.jsx)(`div`,{className:`border-b border-border px-4 py-3 text-sm font-semibold`,children:`Usage › Claude costs and metering`}),(0,l.jsx)(`div`,{className:`min-h-0 flex-1 overflow-y-auto overflow-x-clip`,children:(0,l.jsxs)(`div`,{className:`flex flex-col gap-5 px-4 py-4`,children:[(0,l.jsx)(e,{}),(0,l.jsx)(`div`,{className:`h-[80rem]`})]})})]})]},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    breakdown: bothClis.windows.day
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    breakdown: unpricedModel.windows.day
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    breakdown: noUsage.windows.day
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  parameters: {
    inPane: true
  },
  decorators: [Story => <div className="flex h-screen flex-col">
        <div className="border-b border-border px-4 py-3 text-sm font-semibold">
          Usage › Claude costs and metering
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-clip">
          <div className="flex flex-col gap-5 px-4 py-4">
            <Story />
            {/* Enough below it to scroll, so the pane is a real one. */}
            <div className="h-[80rem]" />
          </div>
        </div>
      </div>]
}`,...h.parameters?.docs?.source}}},g=[`Default`,`BothClis`,`UnpricedModel`,`Empty`,`InAScrolledPane`]})))()}_();export{f as BothClis,d as Default,m as Empty,h as InAScrolledPane,p as UnpricedModel,g as __namedExportsOrder,u as default};