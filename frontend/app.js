/* ==========================================================================
   ING IRC — Frontier Research Opportunities
   App logic: theme toggle, rendering, filtering, modals, registration form.
   All class strings are Tailwind utilities (Play CDN observes DOM mutations,
   so dynamically-inserted markup is compiled on the fly).
   ========================================================================== */

/* ================= THEME TOGGLE ================= */
const themeBtn = document.getElementById('themeToggle');
function applyThemeLabel(){
  const dark = document.documentElement.dataset.theme === 'dark';
  const label = dark ? 'Switch to light theme' : 'Switch to dark theme';
  themeBtn.setAttribute('aria-label', label);
  themeBtn.setAttribute('title', label);
}
themeBtn.addEventListener('click', () => {
  const root = document.documentElement;
  root.classList.add('theming');
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try{ localStorage.setItem('ingirc-theme', next); }catch(e){}
  applyThemeLabel();
  setTimeout(() => root.classList.remove('theming'), 450);
});
applyThemeLabel();

/* ================= ICONS ================= */
const S = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const ICONS = {
  grid:`<svg viewBox="0 0 24 24" ${S}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
  shield:`<svg viewBox="0 0 24 24" ${S}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"/></svg>`,
  eye:`<svg viewBox="0 0 24 24" ${S}><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="3"/></svg>`,
  scale:`<svg viewBox="0 0 24 24" ${S}><path d="M12 3v18M8 21h8M5 6h14M5 6L2 12a3 3 0 0 0 6 0L5 6M19 6l3 6a3 3 0 0 1-6 0l3-6"/></svg>`,
  layers:`<svg viewBox="0 0 24 24" ${S}><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></svg>`,
  gauge:`<svg viewBox="0 0 24 24" ${S}><path d="M5 19a9 9 0 1 1 14 0"/><path d="M12 13l3.5-3.5"/></svg>`,
  star:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  medal:`<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="8" r="6"/><path d="M8.2 13.9L7 22l5-3 5 3-1.2-8.1"/></svg>`,
  check:`<svg viewBox="0 0 24 24" ${S} stroke-width="2.6"><path d="M20 6L9 17l-5-5"/></svg>`,
  users:`<svg viewBox="0 0 24 24" ${S}><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  mail:`<svg viewBox="0 0 24 24" ${S}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>`,
  linkedin:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>`,
  arrow:`<svg viewBox="0 0 24 24" ${S} stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  calendar:`<svg viewBox="0 0 24 24" ${S}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
  pin:`<svg viewBox="0 0 24 24" ${S}><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>`
};
const SECTOR_ICON = {'AI Safety':'shield','Interpretability':'eye','Governance':'scale','Robustness':'layers','Evaluations':'gauge'};
/* inject size/colour classes into a raw icon */
function ico(name, cls){ return ICONS[name].replace('<svg ', `<svg class="${cls}" `); }

/* ================= DATA ================= */
const P = (id,section,title,sector,status,color,rating,timeline,location,desc,participants)=>({id,section,title,sector,status,color,rating,timeline,location,desc,participants});
const PERSON = (name,role,email,linkedin)=>({name,role,email,linkedin});

/* Squiggle-derived hues (sampled): teal #29B39B · green #61BA4B · lime #A9C93C · yellow #FFD21F · orange #F7941E · coral #E8503A
   Six DIFFERENT gradients — each card gets its own pairing + angle, pastelized for readable navy text. */
const G = {
  lagoon:  'linear-gradient(135deg,#AFE8D6 0%,#A3DE9C 100%)',                    /* teal → green · diagonal   */
  citrus:  'linear-gradient(150deg,#CDE99A 0%,#F4E89F 100%)',                    /* lime → yellow · steep     */
  sunrise: 'linear-gradient(115deg,#FBE9A4 0%,#F7CB9D 100%)',                    /* yellow → orange · shallow */
  ember:   'linear-gradient(160deg,#F9D29E 0%,#F3ACA0 100%)',                    /* orange → coral · steep    */
  meadow:  'radial-gradient(140% 140% at 18% 20%,#C4F0DC 0%,#D6EC9F 100%)',      /* teal → lime · radial      */
  jade:    'linear-gradient(215deg,#9FDCA4 0%,#A8E3CF 100%)'                     /* green → teal · reverse    */
};
const GRADS = [G.lagoon,G.citrus,G.sunrise,G.ember,G.meadow,G.jade];

