import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-uKNjMLgS.js";import{n,t as r}from"./UsageInfo-CiQljEdl.js";import{a as i,i as a,n as o,r as s,s as c,t as l}from"./usage-fixtures-BF7_NYEz.js";var u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{s(),n(),u=t(),d={title:`Usage/UsageInfo`,component:r,args:{breakdown:o.windows.day},decorators:[(e,t)=>t.parameters.inPane?(0,u.jsx)(e,{}):(0,u.jsx)(`div`,{className:`p-6 pt-96`,children:(0,u.jsx)(e,{})})]},f={},p={args:{breakdown:l.windows.day}},m={args:{breakdown:c.windows.day}},h={args:{breakdown:i.windows.day}},g={args:{breakdown:a.windows.day}},_={parameters:{inPane:!0},decorators:[e=>(0,u.jsxs)(`div`,{className:`flex h-screen flex-col`,children:[(0,u.jsx)(`div`,{className:`border-b border-border px-4 py-3 text-sm font-semibold`,children:`Usage › Claude costs and metering`}),(0,u.jsx)(`div`,{className:`min-h-0 flex-1 overflow-y-auto overflow-x-clip`,children:(0,u.jsxs)(`div`,{className:`flex flex-col gap-5 px-4 py-4`,children:[(0,u.jsx)(e,{}),(0,u.jsx)(`div`,{className:`h-[80rem]`})]})})]})]},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    breakdown: bothClis.windows.day
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    breakdown: unpricedModel.windows.day
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    breakdown: outputOnlyBasis.windows.day
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    breakdown: noUsage.windows.day
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v=[`Default`,`BothClis`,`UnpricedModel`,`OutputOnly`,`Empty`,`InAScrolledPane`]})))()}y();export{p as BothClis,f as Default,g as Empty,_ as InAScrolledPane,h as OutputOnly,m as UnpricedModel,v as __namedExportsOrder,d as default};