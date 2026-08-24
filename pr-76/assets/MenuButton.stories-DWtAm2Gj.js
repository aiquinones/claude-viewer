import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t}from"./iframe-Cp_n6Thu.js";import{n,t as r}from"./MenuButton-0kQT5BaU.js";var i,a,o,s,c;function l(){return(l=e((()=>{n(),i=t(),a={title:`Chrome/MenuButton`,component:r,decorators:[e=>(0,i.jsx)(`div`,{className:`flex h-[24rem] justify-end p-6`,children:(0,i.jsx)(e,{})})]},o={render:()=>(0,i.jsx)(r,{label:`Example options`,children:e=>(0,i.jsx)(`div`,{className:`flex flex-col gap-1 py-1.5 first:pt-0 last:pb-0`,children:[`First`,`Second`,`Third`].map(t=>(0,i.jsx)(`button`,{type:`button`,onClick:e,className:`cursor-pointer rounded px-1.5 py-1 text-left transition-colors hover:bg-accent`,children:t},t))})})},s={render:()=>(0,i.jsx)(r,{label:`Example options`,children:()=>(0,i.jsx)(`p`,{className:`px-1.5 py-1 text-muted-foreground`,children:`A menu wide enough to reach the cap, so the box wraps its own contents instead of running off the edge of a narrow panel.`})})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <MenuButton label="Example options">
      {close => <div className="flex flex-col gap-1 py-1.5 first:pt-0 last:pb-0">
          {['First', 'Second', 'Third'].map(item => <button key={item} type="button" onClick={close} className="cursor-pointer rounded px-1.5 py-1 text-left transition-colors hover:bg-accent">
              {item}
            </button>)}
        </div>}
    </MenuButton>
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <MenuButton label="Example options">
      {() => <p className="px-1.5 py-1 text-muted-foreground">
          A menu wide enough to reach the cap, so the box wraps its own contents instead of running
          off the edge of a narrow panel.
        </p>}
    </MenuButton>
}`,...s.parameters?.docs?.source}}},c=[`Default`,`LongContent`]})))()}l();export{o as Default,s as LongContent,c as __namedExportsOrder,a as default};