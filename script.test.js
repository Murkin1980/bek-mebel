const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const projectRoot = __dirname;
const scriptSource = fs.readFileSync(path.join(projectRoot, "script.js"), "utf8");
const htmlSource = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");
const analyticsStart = scriptSource.indexOf("function trackGoogleAdsLead()");
const analyticsEnd = scriptSource.indexOf("const leadForm", analyticsStart);
const analyticsSource = scriptSource.slice(analyticsStart, analyticsEnd);

function createAnalyticsContext(gtag) {
  const timers = [];
  const context = vm.createContext({
    window: {
      gtag,
      setTimeout(callback) {
        timers.push(callback);
      },
    },
  });
  vm.runInContext(analyticsSource, context);
  return { context, timers };
}

test("the base Google tag is configured once and conversion is not fired on page load", () => {
  assert.equal((htmlSource.match(/googletagmanager\.com\/gtag\/js\?id=AW-18195868385/g) || []).length, 1);
  assert.equal((htmlSource.match(/gtag\('config', 'AW-18195868385'\)/g) || []).length, 1);
  assert.equal(htmlSource.includes("'conversion'"), false);
});

test("Google Ads lead event has the exact destination and no personal data", () => {
  const calls = [];
  const { context } = createAnalyticsContext((...args) => calls.push(args));

  context.trackGoogleAdsLead();

  assert.equal(calls.length, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(calls[0])), [
    "event",
    "conversion",
    { send_to: "AW-18195868385/i839CLP7obUcEOHVu-RD" },
  ]);
});

test("lead tracking is fail-open when gtag is unavailable", () => {
  const { context } = createAnalyticsContext(undefined);
  assert.doesNotThrow(() => context.trackGoogleAdsLead());
});

test("submission guard blocks duplicate handlers during the safety window", () => {
  const { context, timers } = createAnalyticsContext(undefined);
  const control = {};

  assert.equal(context.beginLeadSubmission(control), true);
  assert.equal(context.beginLeadSubmission(control), false);
  context.finishLeadSubmission(control);
  assert.equal(timers.length, 1);
  timers[0]();
  assert.equal(context.beginLeadSubmission(control), true);
});

test("only the three validated lead flows invoke conversion tracking", () => {
  assert.equal((scriptSource.match(/trackGoogleAdsLead\(\);/g) || []).length, 3);
  assert.equal(scriptSource.includes("whatsapp-click"), false);
  assert.equal(scriptSource.includes("AW-16661568302"), false);
});
