import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{C as t,T as n,a as r,g as i,it as a,n as o,y as s}from"./iframe-D89RGHuj.js";import{n as c,t as l}from"./SkillList-NJIZ-VBF.js";var u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{u=a(),c(),i(),d=o(),f={title:`Skills/SkillList`,component:l,args:{onSelect:()=>void 0},decorators:[e=>(0,d.jsx)(`div`,{className:`w-80 py-3`,children:(0,d.jsx)(e,{})})]},p={args:{skills:r,selectedPath:n.path}},m={args:{skills:r.filter(e=>e.scope!==`project`),selectedPath:t.path}},h={args:{skills:[t],selectedPath:t.path}},g={args:{skills:r,selectedPath:void 0}},_={render:()=>{let[e,t]=(0,u.useState)(void 0);return(0,d.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,d.jsx)(`button`,{type:`button`,className:`rounded-md border border-border px-3 py-1 text-xs`,onClick:()=>t(e=>({path:s.path,nonce:(e?.nonce??0)+1})),children:`Reveal a plugin skill`}),(0,d.jsx)(l,{skills:r,selectedPath:e?.path,reveal:e,onSelect:()=>void 0})]})}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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