let projects = [
  /* ---------- ING ---------- */
  P('i1','ing','Societal Resilience to Advanced AI','Governance','Open',G.lagoon,'4.8','Jan – Dec 2025','Amsterdam · Hybrid',
`This initiative brings together policy, safety and operations teams across ING member organisations to map how societies can adapt to increasingly capable AI systems.

Key goals:
• Publish a shared societal-adaptation risk map
• Run cross-organisation tabletop exercises
• Draft practical guidance for public-sector partners`,
[PERSON('Dr. Amara Osei','Lead Policy Researcher','amara.osei@gmail.com','amara-osei'),
 PERSON('Lucas Vermeulen','Governance Analyst','lucas.vermeulen@gmail.com','lvermeulen'),
 PERSON('Priya Nair','Research Manager','priya.nair@gmail.com','priyanair')]),

  P('i2','ing','Red-Teaming Frontier Models at Scale','Evaluations','Open',G.citrus,'4.9','Mar – Sep 2025','London · Remote-friendly',
`A structured red-teaming programme probing frontier models for dangerous capabilities, deceptive behaviour and alignment failures before deployment.

Key goals:
• Build a repeatable adversarial-testing pipeline
• Share sanitised findings across members
• Contribute results to third-party eval efforts`,
[PERSON('Jonas Weber','Red Team Lead','jonas.weber@gmail.com','jweber-sec'),
 PERSON('Mei Tanaka','Adversarial ML Engineer','mei.tanaka@gmail.com','meitanaka'),
 PERSON('Samuel Idowu','Safety Engineer','samuel.idowu@gmail.com','sidowu'),
 PERSON('Elena Petrova','Eval Infrastructure','elena.petrova@gmail.com','e-petrova')]),

  P('i3','ing','Circuit-Level Interpretability of Induction Heads','Interpretability','Completed',G.sunrise,'4.7','Completed · Dec 2024','Remote',
`A deep-dive into the circuits underlying in-context learning, reverse-engineering attention heads and publishing open tooling for the interpretability community.

Outcome: three peer-reviewed papers and an open-source circuit-tracing toolkit adopted by 40+ labs.`,
[PERSON('Dr. Chris Meyer','Principal Scientist','chris.meyer@gmail.com','cmeyer-ai'),
 PERSON('Aisha Rahman','Research Scientist','aisha.rahman@gmail.com','aisharahman')]),

  P('i4','ing','CyberBench: Secure Code Generation Benchmark','Robustness','Completed',G.ember,'4.8','Completed · Nov 2024','Berlin · Remote',
`Developed a benchmark measuring whether code-generation models introduce exploitable vulnerabilities, with automated exploit verification.

Outcome: benchmark released publicly; adopted in two frontier-lab pre-deployment eval suites.`,
[PERSON('Daniel Kovács','Security Lead','daniel.kovacs@gmail.com','dkovacs'),
 PERSON('Hannah Liu','ML Engineer','hannah.liu@gmail.com','hannahliu'),
 PERSON('Tomás Silva','Backend Engineer','tomas.silva@gmail.com','tsilva-dev')]),

  P('i5','ing','AI Safety Curriculum for New Researchers','AI Safety','Open',G.meadow,'4.9','Rolling intake · 2025','Global · Remote',
`A 12-week technical curriculum taking engineers from ML fundamentals to frontier safety research, with mentorship from ING member staff.

Key goals:
• Run 3 cohorts in 2025
• Publish all materials under an open licence
• Place top graduates into member teams`,
[PERSON('Prof. Laura Bennett','Program Director','laura.bennett@gmail.com','lbennett-edu'),
 PERSON('Omar Haddad','Curriculum Designer','omar.haddad@gmail.com','omarhaddad'),
 PERSON('Sofia Rossi','Teaching Fellow','sofia.rossi@gmail.com','sofia-rossi')]),

  P('i6','ing','Multilingual Stress-Testing Suite','Robustness','Open',G.jade,'4.6','Apr – Oct 2025','Remote',
`Extending safety evaluations beyond English to 30+ languages, surfacing differential failure modes across linguistic and cultural contexts.

Key goals:
• Ship a multilingual eval harness
• Publish a cross-lingual red-teaming dataset`,
[PERSON('Kenji Sato','Research Lead','kenji.sato@gmail.com','ksato-nlp'),
 PERSON('Nadia Petrov','Computational Linguist','nadia.petrov@gmail.com','nadiapetrov'),
 PERSON('David Okafor','ML Engineer','david.okafor@gmail.com','dokafor')]),

  /* ---------- GLOBAL ---------- */
  P('g1','global','Frontier Safety Frameworks: Shared Practices','AI Safety','Open',G.meadow,'4.9','Feb – Nov 2025','Global · Remote',
`Convening safety teams from multiple frontier labs to identify common elements of responsible scaling policies and agree on shared evaluation practices.

Key goals:
• Draft a common capability-threshold vocabulary
• Publish a joint practices whitepaper
• Establish cross-lab incident sharing norms`,
[PERSON('Dr. Ingrid Solberg','Initiative Lead','ingrid.solberg@gmail.com','isolberg'),
 PERSON('Marcus Chen','Safety Researcher','marcus.chen@gmail.com','mchen-safe'),
 PERSON('Fatima Al-Sayed','Policy Liaison','fatima.alsayed@gmail.com','fatima-als')]),

  P('g2','global','Open Evals Library for Catastrophic Risks','Evaluations','Completed',G.citrus,'4.8','Completed · Jan 2025','Remote',
`Built an open-source library of standardised evaluations for biosecurity, cyber-offence and autonomous-replication risks, usable by any lab or auditor.

Outcome: 60+ evals published, 2.1k GitHub stars, integrated into three external audit regimes.`,
[PERSON('Alex Turner','Maintainer','alex.turner@gmail.com','turnerml'),
 PERSON('Grace Kim','Research Engineer','grace.kim@gmail.com','gracekim-ai'),
 PERSON('Ravi Patel','Infrastructure Engineer','ravi.patel@gmail.com','ravipatel-dev')]),

  P('g3','global','Global AI Governance Policy Toolkit','Governance','Open',G.lagoon,'4.7','Mar – Dec 2025','Brussels · Remote',
`Producing practical, jurisdiction-aware policy toolkits that help regulators implement frontier-model oversight, including compute thresholds and audit standards.

Key goals:
• Release toolkit v1 for EU, US and UK contexts
• Host three multi-stakeholder workshops`,
[PERSON('Claire Dubois','Lead Author','claire.dubois@gmail.com','cdubois'),
 PERSON('Henrik Olsen','Legal Researcher','henrik.olsen@gmail.com','henrikolsen'),
 PERSON('Yuki Mori','Project Coordinator','yuki.mori@gmail.com','yukimori')]),

  P('g4','global','Watermarking & Provenance for Generated Media','Robustness','Completed',G.jade,'4.6','Completed · Oct 2024','Remote',
`Evaluated the robustness of watermarking schemes for AI-generated content against removal and forgery attacks, and drafted deployment recommendations for platforms.

Outcome: technical report and open attack-suite released; recommendations adopted by two platform partners.`,
[PERSON('Stefan Brandt','Technical Lead','stefan.brandt@gmail.com','sbrandt'),
 PERSON('Olivia Grant','Research Scientist','olivia.grant@gmail.com','ogrant')]),

  P('g5','global','Mechanistic Interpretability Fellowship','Interpretability','Open',G.sunrise,'5.0','Jun – Dec 2025','Global · Remote',
`A funded fellowship pairing early-career researchers with senior mentors to reverse-engineer behaviours in frontier models, culminating in an open research showcase.

Key goals:
• Support 10 funded fellows
• Publish all research openly
• Build a durable mentor network`,
[PERSON('Dr. Nathan Cole','Fellowship Director','nathan.cole@gmail.com','ncole-interp'),
 PERSON('Emma Lindqvist','Mentor / Scientist','emma.lindqvist@gmail.com','emmalindq'),
 PERSON('Arjun Mehta','Program Manager','arjun.mehta@gmail.com','arjunmehta')]),

  P('g6','global','Joint AI Incident Response Network','AI Safety','Open',G.ember,'4.8','Ongoing since 2025','Global · On-call',
`Establishing a shared protocol and on-call network for coordinating responses to serious AI incidents across member organisations and governments.

Key goals:
• Draft joint incident taxonomy & playbooks
• Run quarterly cross-org response drills`,
[PERSON('Rosa Delgado','Network Coordinator','rosa.delgado@gmail.com','rdelgado'),
 PERSON('Peter Novak','Operations Lead','peter.novak@gmail.com','pnovak-ops'),
 PERSON('Leila Hassan','Communications Lead','leila.hassan@gmail.com','leilahassan')])
];

