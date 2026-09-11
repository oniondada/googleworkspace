const users=document.querySelector('#users');
const userCountLabel=document.querySelector('#userCountLabel');
const recommendedPlan=document.querySelector('#recommendedPlan');
const recReason=document.querySelector('#recReason');
const monthly=document.querySelector('#monthly');
let selected={mail:'Gmail',migration:'需要'};

function recommend(){
  const n=Number(users.value);
  userCountLabel.textContent=`${n} 人`;
  let plan='Business Standard',price=14,reason='適合成長型企業：2 TB 儲存、Gemini、Meet 錄影與完整協作能力。';
  if(n<=10){plan='Business Starter';price=7;reason='適合小型團隊：先建立企業 Email、雲端協作與基本管理。';}
  else if(n>100){plan='Business Plus';price=22;reason='較大型團隊可優先評估 Plus：更大的儲存空間、Vault 與進階管理能力。';}
  if(selected.migration==='需要') reason+=' 谷谷資訊可協助評估 Email / Drive 資料搬遷。';
  recommendedPlan.textContent=plan;
  recReason.textContent=reason;
  monthly.textContent=`$${(n*price).toLocaleString()}`;
  const form=document.querySelector('#leadForm');
  if(form){
    let hidden=form.querySelector('[name="calculator_result"]');
    if(!hidden){hidden=document.createElement('input');hidden.type='hidden';hidden.name='calculator_result';form.appendChild(hidden);}
    hidden.value=`${n} 人｜${plan}｜目前：${selected.mail}｜搬遷：${selected.migration}｜估算 USD ${n*price}/月`;
  }
}

users.addEventListener('input',recommend);
document.querySelectorAll('.choice-row').forEach(row=>{
  const group=row.dataset.group;
  row.querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>{
    row.querySelectorAll('.choice').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    if(group==='mail') selected.mail=btn.dataset.value||btn.textContent.trim();
    if(group==='migration') selected.migration=btn.dataset.value||btn.textContent.trim();
    recommend();
  }));
});

/* V3: one-click copy + smart form prefill */
const quote=document.querySelector('#quote');
const resultCard=document.querySelector('.recommendation');
if(resultCard){
  const actions=document.createElement('div');
  actions.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin-top:10px';
  const copy=document.createElement('button');
  copy.className='btn';copy.type='button';copy.textContent='複製試算結果';
  copy.style.cssText='border:1px solid #dfe1e5;background:#fff;cursor:pointer';
  copy.onclick=async()=>{
    const text=`Google Workspace 試算：${userCountLabel.textContent}｜${recommendedPlan.textContent}｜${monthly.textContent} USD / 月｜目前信箱：${selected.mail}｜資料搬遷：${selected.migration}`;
    try{await navigator.clipboard.writeText(text);copy.textContent='✓ 已複製';setTimeout(()=>copy.textContent='複製試算結果',1800);}catch(e){prompt('請複製以下內容：',text);}
  };
  actions.appendChild(copy);
  const go=document.createElement('a');go.className='btn';go.href='#quote';go.textContent='用這個結果詢價 →';go.style.cssText='border:1px solid #202124;background:#202124;color:#fff';
  actions.appendChild(go);resultCard.appendChild(actions);
}

/* V3: floating conversion CTA on mobile / long pages */
const float=document.createElement('a');
float.href='#quote';float.textContent='免費需求評估 →';float.className='v3-float-cta';
Object.assign(float.style,{position:'fixed',right:'18px',bottom:'18px',zIndex:'50',padding:'13px 18px',borderRadius:'999px',background:'#202124',color:'#fff',fontWeight:'800',boxShadow:'0 10px 30px rgba(0,0,0,.18)',display:'none'});
document.body.appendChild(float);
window.addEventListener('scroll',()=>{float.style.display=window.scrollY>650?'inline-flex':'none';},{passive:true});

/* V3: form submission guard */
const form=document.querySelector('#leadForm');
if(form){form.addEventListener('submit',e=>{
  if(form.action.includes('YOUR_FORMSPREE_ID')){
    e.preventDefault();
    alert('V3 已完成，但表單尚未連接收件系統。請把 index.html 的 YOUR_FORMSPREE_ID 換成實際 Formspree ID，或改接 Google Apps Script / CRM。');
    return;
  }
});}

recommend();
