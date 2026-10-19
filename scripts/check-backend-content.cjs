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
  assert.equal(copy.faq.items.length, 47);
  assert.equal(copy.faq.groups.length, 4);
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
const ids = new Set(Array.from(html.matchAll(/\bid="([^"]+)"/g), match => match[1]));
for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(match[1]), `Anchor target ${match[1]}`);
console.log('PASS: 15 terms / 12 application fields / 47 FAQs, distinct policy clocks, templates and section anchors.');
console.log('PASS: Backend workload, payments, 8 stages / 21 modules / 9 projects, locale parity, PDF and saved Arabic fallback.');