const SECTORS = ['All','AI Safety','Interpretability','Governance','Robustness','Evaluations'];
let gradIdx = 0;
const state = {q:'', sector:'All', status:'All'};

/* ================= HELPERS ================= */
const $ = s => document.querySelector(s);
const AV_COLORS = ['#1A5D8F','#2D7EB5','#2FA79F','#935C8C','#E42A2D','#F7941E','#8DC63F'];
function avatarColor(name){let h=0;for(const c of name)h=(h*31+c.charCodeAt(0))%997;return AV_COLORS[h%AV_COLORS.length];}
function initials(name){return name.split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase();}
function liURL(u){const s=String(u).trim();return /^https?:\/\//i.test(s)?s:'https://www.linkedin.com/in/'+s.replace(/\/$/,'');}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function updateOpenCount(){const open=projects.filter(p=>p.status==='Open').length;$('#openNow').textContent=open;}

/* ================= RENDER ================= */
const PILL = 'inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[rgba(18,57,92,.18)] bg-white px-3 py-1.5 text-[12.5px] font-extrabold text-contrast';
function statusPill(p){
  return p.status==='Open'
    ? `<span class="${PILL}"><i class="inline-block h-2 w-2 rounded-full bg-[#E42A2D]"></i>Open</span>`
    : `<span class="${PILL}">${ico('check','h-[13px] w-[13px] text-tealc')}Completed</span>`;
}
function avatarsStack(p){
  const BASE='flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-2 border-white text-[10.5px] font-extrabold text-white first:ml-0 -ml-[9px]';
  return p.participants.slice(0,3).map(pt=>`<span class="avatar ${BASE}" style="background:${avatarColor(pt.name)}" title="${esc(pt.name)}">${initials(pt.name)}</span>`).join('')
    + (p.participants.length>3?`<span class="avatar ${BASE} bg-contrast">+${p.participants.length-3}</span>`:'');
}
function cardHTML(p,i){
  const top = parseFloat(p.rating) >= 4.9
    ? `<span class="${PILL}">${ico('medal','h-[13px] w-[13px] text-tang')}Top rated</span>` : '';
  return `<article class="card group relative flex min-h-[212px] flex-col justify-between rounded-[22px] border-2 border-contrast p-5 text-left transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--pop)] focus-visible:outline-crimson focus-visible:outline-offset-[3px] focus-visible:outline-[3px] animate-[cardIn_.5s_cubic-bezier(.2,.7,.3,1)_backwards]" tabindex="0" role="button" data-id="${p.id}" style="background:${p.color};animation-delay:${(i%8)*55}ms" aria-label="Open project: ${esc(p.title)}">
    <div class="flex flex-wrap items-start justify-between gap-2">
      <span class="${PILL}">${ico(SECTOR_ICON[p.sector],'h-[13px] w-[13px]')}${esc(p.sector)}</span>
      <span class="flex flex-wrap justify-end gap-1.5">${statusPill(p)}${top}</span>
    </div>
    <h3 class="my-3.5 font-manrope text-[20px] leading-[1.28] font-extrabold tracking-[-.2px] text-contrast">${esc(p.title)}</h3>
    <div class="flex items-center gap-2">
      <div class="flex">${avatarsStack(p)}</div>
      <span class="whitespace-nowrap text-[13px] font-bold text-[#2E4B66]">${p.participants.length} participant${p.participants.length===1?'':'s'}</span>
      <span class="flex-1"></span>
      <span class="${PILL}">${ico('star','h-[13px] w-[13px] text-[#E8A13D]')}${esc(p.rating)}</span>
      <span class="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-contrast text-white transition-all duration-200 group-hover:translate-x-1 group-hover:bg-crimson">${ico('arrow','h-4 w-4')}</span>
    </div>
  </article>`;
}
function getFiltered(section){
  return projects.filter(p=>p.section===section
    && (state.sector==='All'||p.sector===state.sector)
    && (state.status==='All'||p.status===state.status)
    && (!state.q || (p.title+' '+p.desc+' '+p.sector).toLowerCase().includes(state.q)));
}
function render(){
  [['ing','#grid-ing','#empty-ing','#count-ing'],['global','#grid-global','#empty-global','#count-global']].forEach(([sec,grid,empty,count])=>{
    const list=getFiltered(sec);
    $(grid).innerHTML=list.map(cardHTML).join('');
    $(empty).style.display=list.length?'none':'block';
    $(count).textContent=`${list.length} project${list.length===1?'':'s'}`;
  });
}

/* sector chips + status segment (rebuilt so active utilities stay in sync) */
function renderChips(){
  $('#sectorChips').innerHTML = SECTORS.map(s=>{
    const active = s===state.sector;
    return `<button class="chip inline-flex items-center gap-[9px] rounded-full border-2 py-[5px] pr-[17px] pl-1.5 text-[13.5px] font-extrabold transition-colors ${active?'border-contrast bg-sun text-contrast':'border-line bg-surface text-ink hover:border-link'}" data-sector="${s}">
      <span class="ic grid h-[30px] w-[30px] place-items-center rounded-full transition-colors ${active?'bg-contrast text-white':'bg-page2 text-link'}">${ico(s==='All'?'grid':SECTOR_ICON[s],'h-[14px] w-[14px]')}</span>${s}</button>`;
  }).join('');
}
function renderSeg(){
  $('#statusSeg').innerHTML = ['All','Open','Completed'].map(s=>
    `<button class="cursor-pointer rounded-full px-[17px] py-2 text-[13.5px] font-extrabold transition-colors ${s===state.status?'bg-segactive text-segactivetext':'bg-transparent text-muted'}" data-status="${s}">${s}</button>`).join('');
}
$('#sectorChips').addEventListener('click',e=>{
  const b=e.target.closest('.chip'); if(!b)return;
  state.sector=b.dataset.sector;
  renderChips(); render();
});
$('#statusSeg').addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b)return;
  state.status=b.dataset.status;
  renderSeg(); render();
});
$('#searchInput').addEventListener('input',e=>{state.q=e.target.value.trim().toLowerCase();render();});

