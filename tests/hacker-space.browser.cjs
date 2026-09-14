(async () => {
 const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
 const assert = (await import('node:assert/strict')).default;
 const {mkdtempSync} = await import('node:fs');
 const {tmpdir} = await import('node:os');
 const root=mkdtempSync(tmpdir()+'/hmwi-v2-');console.log('Screenshots:',root);
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const key='hmwi.hacker-space.progress.v1';
 const titles=['包裹只差 12 元','主管說，先幫我匯一下','這個 Wi-Fi，熱心得有點奇怪','我只請 AI 整理一份文件'];
 const good=[[1,0,2],[0,2,1],[1,2,0],[1,2,0]];
 const errors=[],network=[];
 const base='http://127.0.0.1:3107';
 async function setup(options={}) {
  const c=await browser.newContext(options);
  await c.route('**/*',r=>{const u=new URL(r.request().url());if(u.hostname!=='127.0.0.1'){network.push(u.href);return r.abort()}if(r.request().method()!=='GET')network.push(r.request().method()+' '+u.pathname);return r.continue()});
  c.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));return c;
 }
 async function intro(p){
  await p.getByRole('button',{name:'Yes',exact:true}).click();
  await p.getByRole('heading',{name:'Me too! You’re in.'}).waitFor();
 }
 async function dashboard(p){await intro(p);await p.getByRole('button',{name:'Learn More...',exact:true}).click();}
 async function finish(p, choices){
  for(let i=0;i<3;i++){
   assert.equal(await p.locator('[class*="scoreRing"]').count(),0);
   await p.locator('section[aria-label="選擇行動"] button[aria-pressed]').nth(choices[i]).click();
   await p.getByRole('button',{name:'採取行動',exact:true}).click();
   const feedback=p.locator('[class*="feedback"]');
   assert.ok(!/\+\d+\s*分/.test(await feedback.innerText()));
   assert.equal(await feedback.getAttribute('data-success'),null);
   await p.getByRole('button',{name:i===2?'查看事件復盤':'繼續調查',exact:true}).click();
  }
  await p.getByRole('heading',{name:'背後的原理',exact:true}).waitFor();
 }
 try {
  const c=await setup({viewport:{width:1440,height:1000}});const p=await c.newPage();
  await p.goto(base+'/');await p.getByRole('link',{name:/Hacker Space.*initiate_challenge/}).first().click();await p.waitForURL('**/hacker-space');
  const no=p.getByText('No',{exact:true});assert.equal(await no.evaluate(e=>e.tagName),'SPAN');
  await no.click();assert.equal(await p.getByRole('heading',{name:'One tiny question.'}).count(),1);
  assert.ok((await p.locator('pre').innerText()).includes('os.remove("C:/Windows/System32")'));
  await p.waitForTimeout(600);await p.screenshot({path:root+'/entry-desktop.png',fullPage:true});
  await p.getByRole('button',{name:'Yes',exact:true}).focus();await p.keyboard.press('Enter');
  await p.getByRole('button',{name:'Challenge Me',exact:true}).click();
  const first=await p.locator('[class*="missionHeading"] h1').textContent();
  await p.getByRole('button',{name:'退出挑戰，返回 Dashboard',exact:true}).click();
  assert.equal(await p.getByRole('button',{name:'Yes',exact:true}).count(),0);
  assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),null);
  await p.getByRole('button',{name:'Challenge Me',exact:true}).click();
  assert.notEqual(await p.locator('[class*="missionHeading"] h1').textContent(),first);
  await p.getByRole('button',{name:'退出挑戰，返回 Dashboard',exact:true}).click();
  for(let i=0;i<4;i++){
   await p.getByRole('button',{name:'進入事件：'+titles[i],exact:true}).click();
   await finish(p,good[i]);assert.equal(await p.locator('[class*="scoreRing"] strong').textContent(),'100');
   await p.getByRole('button',{name:'探索其他事件',exact:true}).click();
  }
  assert.equal(await p.locator('[class*="categoryStats"] button').count(),5);
  assert.ok((await p.locator('[class*="categoryStats"] button').first().innerText()).includes('4 / 4'));
  await p.getByRole('button',{name:'重新挑戰：'+titles[0],exact:true}).click();await finish(p,[0,1,0]);
  assert.equal(await p.locator('[class*="scoreRing"] strong').textContent(),'0');
  assert.equal((await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key)).results.parcel.best,100);
  await p.getByRole('button',{name:'探索其他事件',exact:true}).click();
  await p.reload();await dashboard(p);
  assert.equal(await p.getByText('已通關 · 100 分',{exact:true}).count(),4);
  assert.equal(await p.evaluate(()=>document.activeElement.id),'learn-more');
  await p.getByText('進度會保存嗎？',{exact:true}).click();
  assert.ok(await p.locator('details[open]').innerText());
  console.log('PASS entry, decorative No, keyboard Yes, random non-repeat, immediate exit, delayed scoring, all cases, 0/100 paths, persisted best, category totals, Learn More, FAQ');
  for(const width of [320,390,768,1440]){
   await p.setViewportSize({width,height:900});await p.emulateMedia({reducedMotion:'reduce'});
   await p.reload();await p.getByRole('button',{name:'Yes',exact:true}).waitFor();
   assert.ok(await p.locator('main').evaluate(e=>e.scrollWidth<=e.clientWidth));
   await intro(p);await p.screenshot({path:root+`/intro-${width}.png`,fullPage:true});
   await p.getByRole('button',{name:'Learn More...',exact:true}).click();
   await p.getByRole('button',{name:'重新挑戰：'+titles[3],exact:true}).click();
   await p.getByRole('button',{name:'查看文件摘錄'}).click();await p.locator('summary').filter({hasText:'技術視角'}).click();
   assert.ok(await p.locator('main').evaluate(e=>e.scrollWidth<=e.clientWidth));
   await p.screenshot({path:root+`/mission-${width}.png`,fullPage:true});
   await finish(p,good[3]);assert.ok(await p.locator('main').evaluate(e=>e.scrollWidth<=e.clientWidth));
  }
  const other=await c.newPage();await other.goto(base+'/hacker-space');await dashboard(other);
  await other.locator('[class*="categoryStats"] button').filter({hasText:'Prompt Injection'}).click();
  assert.equal(await other.getByRole('button',{name:/重新挑戰：/}).count(),1);
  await other.locator('[class*="categoryStats"] button').first().click();
  const before=(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key)).results.parcel.attempts;
  await p.getByRole('button',{name:'探索其他事件',exact:true}).click();
  await p.getByRole('button',{name:'重新挑戰：'+titles[0],exact:true}).click();await finish(p,good[0]);
  await other.getByText(`最近 100 分 · 已完成 ${before+1} 次`,{exact:true}).waitFor();
  await other.evaluate(k=>localStorage.setItem(k,'{broken'),key);await other.reload();await dashboard(other);
  assert.equal(await other.getByRole('button',{name:/進入事件：/}).count(),4);
  await other.evaluate(()=>localStorage.setItem('theme','light'));await other.reload();await dashboard(other);
  await other.evaluate(()=>window.scrollTo(0,0));await other.waitForTimeout(600);
  await other.screenshot({path:root+'/dashboard-light.png',fullPage:true});
  console.log('PASS category filtering, cross-tab updates, corrupt progress, light dashboard');
  const blocked=await setup();await blocked.addInitScript(k=>{
   const get=Storage.prototype.getItem,set=Storage.prototype.setItem;
   Storage.prototype.getItem=function(n){if(n===k)throw new DOMException('Denied','SecurityError');return get.call(this,n)};
   Storage.prototype.setItem=function(n,v){if(n===k)throw new DOMException('Denied','QuotaExceededError');return set.call(this,n,v)};
  },key);
  const b=await blocked.newPage();await b.goto(base+'/hacker-space');await dashboard(b);
  await b.getByRole('button',{name:'進入事件：'+titles[0],exact:true}).click();await finish(b,good[0]);
  await b.getByRole('status').filter({hasText:'瀏覽器目前無法保存進度'}).waitFor();
  assert.deepEqual(errors,[]);assert.deepEqual(network,[]);
  console.log('PASS responsive entry/mission/results, hints, blocked storage, no browser errors/external calls/write requests');
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
