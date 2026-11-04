const { chromium } = require('/home/egov/node_modules/playwright');
const HOST='https://hcm-demo.digit.org';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const b=await chromium.launch({headless:true});
  const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(HOST+'/payments-ui/employee/user/login',{waitUntil:'domcontentloaded',timeout:60000}); await sleep(4000);
  await p.fill('input[type="text"]','SCM');
  await p.fill('input[type="password"]',process.env.HCM_PASS);
  await p.locator('input[type="checkbox"]').first().check({force:true});
  await p.getByRole('button',{name:/continue/i}).click();
  await p.waitForSelector('.digit-landing-page-wrapper button[aria-label]',{timeout:40000}); await sleep(2000);
  await p.locator('.digit-landing-page-wrapper button[aria-label]').nth(2).click();
  await p.waitForFunction(()=>!!document.body && /My campaigns/i.test(document.body.innerText),{timeout:120000});
  await sleep(5000);
  const d=await p.evaluate(()=>{
    const btn=[...document.querySelectorAll('button')].find(x=>/Edit Campaign/i.test(x.innerText||''));
    let chain=[],a=btn;
    while(a && a!==document.body){ chain.push(a.tagName.toLowerCase()+'|'+a.className.toString().slice(0,70)+'|len='+(a.innerText||'').length); a=a.parentElement; }
    // find the title element and its chain
    const t=[...document.querySelectorAll('*')].find(e=>e.childElementCount===0 && (e.textContent||'').trim()==='Bednet_august_2026-2401');
    let tchain=[],c=t;
    while(c && c!==document.body){ tchain.push(c.tagName.toLowerCase()+'|'+c.className.toString().slice(0,70)+'|len='+(c.innerText||'').length); c=c.parentElement; }
    return {btnChain:chain, titleChain:tchain, titleTag:t&&t.tagName, titleCls:t&&t.className.toString()};
  });
  console.log(JSON.stringify(d,null,1));
  await b.close();
})();
