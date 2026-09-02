const { chromium } = require('/home/egov/node_modules/playwright');
const fs=require('fs');
const HOST='https://hcm-demo.digit.org';
const OUT='/home/egov/hcm-payments-audit';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const TARGET='Bednet_august_2026-2401';

// reuse the harvest + check functions from the payments audit
const HARVEST = eval('('+fs.readFileSync(OUT+'/crawl.js','utf8').match(/const HARVEST = (\(\) => \{[\s\S]*?\n\};)/)[1].replace(/;$/,'')+')');
const CHECK   = eval('('+fs.readFileSync(OUT+'/struct.js','utf8').match(/const CHECK = (\(\) => \{[\s\S]*?\n\};)/)[1].replace(/;$/,'')+')');

(async()=>{
  const b=await chromium.launch({headless:true});
  const p=await (await b.newContext({viewport:{width:1440,height:900},acceptDownloads:false})).newPage();
  const errs=[],bad=[];
  p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,250));});
  p.on('pageerror',e=>errs.push('PAGEERROR: '+e.message.slice(0,250)));
  p.on('response',r=>{if(r.status()>=400&&!/matomo/.test(r.url())) bad.push(r.status()+' '+r.request().method()+' '+r.url().slice(0,150));});

  await p.goto(HOST+'/payments-ui/employee/user/login',{waitUntil:'domcontentloaded',timeout:60000}); await sleep(4000);
  await p.fill('input[type="text"]','SCM');
  await p.fill('input[type="password"]',process.env.HCM_PASS);
  await p.locator('input[type="checkbox"]').first().check({force:true});
  await p.getByRole('button',{name:/continue/i}).click();
  await p.waitForSelector('.digit-landing-page-wrapper button[aria-label]',{timeout:40000}); await sleep(2000);
  await p.locator('.digit-landing-page-wrapper button[aria-label]').nth(2).click();
  await p.waitForFunction(()=>!!document.body && /My campaigns/i.test(document.body.innerText),{timeout:120000}); await sleep(5000);

  const titles=await p.evaluate(()=>[...document.querySelectorAll('.digit-results-card-component')].map(c=>((c.querySelector('.digit-results-card-heading')||{}).textContent||'').trim()));
  const idx=titles.indexOf(TARGET);
  console.log('bednet card index:',idx);
  await p.locator('.digit-results-card-buttons').nth(idx).locator('button',{hasText:/Edit Campaign/i}).first().click({timeout:15000});
  await p.waitForFunction(()=>!!document.body && /Campaign home page/i.test(document.body.innerText),{timeout:90000}); await sleep(6000);
  const camp=await p.evaluate(()=>document.body.innerText.split('\n').slice(6,9).join(' / '));
  console.log('campaign home:',camp,'|',p.url());

  await p.getByRole('button',{name:/Preview App Configuration/i}).first().click({timeout:20000});
  await p.waitForFunction(()=>!!document.body && /Mobile app modules/i.test(document.body.innerText),{timeout:90000}); await sleep(6000);
  await p.getByRole('button',{name:/^Configure$/i}).first().click({timeout:20000});
  await p.waitForFunction(()=>!!document.body && /Household Overview/i.test(document.body.innerText),{timeout:90000}); await sleep(10000);
  console.log('reg module url:',p.url());

  // ---- click Household Overview in the Flows nav ----
  errs.length=0; bad.length=0;
  await p.getByText('Household Overview',{exact:true}).first().click({timeout:20000});
  await sleep(12000);
  console.log('\n=== HOUSEHOLD OVERVIEW ===');
  console.log('url:',p.url());
  const t=await p.evaluate(()=>document.body.innerText);
  fs.writeFileSync(OUT+'/screens/SCM-household-overview.txt',t);
  await p.screenshot({path:OUT+'/shots/SCM-household-overview.png',fullPage:true});
  console.log(t);

  const h=await p.evaluate(HARVEST); fs.writeFileSync(OUT+'/screens/SCM-household-overview.json',JSON.stringify(h,null,2));
  const c=await p.evaluate(CHECK);   fs.writeFileSync(OUT+'/struct-household-overview.json',JSON.stringify(c,null,2));
  console.log('\nconsole errors:',JSON.stringify([...new Set(errs)].slice(0,8)));
  console.log('failed reqs:',JSON.stringify([...new Set(bad)].slice(0,8)));
  await b.close();
})();