/* ================= PROJECT MODAL ================= */
const CHIP_LINK='inline-flex items-center gap-1.5 rounded-full border-2 border-line bg-surface px-3.5 py-2 text-[12.5px] font-extrabold text-ink transition-colors hover:border-link hover:bg-surfacehover hover:text-link';
function openProject(id){
  const p=projects.find(x=>x.id===id); if(!p)return;
  $('#pmBanner').style.background=p.color;
  $('#pmTitle').textContent=p.title;
  $('#pmTitle').style.color='var(--contrast)';
  $('#pmPills').innerHTML=`<span class="${PILL}">${ico(SECTOR_ICON[p.sector],'h-[13px] w-[13px]')}${esc(p.sector)}</span>${statusPill(p)}<span class="${PILL}">${ico('star','h-[13px] w-[13px] text-[#E8A13D]')}${esc(p.rating)}</span>`;
  $('#pmMeta').innerHTML=`<span class="inline-flex items-center gap-2 rounded-full border-2 border-line bg-page2 px-3.5 py-2 text-[13px] font-bold text-ink">${ico('calendar','h-[14px] w-[14px] text-azure')}${esc(p.timeline||'Timeline TBC')}</span>
    <span class="inline-flex items-center gap-2 rounded-full border-2 border-line bg-page2 px-3.5 py-2 text-[13px] font-bold text-ink">${ico('pin','h-[14px] w-[14px] text-azure')}${esc(p.location||'Location TBC')}</span>
    <span class="inline-flex items-center gap-2 rounded-full border-2 border-line bg-page2 px-3.5 py-2 text-[13px] font-bold text-ink">${ico('users','h-[14px] w-[14px] text-azure')}${p.participants.length} participants</span>`;
  $('#pmDesc').textContent=p.desc;
  $('#pmTeamLabel').textContent=p.status==='Open'?'Participants & contact info':'Project team & contact info';
  $('#pmParticipants').innerHTML=p.participants.map(pt=>{
    const links=[
      pt.email?`<a class="${CHIP_LINK}" href="mailto:${esc(pt.email)}">${ico('mail','h-[13px] w-[13px]')}Gmail</a>`:'',
      pt.linkedin?`<a class="${CHIP_LINK}" href="${liURL(pt.linkedin)}" target="_blank" rel="noopener">${ico('linkedin','h-[13px] w-[13px]')}LinkedIn</a>`:''
    ].join('');
    return `<li class="mb-2.5 flex flex-wrap items-center gap-3.5 rounded-[18px] border-2 border-line bg-page2 px-[15px] py-[13px]">
      <span class="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white text-sm font-extrabold text-white" style="background:${avatarColor(pt.name)}">${initials(pt.name)}</span>
      <div class="min-w-[170px] flex-1"><strong class="block text-[15px] text-ink">${esc(pt.name)}</strong><span class="text-[13px] text-muted">${esc(pt.role||'Contributor')}</span></div>
      <div class="flex flex-wrap gap-2">${links}</div></li>`;
  }).join('');
  const first=p.participants.find(pt=>pt.email);
  $('#pmContact').style.display=first?'inline-flex':'none';
  if(first){
    $('#pmContact').href=`mailto:${esc(first.email)}?subject=${encodeURIComponent('Interest in project: '+p.title+' (via ING IRC)')}`;
    $('#pmContactLabel').textContent=p.status==='Open'?'Express interest via email':'Contact the project team';
  }
  openModal('#projectModal');
}

