/** Check the published program's numerical contracts, locale parity and saved fallback. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createHash } = require('node:crypto');
const root = path.resolve(__dirname, '..');
const window = {};
for (const file of ['site-core', 'site-data', 'backend-diploma-data']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, `assets/js/${file}.js`), 'utf8'), { window, URL, Set });
}
const diploma = window.MTAcademyBackend;
const p = diploma.plan;
assert.equal(diploma.status, 'open');
assert.equal(p.studyWeeks * p.sessionsPerWeek, p.totalSessions);
assert.equal(p.totalSessions * p.sessionHours, p.scheduledHours);
assert.equal(p.learningHours + p.breakHours, p.scheduledHours);
assert.equal(diploma.sessionBlocks.reduce((sum, block) => sum + block.minutes, 0), p.sessionHours * 60);
assert.equal(diploma.sessionBlocks.at(-1).minutes * p.totalSessions / 60, p.breakHours);
assert.equal(p.independentPractice.min, 12);
assert.equal(p.independentPractice.max, 16);
assert.equal(p.start.month, 2);
assert.equal(p.start.year, 2027);
assert.equal(p.start.status, 'proposed');
for (const plan of diploma.pricingPlans) {
  assert.equal(plan.deposit + plan.count * plan.monthly, plan.total, `${plan.id}: installment arithmetic`);
  assert.ok(plan.full < plan.total, `${plan.id}: separate full-payment price`);
}
assert.equal(diploma.pricingPlans[0].full, 16500);
assert.equal(diploma.pricingPlans[0].total, 18000);
assert.equal(diploma.pricingPlans[1].full, 650);
assert.equal(diploma.pricingPlans[1].total, 750);
const fieldPaths = (value, prefix = '') => Object.entries(value).flatMap(([key, child]) => {
  const field = prefix ? `${prefix}.${key}` : key;
  return child && typeof child === 'object' ? fieldPaths(child, field) : [field];
});
assert.deepEqual(fieldPaths(diploma.translations.ar), fieldPaths(diploma.translations.en), 'Translation field parity');
for (const locale of ['ar', 'en']) {
  const copy = diploma.translations[locale];
  assert.equal(copy.curriculum.stages.length, 8);
  assert.deepEqual(Array.from(copy.curriculum.stages, stage => stage.modules.length), [1,4,3,4,2,2,2,3]);
  assert.equal(copy.curriculum.stages.flatMap(stage => stage.modules).length, 21);
  assert.equal(copy.projects.items.length, p.projectCount);
  assert.equal(copy.faq.items.length, 56);
  assert.equal(copy.faq.groups.length, 5);
  const paymentMethods = copy.paymentMethods;
  const paymentIds = ['instapay','vodafone-cash','paypal','western-union','bank-transfer'];
  assert.deepEqual(Array.from(paymentMethods.methods, method => method.id), paymentIds);
  assert.deepEqual(Array.from(paymentMethods.methods, method => method.name), locale === 'ar'
    ? ['إنستا باي','فودافون كاش','باي بال','ويسترن يونيون','تحويل بنكي']
    : ['InstaPay','Vodafone Cash','PayPal','Western Union','Bank transfer']);
  assert.ok(paymentMethods.coordinationNote.endsWith(copy.registrationNote));
  const paymentFaq = copy.faq.items.filter(item => item.id === 'payment-methods');
  assert.equal(paymentFaq.length, 1);
  assert.equal(paymentFaq[0].group, 'payments');
  assert.equal(paymentFaq[0].answer, paymentMethods.faqAnswer);
  assert.equal(paymentFaq[0].href, '#diploma-payment-methods');
  for (const method of paymentMethods.methods) assert.ok(paymentFaq[0].answer.includes(method.name));
  const notice = copy.careerOutcomesNotice;
  assert.equal(notice.paragraphs.length, 6);
  // Approved source fingerprints; paragraphs are joined with one blank line.
  const approvedNoticeHash = locale === 'ar'
    ? '94314df607e97d3fb168cd27e1611ff08b83d0876d7abb350707269b2d2ba7d1'
    : 'a159a1c079029468e0cc09d6819895e4a6a223c175a941dba715ff2be8f0a5d6';
  assert.equal(createHash('sha256').update(notice.paragraphs.join('\n\n')).digest('hex'), approvedNoticeHash);
  const participation = copy.bookingTerms.clauses.find(clause => clause.id === 'participation');
  assert.equal(participation.title, notice.title);
  assert.deepEqual(participation.paragraphs.slice(1), notice.paragraphs);
  assert.equal(notice.faqItems.length, 9);
  assert.equal(copy.faq.items.filter(item => item.group === 'career').length, 9);
  assert.equal(new Set(notice.faqItems.map(item => item.id)).size, 9);
  assert.ok(notice.faqItems.every(item => item.href === '#career-outcomes-notice'));
  assert.equal(notice.careerSupportSummary, notice.paragraphs[3]);
  assert.equal(notice.experienceSummary, notice.paragraphs[4]);
  assert.equal(notice.serviceCommitmentSummary, notice.paragraphs[5]);
  assert.equal(copy.application.fields.length, 12);
  assert.equal(new Set(copy.application.fields.map(field => field.id)).size, 12);
  assert.equal(copy.bookingTerms.clauses.length, 15);
  assert.equal(new Set(copy.bookingTerms.clauses.map(clause => clause.id)).size, 15);
  assert.equal((copy.application.messageTemplate.match(/^[0-9٠-٩]+- /gm) || []).length, 12);
  assert.ok(copy.application.messageTemplate.includes('\n\n'));
  assert.ok(copy.bookingTerms.acceptanceTemplate.includes('........'));
  assert.ok(copy.application.privacyNotice);
  assert.ok(copy.bookingTerms.refundFormula.perSession.includes(String(p.totalSessions)));
  assert.ok(!/I (?:have read|agree)|قرأت/.test(copy.inquiryMessage));
  for (const pricing of copy.pricing.plans) assert.ok(!/I (?:have read|agree)|قرأت/.test(pricing.inquiryMessage));
  for (const item of copy.faq.items) assert.ok(copy.faq.groups.some(group => group.id === item.group));
  for (const clause of copy.bookingTerms.clauses) assert.ok(clause.paragraphs.every(paragraph => paragraph.trim()));
  for (const stage of copy.curriculum.stages) {
    for (const module of stage.modules) {
      assert.ok(module.title && module.topics.length >= 3, `${locale}: full module topics`);
      assert.ok(module.topics.every(topic => typeof topic === 'string' && topic.trim()), `${locale}: nonempty topics`);
    }
  }
}
assert.equal(diploma.bookingPolicy.refund.calendarDays, 7);
assert.equal(diploma.bookingPolicy.refund.clockStarts, 'request-received');
assert.equal(diploma.bookingPolicy.refund.settlementCutoff, 'request-sent');
assert.equal(diploma.bookingPolicy.latePayment.graceDays, 7);
assert.equal(diploma.bookingPolicy.latePayment.clockStarts, 'installment-due');
assert.equal(diploma.bookingPolicy.latePayment.writtenNoticeRequired, true);
const pdf = fs.readFileSync(path.join(root, diploma.document.url.slice(1)));
assert.equal(pdf.subarray(0,5).toString(), '%PDF-', 'PDF asset signature');
assert.equal(pdf.length, diploma.document.bytes, 'Measured document size');
assert.equal(createHash('sha256').update(pdf).digest('hex'), '13da4522268c2c1f781aa8963f79614218435b9da500ffd855f9feb9e32dc551', 'Original PDF unchanged');
assert.equal(diploma.document.pages, 15);
const html = fs.readFileSync(path.join(root, 'backend-development-diploma/index.html'), 'utf8');
assert.equal((html.match(/class="diploma-stage"/g) || []).length, 8);
assert.equal((html.match(/class="diploma-module"/g) || []).length, 21);
assert.equal((html.match(/class="diploma-project"/g) || []).length, 9);
assert.ok(html.includes('data-offering-status="open"'));
assert.ok(html.includes(`href="${diploma.document.url}" download="${diploma.document.filename}"`));
assert.ok(html.includes(`href="${diploma.document.url}" target="_blank" rel="noopener noreferrer"`));
assert.ok(html.includes('تم فتح باب الحجز'));
assert.ok(!/coming.soon|plannedInstructionHours/.test(html));
assert.equal((html.match(/data-booking-clause=/g) || []).length, 15);
assert.equal((html.match(/data-application-field=/g) || []).length, 12);
for (const id of ['apply','booking-terms','application-privacy','acceptance-message']) {
  assert.ok(html.includes(`id="${id}"`));
}
for (const clause of diploma.translations.ar.bookingTerms.clauses) assert.ok(html.includes(`id="terms-${clause.id}"`));
for (const kind of ['application','bookingTerms']) {
  assert.ok(html.includes(`data-message-template="${kind}"`));
  assert.ok(html.includes(`data-copy-template="${kind}"`));
}
const placements = Array.from(html.matchAll(/data-career-notice="([^"]+)"/g), match => match[1]);
assert.deepEqual(Array.from(html.matchAll(/data-diploma-payment-method="([^"]+)"/g), match => match[1]), ['instapay','vodafone-cash','paypal','western-union','bank-transfer']);
assert.equal((html.match(/id="diploma-payment-methods"/g) || []).length, 1);
assert.ok(html.indexOf('data-career-notice="pricing"') < html.indexOf('id="diploma-payment-methods"'));
for (const [i, method] of diploma.translations.ar.paymentMethods.methods.entries()) {
  assert.ok(html.includes(`data-config-text="paymentMethods.methods.${i}.name">${method.name}</strong>`));
}
for (const key of ['title','description','coordinationNote','contactLabel']) assert.ok(html.includes(`data-config-text="paymentMethods.${key}"`));
assert.ok(html.includes('data-inquiry-key="paymentMethods.inquiryMessage"'));
assert.deepEqual(placements.sort(), ['application','evidence','graduation','hero','pricing']);
assert.equal((html.match(/id="career-outcomes-notice"/g) || []).length, 1);
assert.equal((html.match(/data-career-outcomes-full/g) || []).length, 1);
for (let i = 0; i < 6; i++) {
  assert.equal((html.match(new RegExp(`data-config-text="careerOutcomesNotice\\.paragraphs\\.${i}"`, 'g')) || []).length, 1);
}
for (const placement of placements) assert.ok(html.includes(`aria-labelledby="career-notice-${placement}-label"`));
const allIds = Array.from(html.matchAll(/\bid="([^"]+)"/g), match => match[1]);
assert.equal(new Set(allIds).size, allIds.length, 'Unique saved IDs');
const ids = new Set(Array.from(html.matchAll(/\bid="([^"]+)"/g), match => match[1]));
for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(match[1]), `Anchor target ${match[1]}`);
console.log('PASS: 15 terms / 12 application fields / 56 FAQs, distinct policy clocks, templates and section anchors.');
console.log('PASS: five bilingual payment channels, derived FAQ, localized inquiry and saved Arabic section.');
console.log('PASS: approved six-paragraph clarification, nine outcome FAQs, five notices and one canonical anchor.');
console.log('PASS: Backend workload, payments, 8 stages / 21 modules / 9 projects, locale parity, PDF and saved Arabic fallback.');
