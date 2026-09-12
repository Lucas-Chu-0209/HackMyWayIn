(async()=>{
 const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
 const { default: assert } = await import('node:assert/strict');
 const { mkdtempSync } = await import('node:fs');
 const { join } = await import('node:path');
 const { tmpdir } = await import('node:os');
 const root=mkdtempSync(join(tmpdir(),'hmwi-browser-'));
 console.log('Browser artifacts:',root);
 const base='http://127.0.0.1:3107';
 const key='hmwi.hacker-space.progress.v1';
 const titles=['包裹只差 12 元','主管說，先幫我匯一下','這個 Wi-Fi，熱心得有點奇怪','我只請 AI 整理一份文件'];
 const good=[[1,0,2],[0,2,1],[1,2,0],[1,2,0]];
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try {
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const errors=[]; const network=[];
 context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
 await context.route('**/*',route=>{
   const req=route.request(),u=new URL(req.url());
   if(u.hostname!=='127.0.0.1'){network.push(req.url());return route.abort()}
   if(req.method()!=='GET')network.push(req.method()+' '+u.pathname);
   return route.continue();
 });
 const page=await context.newPage();
 await page.goto(base+'/');
 await page.getByRole('link',{name:/Hacker Space.*進入調查室/}).first().click();
 await page.waitForURL('**/hacker-space');await page.waitForTimeout(350);
 console.log('PASS existing home sidebar links to Hacker Space');
 await page.screenshot({path:root+'/lobby-dark.png',fullPage:true});
 assert.equal(await page.getByRole('button',{name:/進入事件：/}).count(),4);
 await page.getByRole('button',{name:'Prompt Injection',exact:true}).click();
 assert.equal(await page.getByRole('button',{name:/進入事件：/}).count(),1);
 await page.getByRole('button',{name:/全部事件/}).click();
 const first=page.getByRole('button',{name:'開始第一個事件'});await first.focus();await page.keyboard.press('Enter');
 assert.equal(await page.getByRole('button',{name:'採取行動',exact:true}).isDisabled(),true);
 await page.getByRole('button',{name:'查看完整網址'}).click();
 await page.locator('summary').filter({hasText:'技術視角'}).click();
 await page.screenshot({path:root+'/investigation.png',fullPage:true});
 await page.getByRole('button',{name:'← 事件列表',exact:true}).click();
 await page.getByRole('button',{name:'繼續調查',exact:true}).click();
 assert.equal(await page.getByRole('button',{name:'採取行動',exact:true}).isVisible(),true);
 async function finish(p, choices){
   for(let i=0;i<3;i++){
     await p.locator('section[aria-label="選擇行動"] button[aria-pressed]').nth(choices[i]).click();
     await p.getByRole('button',{name:'採取行動',exact:true}).click();
     assert.equal(await p.locator('section[aria-label="選擇行動"] button[aria-pressed]').first().isDisabled(),true);
     await p.getByRole('button',{name:i===2?'查看事件復盤':'繼續調查',exact:true}).click();
   }
   await p.getByRole('heading',{name:'背後的原理',exact:true}).waitFor();
 }
 await finish(page,good[0]);
 assert.equal(await page.locator('[class*="scoreRing"] strong').textContent(),'100');
 await page.screenshot({path:root+'/debrief.png',fullPage:true});
 const raw=()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
 assert.equal((await raw()).results.parcel.best,100);
 await page.getByRole('button',{name:'重玩這個事件',exact:true}).click();await finish(page,[0,1,0]);
 assert.equal(await page.locator('[class*="scoreRing"] strong').textContent(),'0');
 assert.deepEqual((await raw()).results.parcel,{version:1,best:100,last:0,attempts:2});
 await page.getByRole('button',{name:'探索其他事件',exact:true}).click();
 for(let i=1;i<4;i++){
   await page.getByRole('button',{name:'進入事件：'+titles[i],exact:true}).click();await finish(page,good[i]);
   assert.equal(await page.locator('[class*="scoreRing"] strong').textContent(),'100');
   await page.getByRole('button',{name:'探索其他事件',exact:true}).click();
 }
 await page.reload();await page.getByText('已通關 · 100 分',{exact:true}).first().waitFor();
 assert.equal(await page.getByText('已通關 · 100 分',{exact:true}).count(),4);
 console.log('PASS all four cases, 100/0 point paths, filtering, keyboard start, decision locking, replay and persisted best results');
 const other=await context.newPage();await other.goto(base+'/hacker-space');
 await page.getByRole('button',{name:'重新挑戰：'+titles[0],exact:true}).click();await finish(page,good[0]);
 await other.getByText('最近 100 分 · 已完成 3 次',{exact:true}).waitFor();
 console.log('PASS cross-tab progress updates');
 for(const [width,theme] of [[390,'dark'],[390,'light'],[320,'light'],[768,'dark']]){
   await other.setViewportSize({width,height:900});
   await other.evaluate(t=>localStorage.setItem('theme',t),theme);await other.reload();
   await other.waitForTimeout(350);
   const dimensions=await other.locator('main[lang="zh-Hant"] > div').evaluate(e=>({scroll:e.scrollWidth,width:e.clientWidth}));
   assert.ok(dimensions.scroll<=dimensions.width,JSON.stringify({width,dimensions}));
   if(width===390)await other.screenshot({path:root+`/lobby-mobile-${theme}.png`,fullPage:true});
   const navRight=await other.locator('header a:visible').evaluateAll(links=>Math.max(...links.map(e=>e.getBoundingClientRect().right)));
   assert.ok(navRight<=width,JSON.stringify({width,navRight}));
   console.log('PASS lobby and navbar responsive '+width+' '+theme,dimensions);
 }
 await other.setViewportSize({width:390,height:844});await other.emulateMedia({reducedMotion:'reduce'});
 await other.getByRole('button',{name:'重新挑戰：'+titles[3],exact:true}).click();
 await other.getByRole('button',{name:'查看文件摘錄'}).click();
 await other.locator('summary').filter({hasText:'技術視角'}).click();
 await other.screenshot({path:root+'/mission-mobile.png',fullPage:true});
 assert.ok(await other.locator('main[lang="zh-Hant"] > div').evaluate(e=>e.scrollWidth<=e.clientWidth));
 await finish(other,good[3]);
 assert.ok(await other.locator('main[lang="zh-Hant"] > div').evaluate(e=>e.scrollWidth<=e.clientWidth));
 console.log('PASS mobile evidence, technical notes, reduced-motion and complete mission');
 await other.evaluate(k=>localStorage.setItem(k,'{broken'),key);await other.reload();
 assert.equal(await other.getByRole('button',{name:/進入事件：/}).count(),4);
 const blocked=await browser.newContext();
 await blocked.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 await blocked.addInitScript(k=>{
   const get=Storage.prototype.getItem, set=Storage.prototype.setItem;
   Storage.prototype.getItem=function(name){if(name===k)throw new DOMException('Denied','SecurityError');return get.call(this,name)};
   Storage.prototype.setItem=function(name,val){if(name===k)throw new DOMException('Denied','QuotaExceededError');return set.call(this,name,val)};
 },key);
 const b=await blocked.newPage();b.on('pageerror',e=>errors.push(e.message));await b.goto(base+'/hacker-space');
 await b.getByRole('button',{name:'開始第一個事件'}).click();await finish(b,good[0]);
 await b.getByRole('status').filter({hasText:'瀏覽器目前無法保存進度'}).waitFor();
 console.log('PASS corrupt and blocked localStorage remain playable with explicit save warning');
 assert.deepEqual(errors,[]);assert.deepEqual(network,[]);
 console.log('PASS no page errors, external calls or write requests during Hacker Space play');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