['#grid-ing','#grid-global'].forEach(g=>{
  $(g).addEventListener('click',e=>{const c=e.target.closest('.card');if(c)openProject(c.dataset.id);});
  $(g).addEventListener('keydown',e=>{
    const c=e.target.closest('.card');
    if(c&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openProject(c.dataset.id);}
  });
});

/* ================= REGISTER ================= */
function addPersonRow(prefill={}){
  const row=document.createElement('div');
  row.className='person-row mb-2 grid grid-cols-[1.1fr_1.25fr_1fr_auto] gap-2 max-[720px]:grid-cols-1';
  const IN='min-w-0 rounded-[14px] border-2 border-line bg-surface px-3 py-2.5 text-[13.5px] text-ink transition-colors focus:border-focusc focus:outline-none placeholder:text-muted2';
  row.innerHTML=`<input data-f="name" type="text" class="${IN}" placeholder="Full name *" value="${esc(prefill.name||'')}">
    <input data-f="email" type="text" class="${IN}" placeholder="Gmail address" value="${esc(prefill.email||'')}">
    <input data-f="linkedin" type="text" class="${IN}" placeholder="LinkedIn profile URL" value="${esc(prefill.linkedin||'')}">
    <button type="button" class="remove-btn w-[42px] cursor-pointer rounded-[14px] border-2 border-[#F3B9B9] bg-[#FBE3E3] text-[17px] font-extrabold text-[#E42A2D] transition-colors hover:border-[#E42A2D] hover:bg-[#E42A2D] hover:text-white max-[720px]:w-full" title="Remove participant" onclick="this.parentElement.remove()">×</button>`;
  $('#rf-people').appendChild(row);
}
function resetRegisterForm(){
  $('#registerForm').reset();
  $('#rf-people').innerHTML='';
  addPersonRow();
  $('#rf-error').classList.add('hidden');
}
function openRegister(){resetRegisterForm();openModal('#registerModal');}

