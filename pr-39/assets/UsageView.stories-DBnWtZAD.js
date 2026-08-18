import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{K as t,T as n,U as r,W as i,g as a,n as o,q as s}from"./iframe-berQDH65.js";import{n as c,t as l}from"./SettingsContext-D7Q3blc_.js";import{a as u,i as d,n as f,o as p,r as m,t as h}from"./UsageView-BeieX2-x.js";var g;function _(){return(_=e((()=>{d(),s(),p(),Math.max(...Object.values(u)),g=({turns:e,now:n,scope:r,workspaceRoot:i})=>{let a={};for(let o of t)a[o]=m({turns:e,window:o,now:n,scope:r,workspaceRoot:i});return{windows:a,scannedAt:n}}})))()}var v,y,b,x,S,C,w,T,E,D,O,k;function A(){return(A=e((()=>{_(),a(),v=e=>Date.now()-e,y=6e4,b=0,x=({minutesAgo:e,skill:t,output:n,tool:r=`claude`,model:i,nanoAiu:a})=>(b+=1,{id:`req_${b}`,at:v(e*y),tool:r,sessionId:r===`claude`?`a1b2c3d4`:`f7be248b`,cwd:`/Users/dev/repos/example-app`,...t?{skill:t}:{},source:r===`claude`?`read`:`inferred`,model:i??(r===`claude`?`claude-opus-5`:`claude-haiku-4.5`),tokens:{input:12,output:n,cacheRead:n*30,cacheWrite5m:0,cacheWrite1h:n*8},...a===void 0?{}:{nanoAiu:a}}),S=e=>g({turns:e,now:Date.now(),scope:`all`,workspaceRoot:void 0}),C=S([x({minutesAgo:20,skill:`dev-feature`,output:4820}),x({minutesAgo:55,skill:`dev-feature`,output:3140}),x({minutesAgo:90,skill:`create-pr`,output:1260}),x({minutesAgo:140,skill:`post-mortem`,output:640}),x({minutesAgo:200,output:5910}),x({minutesAgo:320,output:2450}),x({minutesAgo:1800,skill:`dev-feature`,output:6300}),x({minutesAgo:3e3,skill:`track`,output:880})]),w=S([x({minutesAgo:15,skill:`dev-feature`,output:3400}),x({minutesAgo:45,skill:`dev-feature`,output:2100}),x({minutesAgo:25,output:4800}),x({minutesAgo:12,skill:`dev-feature`,output:1180,tool:`copilot`,nanoAiu:86e8}),x({minutesAgo:18,skill:`dev-feature`,output:940,tool:`copilot`,nanoAiu:62e8}),x({minutesAgo:35,output:610,tool:`copilot`,model:`gpt-5-mini`,nanoAiu:11e8})]),T=S([x({minutesAgo:30,skill:`dev-feature`,output:2600}),x({minutesAgo:60,output:1900,model:`claude-opus-6`})]),E=S([x({minutesAgo:4320,skill:`dev-feature`,output:5400}),x({minutesAgo:5760,output:3100})]),D=S([]),S([x({minutesAgo:10,skill:`publish`,output:2200}),x({minutesAgo:20,skill:`publish`,output:1800})]),O={"dev-feature":`Full feature development cycle — plan, implement, PR, release the worktree.`,"create-pr":`Branch, commit, push, and open a pull request for the current work.`,"post-mortem":`Reflect on the session and write what was learned back into the docs.`,publish:`Ship a new version — preflight, changelog, then publish.`},k=Object.entries(O).map(([e,t])=>({...n,name:e,description:t,scope:`user`,path:`/Users/dev/.claude/skills/${e}/SKILL.md`}))})))()}var j,M,N,P,F,I,L,R,z,B,V,H;function U(){return(U=e((()=>{i(),c(),A(),f(),j=o(),M=({metric:e,scope:t,children:n})=>{let i={...r,usage:{metric:{value:e??`output-tokens`,source:e?`user`:`default`},scope:{value:t??`all`,source:t?`user`:`default`}}};return(0,j.jsx)(l,{settings:i,children:n})},N={title:`Usage/UsageView`,component:h,args:{report:C,skills:k,onOpenSkill:()=>void 0,onSearch:()=>void 0,onRefresh:()=>void 0,onBack:()=>void 0},decorators:[e=>(0,j.jsx)(`div`,{className:`h-screen`,children:(0,j.jsx)(e,{})})]},P={},F={args:{initialWindow:`week`}},I={args:{report:w},render:e=>(0,j.jsx)(M,{metric:`cost`,children:(0,j.jsx)(h,{...e})})},L={args:{report:w}},R={args:{report:T},render:e=>(0,j.jsx)(M,{metric:`cost`,children:(0,j.jsx)(h,{...e})})},z={args:{report:E}},B={args:{report:D}},V={args:{report:void 0}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    initialWindow: 'week'
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    report: bothClis
  },
  render: args => <WithSettings metric="cost">
      <UsageView {...args} />
    </WithSettings>
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    report: bothClis
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    report: unpricedModel
  },
  render: args => <WithSettings metric="cost">
      <UsageView {...args} />
    </WithSettings>
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    report: quietDay
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    report: noUsage
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    report: undefined
  }
}`,...V.parameters?.docs?.source}}},H=[`Day`,`Week`,`Cost`,`BothClis`,`UnpricedModel`,`QuietDay`,`Empty`,`Scanning`]})))()}U();export{L as BothClis,I as Cost,P as Day,B as Empty,z as QuietDay,V as Scanning,R as UnpricedModel,F as Week,H as __namedExportsOrder,N as default};