const { chromium } = require('/home/egov/node_modules/playwright');
const fs=require('fs');
const HOST='https://hcm-demo.digit.org';
const OUT='/home/egov/hcm-payments-audit';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const TARGET='Bednet_august_2026-2401';
(async()=>{
  const b=await chromium.launch({headless:true});
  const p=await (await b.newContext({viewport:{width:1440,height:900},acceptDownloads:false})).newPage();
  await p.goto(HOST+'/payments-ui/employee/user/login',{waitUntil:'domcontentloaded',timeout:60000}); await sleep(4000);
  await p.fill('input[type="text"]','SCM');
  await p.fill('input[type="password"]',process.env.HCM_PASS);
  await p.locator('input[type="checkbox"]').first().check({force:true});
  await p.getByRole('button',{name:/continue/i}).click();
  await p.waitForSelector('.digit-landing-page-wrapper button[aria-label]',{timeout:40000}); await sleep(2000);
  await p.locator('.digit-landing-page-wrapper button[aria-label]').nth(2).click();
  await p.waitForFunction(()=>!!document.body && /My campaigns/i.test(document.body.innerText),{timeout:120000});
  await sleep(5000);

  const diag=await p.evaluate(()=>{
    const cards=[...document.querySelectorAll('.digit-results-card-component')];
    const btnGroups=[...document.querySelectorAll('.digit-results-card-buttons')];
    const allBtns=[...document.querySelectorAll('button')].filter(x=>/Edit Campaign|Clone Campaign|Download/i.test(x.innerText||''));
    return {
      cardCount:cards.length, btnGroupCount:btnGroups.length,
      titles:cards.map(c=>(c.querySelector('.digit-results-card-heading')||{}).textContent),
      // are card and its buttons ever nested?
      anyNested:cards.some(c=>c.querySelector('.digit-results-card-buttons')),
      // accessible names of action buttons - do they distinguish the campaign?
      actionBtnNames:[...new Set(allBtns.map(x=>(x.getAttribute('aria-label')||x.innerText||'').trim()))],
      actionBtnCount:allBtns.length,
      ariaLabelsPresent:allBtns.filter(x=>x.getAttribute('aria-label')).length,
    };
  });
  console.log('DIAG:',JSON.stringify(diag,null,1));

  const idx=diag.titles.findIndex(t=>t&&t.trim()===TARGET);
  console.log('\ntarget index:',idx);
  if(idx<0){ console.log('target not on this page'); await b.close(); return; }

  await p.locator('.digit-results-card-buttons').nth(idx).locator('button',{hasText:/Edit Campaign/i}).first().click({timeout:15000});
  await p.waitForFunction(()=>!!document.body && document.body.innerText.length>400,{timeout:90000}).catch(()=>console.log('slow'));
  await sleep(10000);
  console.log('\nurl:',p.url());
  const t=await p.evaluate(()=>document.body.innerText);
  fs.writeFileSync(OUT+'/screens/SCM-bednet-campaign-home.txt',t);
  await p.screenshot({path:OUT+'/shots/SCM-bednet-campaign-home.png',fullPage:true});
  console.log('--- first lines ---'); console.log(t.split('\n').slice(0,12).join('\n'));

  // ---- Configure mobile app -> Preview App Configuration ----
  await p.getByRole('button',{name:/Preview App Configuration/i}).first().click({timeout:20000});
  await p.waitForFunction(()=>!!document.body && document.body.innerText.length>300,{timeout:90000}).catch(()=>console.log('slow2'));
  await sleep(12000);
  console.log('\nAPPCONFIG url:',p.url());
  const t2=await p.evaluate(()=>document.body.innerText);
  fs.writeFileSync(OUT+'/screens/SCM-bednet-appconfig.txt',t2);
  await p.screenshot({path:OUT+'/shots/SCM-bednet-appconfig.png',fullPage:true});
  console.log('--- appconfig text ---'); console.log(t2.slice(0,2500));

  const hh=await p.evaluate(()=>[...document.querySelectorAll('*')]
    .filter(e=>e.childElementCount===0 && /household/i.test(e.textContent||''))
    .map(e=>({tag:e.tagName, cls:e.className.toString().slice(0,50), txt:e.textContent.trim().slice(0,60)})));
  console.log('\nhousehold elements:',JSON.stringify([...new Map(hh.map(x=>[x.txt,x])).values()],null,1));

  // ---- Registration & Delivery -> Configure ----
  const cfgIdx=await p.evaluate(()=>{
    const hdrs=[...document.querySelectorAll('header,h1,h2,h3,div')].filter(e=>/^Registration & Delivery$/.test((e.textContent||'').trim()) && e.childElementCount===0);
    const btns=[...document.querySelectorAll('button')].filter(x=>/^Configure$/i.test((x.innerText||'').trim()));
    return {nHdrs:hdrs.length, nConfigure:btns.length};
  });
  console.log('\nconfigure buttons:',JSON.stringify(cfgIdx));
  await p.getByRole('button',{name:/^Configure$/i}).first().click({timeout:20000});
  await p.waitForFunction(()=>!!document.body && document.body.innerText.length>300,{timeout:90000}).catch(()=>console.log('slow3'));
  await sleep(14000);
  console.log('\nREG-DELIVERY url:',p.url());
  const t3=await p.evaluate(()=>document.body.innerText);
  fs.writeFileSync(OUT+'/screens/SCM-bednet-regdelivery.txt',t3);
  await p.screenshot({path:OUT+'/shots/SCM-bednet-regdelivery.png',fullPage:true});
  console.log('--- text ---'); console.log(t3.slice(0,3000));
  await b.close();
})();
