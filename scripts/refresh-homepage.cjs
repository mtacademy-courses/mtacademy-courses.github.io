/** Synchronize homepage Arabic content, navigation, instructor facts and payment fallbacks. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const markup=require('./shared-markup.cjs');
const root=path.resolve(__dirname,'..'),window={};
for(const name of ['site-core','site-data','courses-data'])vm.runInNewContext(fs.readFileSync(path.join(root,`assets/js/${name}.js`),'utf8'),{window,URL,Set});
const site=window.MTAcademySite,raw=window.MTAcademyData.siteConfig;
const copy={...raw,...raw.translations.ar,...site.translations.ar,seo:{...raw.seo,...raw.translations.ar.seo},interface:raw.translations.ar.interface,headerCta:{...raw.translations.ar.headerCta,url:site.contact.whatsapp}};
const homePath=path.join(root,'index.html');let html=fs.readFileSync(homePath,'utf8');
html=html.replace(/(<nav class="desktop-nav"[^>]*>)[\s\S]*?(<\/nav>)/,(_,a,b)=>a+markup.navigation(site,'home','desktop')+b);
html=html.replace(/(<nav class="mobile-nav__inner container"[^>]*>)[\s\S]*?(<div class="language-switcher language-switcher--mobile")/,(_,a,b)=>a+markup.navigation(site,'home','mobile')+'\n        '+b);
html=html.replace(/(<h2 id="footer-nav-title"[^>]*>[^<]*<\/h2>\s*<ul>)[\s\S]*?(<\/ul>)/,(_,a,b)=>a+markup.footerLinks(site,'home').split(/(?=<a )/).filter(Boolean).map(link=>`<li>${link}</li>`).join('')+b);
const bindArabic = (source, onHome = true) => source.replace(/(<([a-z][a-z0-9]*)\b[^>]*data-config-text="([^"]+)"[^>]*>)[\s\S]*?(<\/\2>)/g,(whole,a,tag,key,b)=>{
 if(key.startsWith('promotion.'))return whole;
 const value=window.MTAcademyCore.getByPath(copy,key);
 return typeof value==='string'||typeof value==='number'?a+markup.localizedText(value,window.MTAcademyCore)+b:whole;
}).replace(/(<a\b[^>]*data-config-href="([^"]+)"[^>]*>)/g,(whole,a,key)=>{
 let value=window.MTAcademyCore.getByPath(copy,key);
 if(typeof value!=='string')return whole;
 if(onHome&&value.startsWith('/#'))value=value.slice(1);
 return whole.replace(/href="[^"]*"/,`href="${markup.escape(value)}"`);
});
html=bindArabic(html);
const payments=raw.paymentMethods.map(method=>{
 const c=method.translations.ar;
 const url=new URL(site.contact.whatsapp);url.searchParams.set('text',`مرحبًا، أريد الاستفسار عن بيانات الدفع عبر ${c.name} مع MT Academy.`);
 return `<article class="payment-method" data-payment-method="${method.id}"><img class="payment-method__image" src="${method.image.src}" width="${method.image.width}" height="${method.image.height}" alt="${markup.escape(c.imageAlt)}" loading="lazy" decoding="async"><div class="payment-method__body"><h3>${markup.escape(c.name)}</h3><p>${markup.escape(c.description)}</p>${method.contactRequired?`<a class="payment-method__inquiry" href="${markup.escape(url.href)}" target="_blank" rel="noopener noreferrer">${markup.escape(c.contactLabel||raw.translations.ar.payment.contactLabel)}</a>`:''}</div></article>`;
}).join('');
html=html.replace(/(<div class="payment-methods" id="payment-methods"[^>]*>)[\s\S]*?(<\/div>\s*<\/div>\s*<\/div>\s*<\/section>)/,(_,a,b)=>a+payments+b);
// Numerals are isolated, including their lower-bound '+' marker, in both directions.
html=html.replace(/(<strong\b[^>]*data-config-text="instructorProfile\.(?:totalLearners|totalReviews)"[^>]*)(>)/g,(_,a,b)=>a.includes('dir=')?a+b:a+' dir="ltr"'+b);
const syncMetadata = (source, seo) => {
 source=source.replace(/<title>[\s\S]*?<\/title>/,`<title>${markup.escape(seo.title)}</title>`);
 const values={description:seo.description,'og:title':seo.title,'og:description':seo.description,'twitter:title':seo.title,'twitter:description':seo.description};
 if(seo.canonicalUrl)values['og:url']=seo.canonicalUrl;
 if(seo.ogLocale)values['og:locale']=seo.ogLocale;
 if(seo.socialImage){values['og:image']=values['twitter:image']=new URL(seo.socialImage,site.siteUrl).href;}
 if(seo.socialImageAlt){values['og:image:alt']=values['twitter:image:alt']=seo.socialImageAlt;}
 return source.replace(/<meta\b[^>]*(?:name|property)="([^"]+)"[^>]*>/g,(tag,key)=>values[key]?tag.replace(/content="[^"]*"/,`content="${markup.escape(values[key])}"`):tag);
};
html=syncMetadata(html,copy.seo);
const courses=window.MTAcademyData.courses.map(course=>({...course,...course.translations.ar}));
const schema=window.MTAcademyCore.buildCatalogSchema(copy,courses);
html=html.replace(/(<script id="structured-data" type="application\/ld\+json">)[\s\S]*?(<\/script>)/,(_,a,b)=>a+JSON.stringify(schema).replace(/</g,'\\u003c')+b);
fs.writeFileSync(homePath,html);
const errorPath=path.join(root,'404.html');
fs.writeFileSync(errorPath,syncMetadata(bindArabic(fs.readFileSync(errorPath,'utf8'),false),{title:copy.errorPage.pageTitle,description:copy.errorPage.description}));
console.log('Updated static Arabic homepage and 404 copy, navigation, instructor facts and payments.');