$('#registerForm').addEventListener('submit',e=>{
  e.preventDefault();
  const title=$('#rf-title').value.trim();
  const desc=$('#rf-desc').value.trim();
  const people=[...document.querySelectorAll('#rf-people .person-row')]
    .map(r=>({name:r.querySelector('[data-f=name]').value.trim(),
              email:r.querySelector('[data-f=email]').value.trim(),
              linkedin:r.querySelector('[data-f=linkedin]').value.trim()}))
    .filter(p=>p.name);
  const err=$('#rf-error');
  if(!title||!desc||!people.length){
    err.textContent='Please fill in the project title, description and at least one participant name.';
    err.classList.remove('hidden');return;
  }
  err.classList.add('hidden');
  const p={
    id:'u'+Date.now(),
    section:$('#rf-section').value,
    title,sector:$('#rf-sector').value,status:$('#rf-status').value,
    color:GRADS[gradIdx++%GRADS.length],
    rating:$('#rf-rating').value.trim()||'New',
    timeline:$('#rf-timeline').value.trim()||'TBC',
    location:$('#rf-location').value.trim()||'TBC',
    desc,participants:people
  };
  projects.unshift(p);
  state.q='';state.sector='All';state.status='All';
  $('#searchInput').value='';
  renderChips(); renderSeg(); render(); updateOpenCount();
  closeModals();
  const sectionName=p.section==='ing'?'ING Opportunities':'Global Opportunities';
  toast(`✅ “${p.title}” registered — now live in ${sectionName}.`);
  document.getElementById(p.section==='ing'?'section-ing':'section-global').scrollIntoView({behavior:'smooth'});
});

