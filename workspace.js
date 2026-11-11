const workspacePlans = {
  starter: { name: 'Business Starter', rate: 7 },
  standard: { name: 'Business Standard', rate: 14 },
  plus: { name: 'Business Plus', rate: 22 }
};
const calculator = document.querySelector('#workspace-calculator');
const dollars = new Intl.NumberFormat('en-US');

function readWorkspaceEstimate(params) {
  const seats = Number(params.get('seats'));
  const key = params.get('plan');
  if (!Object.hasOwn(workspacePlans, key) || !Number.isInteger(seats) || seats < 1 || seats > 300) {
    return null;
  }

  const plan = workspacePlans[key];
  const total = `USD ${dollars.format(seats * plan.rate)}`;
  const summary = `Google Workspace 試算：${seats} 人｜${plan.name}｜${total}／月（年度承諾，未稅）\n目前信箱：${(params.get('mail') || '').slice(0, 60)}\n資料搬遷：${(params.get('migration') || '').slice(0, 60)}`;
  return { total, summary };
}

if (calculator) {
  const output = document.querySelector('#workspace-total');
  const copy = document.querySelector('#copy-workspace-estimate');
  const copyStatus = document.querySelector('#workspace-copy-status');
  const estimate = () => readWorkspaceEstimate(new FormData(calculator));

  function renderEstimate() {
    const result = estimate();
    output.textContent = result?.total ?? '請輸入 1–300 人';
    copy.disabled = !result;
    copyStatus.textContent = '';
  }

  copy.hidden = !navigator.clipboard;
  calculator.addEventListener('input', renderEstimate);
  copy.addEventListener('click', async () => {
    const result = estimate();
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.summary);
      copyStatus.textContent = '已複製試算結果。';
    } catch {
      copyStatus.textContent = '目前無法複製。你仍可將試算結果帶入詢價表單。';
    }
  });
  renderEstimate();
} else {
  const message = document.querySelector('#consultation [name="message"]');
  const params = new URLSearchParams(location.search);
  const result = params.get('service') === 'workspace' ? readWorkspaceEstimate(params) : null;
  if (message && !message.value && result) {
    message.value = `${result.summary}\n\n補充需求：`;
  }
}
