import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-Dd6_REk5.js";import{n,t as r}from"./PerfOverlay-9DFPp53B.js";var i,a,o,s,c;function l(){return(l=e((()=>{i=177e10,a=({phase:e,ms:t,depth:n=0,files:r=0,directories:i=0,bytes:a=0,ioMs:o=0})=>({phase:e,ms:t,depth:n,files:r,directories:i,bytes:a,ioMs:o}),o=({path:e,ms:t,bytes:n,kind:r=`file`})=>({path:e,ms:t,bytes:n,kind:r,phase:`usage`}),s={openedAt:i,running:[],phases:[a({phase:`activate`,ms:11}),a({phase:`snapshot`,ms:42,files:47,directories:22,bytes:486e3,ioMs:31}),a({phase:`skills`,ms:38,depth:1,files:38,directories:9,bytes:402e3,ioMs:26}),a({phase:`system-prompt`,ms:24,depth:1,files:6,directories:12,bytes:74e3,ioMs:4}),a({phase:`memory`,ms:6,depth:1,files:3,directories:1,bytes:1e4,ioMs:1}),a({phase:`agents`,ms:19,files:8,directories:4,bytes:512e3,ioMs:16}),a({phase:`usage`,ms:1430,files:112,directories:9,bytes:419e5,ioMs:1290})],files:167,directories:35,bytes:42898e3,ioMs:1337,slowest:[o({path:`/Users/dev/.claude/projects/-Users-dev-repos-app/9e759067.jsonl`,ms:84,bytes:84e5}),o({path:`/Users/dev/.claude/projects/-Users-dev-repos-app/1a2b3c4d.jsonl`,ms:61,bytes:51e5}),o({path:`/Users/dev/.copilot/session-store.db`,ms:19,bytes:0,kind:`db`}),o({path:`/Users/dev/repos/claude-viewer/CLAUDE.md`,ms:7,bytes:41e3}),o({path:`/Users/dev/.claude/skills/dev-feature/SKILL.md`,ms:3,bytes:3800})]},c={...s,phases:[a({phase:`activate`,ms:34}),a({phase:`snapshot`,ms:2910,files:61,directories:941,bytes:69e4,ioMs:2740}),a({phase:`skills`,ms:44,depth:1,files:38,directories:9,bytes:402e3,ioMs:29}),a({phase:`system-prompt`,ms:2880,depth:1,files:20,directories:931,bytes:278e3,ioMs:2710}),a({phase:`memory`,ms:9,depth:1,files:3,directories:1,bytes:1e4,ioMs:2}),a({phase:`agents`,ms:26,files:8,directories:4,bytes:512e3,ioMs:21}),a({phase:`usage`,ms:4100,files:260,directories:14,bytes:92e6,ioMs:3880})],files:329,directories:959,bytes:93202e3,ioMs:6641,slowest:[o({path:`/Users/dev/repos/monorepo/node_modules`,ms:412,bytes:0,kind:`dir`}),o({path:`/Users/dev/.claude/projects/-Users-dev-repos-monorepo/aa11bb22.jsonl`,ms:221,bytes:24e6}),o({path:`/Users/dev/repos/monorepo/packages`,ms:96,bytes:0,kind:`dir`}),o({path:`/Users/dev/.copilot/session-store.db`,ms:44,bytes:0,kind:`db`}),o({path:`/Users/dev/repos/monorepo/apps/web/CLAUDE.md`,ms:12,bytes:22e3})]}})))()}var u,d,f,p,m,h,g,_,v,y;function b(){return(b=e((()=>{n(),l(),u=t(),d={title:`Perf/PerfOverlay`,component:r,args:{report:s,marks:{readyAt:s.openedAt+90,paintedAt:s.openedAt+214},workspaceRoot:`/Users/dev/repos/claude-viewer`,onDismiss:()=>{}},decorators:[e=>(0,u.jsxs)(`div`,{className:`relative h-screen w-full bg-background p-6`,children:[(0,u.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`The landing page goes here.`}),(0,u.jsx)(e,{})]})]},f={},p=({canvasElement:e})=>{e.querySelector(`[aria-expanded]`)?.click()},m={play:p},h={args:{report:c,marks:{readyAt:c.openedAt+140,paintedAt:c.openedAt+3180}},play:p},g={args:{report:{...s,running:[`snapshot`,`skills`,`system-prompt`,`usage`],phases:s.phases.filter(e=>![`snapshot`,`skills`,`system-prompt`,`usage`].includes(e.phase))}},play:p},_={args:{report:{...s,running:[`usage`],phases:s.phases.filter(e=>e.phase!==`usage`)}},play:p},v={args:{report:{...s,files:0,directories:0,bytes:0,ioMs:0,slowest:[],phases:s.phases.map(e=>({...e,files:0,directories:0,bytes:0,ioMs:0}))}},play:p},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{}`,...f.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  play: openCard
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    report: slowLaunch,
    marks: {
      readyAt: slowLaunch.openedAt + 140,
      paintedAt: slowLaunch.openedAt + 3_180
    }
  },
  play: openCard
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    report: {
      ...fastLaunch,
      running: ['snapshot', 'skills', 'system-prompt', 'usage'],
      phases: fastLaunch.phases.filter(phase => !['snapshot', 'skills', 'system-prompt', 'usage'].includes(phase.phase))
    } satisfies PerfReport
  },
  play: openCard
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    report: {
      ...fastLaunch,
      running: ['usage'],
      phases: fastLaunch.phases.filter(phase => phase.phase !== 'usage')
    } satisfies PerfReport
  },
  play: openCard
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    report: {
      ...fastLaunch,
      files: 0,
      directories: 0,
      bytes: 0,
      ioMs: 0,
      slowest: [],
      phases: fastLaunch.phases.map(phase => ({
        ...phase,
        files: 0,
        directories: 0,
        bytes: 0,
        ioMs: 0
      }))
    } satisfies PerfReport
  },
  play: openCard
}`,...v.parameters?.docs?.source}}},y=[`Collapsed`,`Expanded`,`SlowLaunch`,`StillReading`,`StillScanning`,`NothingRead`]})))()}b();export{f as Collapsed,m as Expanded,v as NothingRead,h as SlowLaunch,g as StillReading,_ as StillScanning,y as __namedExportsOrder,d as default};