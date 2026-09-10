const users = document.querySelector('#users');
const userCountLabel = document.querySelector('#userCountLabel');
const recommendedPlan = document.querySelector('#recommendedPlan');
const recReason = document.querySelector('#recReason');
const monthly = document.querySelector('#monthly');

function updateRecommendation(){
  const n = Number(users.value);
  userCountLabel.textContent = `${n} 人`;
  let plan, price, reason;
  if(n <= 10){ plan='Business Starter'; price=7; reason='小型團隊先從企業 Email、雲端協作與基本管理開始。'; }
  else if(n <= 100){ plan='Business Standard'; price=14; reason='多數成長型企業適合：2 TB、Gemini、錄影與更完整的協作能力。'; }
  else { plan='Business Standard'; price=14; reason='100–300 人團隊可先評估 Standard；若有進階合規、安全或大量會議需求，再評估 Plus / Enterprise。'; }
  recommendedPlan.textContent=plan;
  recReason.textContent=reason;
  monthly.textContent=`$${(n*price).toLocaleString()}`;
}
users.addEventListener('input',updateRecommendation);
document.querySelectorAll('.choice-row').forEach(row=>{
  row.querySelectorAll('.choice').forEach(btn=>{
    btn.addEventListener('click',()=>{
      row.querySelectorAll('.choice').forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});
updateRecommendation();

document.querySelector('#leadForm').addEventListener('submit', e=>{
  const action=e.currentTarget.getAttribute('action');
  if(action.includes('YOUR_FORMSPREE_ID')){
    e.preventDefault();
    alert('網站已完成，但表單還沒接收件系統。請先把 index.html 的 YOUR_FORMSPREE_ID 換成你的 Formspree ID。');
  }
});