/* ================= MODAL PLUMBING ================= */
function openModal(sel){
  const b=$(sel);
  b.classList.remove('opacity-0','pointer-events-none');
  b.classList.add('show','opacity-100','pointer-events-auto');
  b.querySelector('.modal').classList.remove('translate-y-[18px]');
  document.body.classList.add('overflow-hidden');
  const f=$(sel).querySelector('input,button'); if(f)setTimeout(()=>f.focus(),120);
}
function closeModals(){
  document.querySelectorAll('.modal-backdrop.show').forEach(b=>{
    b.classList.remove('show','opacity-100','pointer-events-auto');
    b.classList.add('opacity-0','pointer-events-none');
    b.querySelector('.modal').classList.add('translate-y-[18px]');
  });
  document.body.classList.remove('overflow-hidden');
}
document.querySelectorAll('.modal-backdrop').forEach(b=>{
  b.addEventListener('click',e=>{if(e.target===b||e.target.closest('[data-close]'))closeModals();});
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModals();});

/* ================= TOAST ================= */
function toast(msg){
  const t=$('#toast');
  t.textContent=msg;
  t.classList.remove('translate-y-[90px]','opacity-0');
  t.classList.add('translate-y-0','opacity-100');
  clearTimeout(t._tm);
  t._tm=setTimeout(()=>{
    t.classList.remove('translate-y-0','opacity-100');
    t.classList.add('translate-y-[90px]','opacity-0');
  },3200);
}

/* ================= COUNT-UP STATS ================= */
function countUp(el){
  const target=+el.dataset.count, dur=1100, t0=performance.now();
  (function tick(t){
    const k=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-k,3);
    el.textContent=Math.round(target*e);
    if(k<1)requestAnimationFrame(tick);
  })(t0);
}
document.querySelectorAll('[data-count]').forEach(el=>{
  new IntersectionObserver((es,io)=>{if(es[0].isIntersecting){countUp(el);io.disconnect();}},{threshold:.4}).observe(el);
});

/* init */
addPersonRow();
renderChips();
renderSeg();
render();
updateOpenCount();
