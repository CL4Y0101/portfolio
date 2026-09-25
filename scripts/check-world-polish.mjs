// QA tools live outside the portfolio: npm install --prefix <tools-dir> playwright @axe-core/playwright
// node scripts/check-world-polish.mjs <tools-dir> [base-url]
import { createRequire } from "node:module";
import path from "node:path";
import os from "node:os";
import assert from "node:assert/strict";

if (!process.argv[2]) throw new Error("Pass the external QA tools directory");
const require = createRequire(path.resolve(process.argv[2], "package.json"));
const { chromium, firefox, webkit } = require("playwright");
const { default: AxeBuilder } = require("@axe-core/playwright");
const base = process.argv[3] ?? "http://localhost:3031/";
const failures = [];

for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
  const browser = await engine.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "no-preference", colorScheme: "dark" });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.setDefaultNavigationTimeout(25000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const check = async (label, expression) => { assert.ok(await page.evaluate(expression), `${name}: ${label}`); console.log(`PASS ${name}: ${label}`); };
  const axe = async (label) => {
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const violations = result.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })) }));
    if (violations.length) { console.log(JSON.stringify({ browser: name, label, violations }, null, 2)); failures.push(`${name}: ${label} accessibility`); }
    else console.log(`PASS ${name}: ${label} axe WCAG A/AA`);
  };
  try {
    await page.goto(base);
    await page.locator("body.game-menu-open").waitFor();
    await axe("menu");
    await page.locator(".main-menu-buttons .game-menu-button-primary").click();
    await page.locator(".main-menu-root").waitFor({ state: "detached" });
    await page.waitForTimeout(800);
    const semantics = await page.locator("main").ariaSnapshot();
    assert.ok(semantics.includes('heading "Aditya Fadni Athaullah"') && semantics.includes('link "Download CV"'), `${name}: heading and CV exposed to accessibility tree`);
    await page.locator("[data-project-story] button[aria-label]").first().click();
    await page.waitForFunction(() => document.querySelector("[data-project-story]").dataset.phase === "quest");
    await check("professional world", () => document.querySelector("[data-project-story]").dataset.projectWorld === "terrain");
    await page.locator("[data-project-story] button[aria-label]").nth(3).click();
    await page.waitForFunction(() => document.querySelector("[data-project-story]").dataset.projectWorld === "workshop");
    await check("finite particles", () => getComputedStyle(document.querySelector("[data-project-story] .world-atmosphere-particles i")).animationIterationCount === "1");
    await page.waitForTimeout(450);
    await page.screenshot({ path: path.join(os.tmpdir(), `portfolio-world-${name}.png`) });
    await axe("project quest dark");
    await page.locator("[data-project-story] button[aria-controls=project-gallery]").click();
    await page.locator("#project-gallery").waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Automation", exact: true }).click();
    await page.waitForFunction(() => document.querySelector("#project-gallery").dataset.projectWorld === "signal");
    await page.waitForTimeout(700);
    await page.locator(".quick-view-button").first().click();
    await page.locator(".quick-view-dialog[open]").waitFor();
    await axe("quick view");
    await page.keyboard.press("Escape");
    await page.locator(".quick-view-dialog").waitFor({ state: "hidden" });

    await page.evaluate(() => {
      window.__coverStates = [];
      new MutationObserver(() => window.__coverStates.push(document.documentElement.dataset.sharedCover ?? "done")).observe(document.documentElement, { attributes: true, attributeFilter: ["data-shared-cover"] });
    });
    await page.locator(".project-card .project-media").first().click();
    await page.locator(".case-cover").waitFor();
    await page.waitForFunction(() => !document.documentElement.dataset.sharedCover);
    await check("shared cover completed and cleaned", () => window.__coverStates.includes("animating") && !document.querySelector(".shared-project-cover") && !document.querySelector("[data-cover-in-flight]"));
    await page.goBack();
    await page.locator("#project-gallery[data-expanded=true]").waitFor();
    await page.goForward();
    await page.locator(".case-cover").waitFor();
    const priorFlights = await page.evaluate(() => window.__coverStates.filter((state) => state === "animating").length);
    await page.locator(".case-cta .button-primary").click();
    await page.waitForURL(/projects\/greenpoint\/?$/);
    await page.waitForFunction(() => !document.querySelector(".shared-project-cover") && !document.querySelector("[data-cover-in-flight]"), undefined, { timeout: 3000 });
    await check("next cover transition cleanup", () => !document.querySelector(".shared-project-cover") && !document.querySelector("[data-cover-in-flight]"));
    assert.ok(await page.evaluate((count) => window.__coverStates.filter((state) => state === "animating").length > count, priorFlights), `${name}: next-project cover actually animates`);
    await page.locator(".case-cta .button-primary").click();
    await page.goBack();
    await page.waitForTimeout(1900);
    await check("rapid back cancels stale cover", () => !document.querySelector(".shared-project-cover") && !document.querySelector("[data-cover-in-flight]"));
    await page.goto(new URL("projects/ytmusic-esp32/", base).href);
    await page.locator(".case-study").waitFor();
    await check("direct URL world", () => document.querySelector(".case-study").dataset.projectWorld === "workshop");
    await page.waitForTimeout(800);
    await axe("case study dark");
    await page.goto(base);
    await page.locator(".main-menu-buttons .game-menu-button-primary").click();
    await page.locator(".main-menu-root").waitFor({ state: "detached" });
    await page.waitForTimeout(800);
    await page.locator(".nav-controls button[title='Switch color theme']").click();
    await page.waitForTimeout(400);
    await axe("homepage light");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForFunction(() => document.documentElement.dataset.motion === "reduced");
    await check("reduced particles disabled", () => getComputedStyle(document.querySelector(".world-atmosphere-particles")).display === "none");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator(".language-toggle button").last().click();
    await page.locator("#work").scrollIntoViewIfNeeded();
    await check("mobile no overflow", () => document.documentElement.scrollWidth <= innerWidth);
    await axe("mobile Indonesian reduced light");
    await page.locator("[data-quest='0'] a").click();
    await page.locator(".case-study").waitFor();
    await check("reduced navigation no clone", () => !document.querySelector(".shared-project-cover"));
    const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: "no-preference" });
    const touchPage = await touch.newPage();
    await touchPage.goto(new URL("projects/kandu/", base).href);
    await touchPage.locator(".case-study").waitFor();
    assert.ok(await touchPage.evaluate(() => matchMedia("(pointer: coarse)").matches && getComputedStyle(document.querySelector(".world-atmosphere-particles")).display === "none"), `${name}: touch disables particles`);
    console.log(`PASS ${name}: touch input fallback`);
    await touch.close();
    assert.deepEqual(errors, [], `${name}: runtime errors`);
    console.log(`PASS ${name}: runtime console clean`);
  } catch (error) { console.error(`${name}: ${error.stack}`); failures.push(`${name}: ${error.message}`); }
  finally { await browser.close(); }
}
assert.deepEqual(failures, [], "Cross-browser QA failures");
