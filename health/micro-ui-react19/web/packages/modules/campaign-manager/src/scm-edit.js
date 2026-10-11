const { chromium } = require('/home/egov/node_modules/playwright');
const fs=require('fs');
const HOST='https://hcm-demo.digit.org';
const OUT='/home/egov/hcm-payments-audit';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const TARGET='Bednet_august_2026-2401';
(async()=>{
  const b=await chromium.launch({headless:true});
  const ctx=await b.newContext({viewport:{width:1440,height:900},acceptDownloads:false});
  const p=await ctx.newPage();
  await p.goto(HOST+'/payments-ui/employee/user/login',{waitUntil:'domcontentloaded',timeout:60000}); await sleep(4000);
  await p.fill('input[type="text"]','SCM');
  await p.fill('input[type="password"]',process.env.HCM_PASS);
  await p.locator('input[type="checkbox"]').first().check({force:true});
  await p.getByRole('button',{name:/continue/i}).click();
  await p.waitForSelector('.digit-landing-page-wrapper button[aria-label]',{timeout:40000}); await sleep(2000);
  await p.locator('.digit-landing-page-wrapper button[aria-label]').nth(2).click();
  await p.waitForFunction(()=>!!document.body && /My campaigns/i.test(document.body.innerText),{timeout:120000});
  await sleep(5000);

  // map each "Edit Campaign" button to its card title, then pick the target
  const ok=await p.evaluate((T)=>{
    const btns=[...document.querySelectorAll('button')].filter(x=>/Edit Campaign/i.test(x.innerText||''));
    const map=btns.map((btn,i)=>{
      let a=btn, title=null;
      for(let d=0; d<12 && a.parentElement; d++){
        a=a.parentElement;
        const cand=[...a.querySelectorAll('*')].find(e=>e.childElementCount===0 && /^[A-Za-z][\w-]*_[\w-]+$|^CO-DELIVERY|^Bednet_|^POLIO_|^Oncho_/.test((e.textContent||'').trim()));
        if(cand){ title=cand.textContent.trim(); break; }
      }
      return {i,title};
    });
    const hit=map.find(m=>m.title===T);
    if(!hit) return {err:'target not among cards', titles:map.map(m=>m.title)};
    btns[hit.i].setAttribute('data-hh-target','1');
    return {matchedIndex:hit.i, matchedTitle:hit.title, allTitles:map.map(m=>m.title)};
  },TARGET);
  console.log('target card:',JSON.stringify(ok,null,1));
  if(!ok||ok.err){ await b.close(); return; }
  await p.locator('[data-hh-target="1"]').click({timeout:15000});
  await p.waitForFunction(()=>!!document.body && document.body.innerText.length>300,{timeout:90000}).catch(()=>console.log('slow'));
  await sleep(10000);
  console.log('url:',p.url());
  const t=await p.evaluate(()=>document.body.innerText);
  fs.writeFileSync(OUT+'/screens/SCM-bednet-edit.txt',t);
  await p.screenshot({path:OUT+'/shots/SCM-bednet-edit.png',fullPage:true});
  console.log('--- text ---'); console.log(t.slice(0,2000));
  const nav=await p.evaluate(()=>[...document.querySelectorAll('a,button,[role=button],[class*="stepper"] *,[class*="timeline"] *')]
    .filter(e=>e.childElementCount<3&&(e.innerText||'').trim())
    .map(e=>e.innerText.trim().slice(0,45)));
  console.log('\nnav/steps:',JSON.stringify([...new Set(nav)]));
  await b.close();
})();
