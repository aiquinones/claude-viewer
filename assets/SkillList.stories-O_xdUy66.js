import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{E as t,O as n,S as r,a as i,g as a,kt as o,n as s}from"./iframe-DOxfzwF-.js";import{n as c,t as l}from"./SkillList-C334QDie.js";var u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{u=o(),c(),a(),d=s(),f={title:`Skills/SkillList`,component:l,args:{onSelect:()=>void 0},decorators:[e=>(0,d.jsx)(`div`,{className:`w-80 py-3`,children:(0,d.jsx)(e,{})})]},p={args:{skills:i,selectedPath:n.path}},m={args:{skills:i.filter(e=>e.scope!==`project`),selectedPath:t.path}},h={args:{skills:[t],selectedPath:t.path}},g={args:{skills:i,selectedPath:void 0}},_={render:()=>{let[e,t]=(0,u.useState)(void 0);return(0,d.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,d.jsx)(`button`,{type:`button`,className:`rounded-md border border-border px-3 py-1 text-xs`,onClick:()=>t(e=>({path:r.path,nonce:(e?.nonce??0)+1})),children:`Reveal a plugin skill`}),(0,d.jsx)(l,{skills:i,selectedPath:e?.path,reveal:e,onSelect:()=>void 0})]})}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    skills: allSkills,
    selectedPath: projectDeploy.path
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    skills: allSkills.filter(skill => skill.scope !== 'project'),
    selectedPath: plainSkill.path
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    skills: [plainSkill],
    selectedPath: plainSkill.path
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    skills: allSkills,
    selectedPath: undefined
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [reveal, setReveal] = useState<Reveal | undefined>(undefined);
    return <div className="flex flex-col gap-3">
        <button type="button" className="rounded-md border border-border px-3 py-1 text-xs" onClick={() => setReveal(previous => ({
        path: nameMismatch.path,
        nonce: (previous?.nonce ?? 0) + 1
      }))}>
          Reveal a plugin skill
        </button>
        <SkillList skills={allSkills} selectedPath={reveal?.path} reveal={reveal} onSelect={() => undefined} />
      </div>;
  }
}`,..._.parameters?.docs?.source}}},v=[`AllScopes`,`NoProjectScope`,`SingleScope`,`NothingSelected`,`RevealIntoCollapsedGroup`]})))()}y();export{p as AllScopes,m as NoProjectScope,g as NothingSelected,_ as RevealIntoCollapsedGroup,h as SingleScope,v as __namedExportsOrder,f as default};