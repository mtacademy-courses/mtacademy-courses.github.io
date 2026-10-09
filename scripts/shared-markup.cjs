/** Shared static Arabic navigation. Runtime localization uses the same site data. */
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const href = (value, page) => page === 'home' && value.startsWith('/#') ? value.slice(1) : value;
function link(item, key, page, classes, pathId = '') {
  const current = pathId && item.href === ({ kids:'/kids-coding-bootcamp/', backend:'/backend-development-diploma/' })[page];
  return `<a class="${classes}" href="${href(item.href, page)}" data-nav-link data-config-href="${key}.href" data-config-text="${key}.label"${pathId ? ` data-learning-path="${pathId}"` : ''}${current ? ' aria-current="page"' : ''}>${escape(item.label)}</a>`;
}
function navigation(site, page, kind) {
  const copy = site.translations.ar;
  const main = copy.primaryNavigation;
  const paths = copy.learningNavigation;
  const ids = ['udemy','kids','backend'];
  if (kind === 'mobile') return link(main[0], 'primaryNavigation.0', page, 'mobile-nav__link') +
    `<div class="mobile-nav__paths">${link(main[1], 'primaryNavigation.1', page, 'mobile-nav__link')}${paths.map((item,i)=>link(item, `learningNavigation.${i}`, page, 'mobile-nav__link mobile-nav__child',ids[i])).join('')}</div>` +
    main.slice(2).map((item,i)=>link(item, `primaryNavigation.${i+2}`,page,'mobile-nav__link')).join('');
  return link(main[0], 'primaryNavigation.0', page, 'nav-link') +
    `<details class="nav-paths"><summary class="nav-link${['kids','backend'].includes(page)?' is-active':''}" data-config-text="primaryNavigation.1.label">${escape(main[1].label)}</summary><div class="nav-paths__menu"><a class="nav-submenu__link" href="${href(main[1].href,page)}" data-nav-link data-config-href="primaryNavigation.1.href" data-config-text="learningOverviewLabel">${escape(copy.learningOverviewLabel)}</a>${paths.map((item,i)=>link(item,`learningNavigation.${i}`,page,'nav-submenu__link',ids[i])).join('')}</div></details>` +
    main.slice(2).map((item,i)=>link(item,`primaryNavigation.${i+2}`,page,'nav-link')).join('');
}
function footerLinks(site,page) {
  const c=site.translations.ar;
  return [link(c.primaryNavigation[0],'primaryNavigation.0',page,''),link(c.primaryNavigation[1],'primaryNavigation.1',page,''),...c.learningNavigation.map((item,i)=>link(item,`learningNavigation.${i}`,page,'',['udemy','kids','backend'][i])),...c.primaryNavigation.slice(2).map((item,i)=>link(item,`primaryNavigation.${i+2}`,page,''))].join('');
}
const localizedText = (value, core) => core.technicalTextParts(value).map(part => part.technical
  ? `<bdi class="technical-name" dir="ltr" lang="en">${escape(part.text)}</bdi>`
  : escape(part.text)).join('');
module.exports={navigation,footerLinks,escape,localizedText};
