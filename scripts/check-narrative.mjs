/** Browser regression checks against a built static export. Start Chrome with --remote-debugging-port=9229. */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const base = process.argv[2] ?? "http://localhost:3031/";
const tabs = await (await fetch("http://127.0.0.1:9229/json")).json();
const socket = new WebSocket(tabs.find((tab) => tab.type === "page").webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
let id = 0;
const pending = new Map();
const errors = [];
socket.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.text);
  if (message.method === "Log.entryAdded" && message.params.entry.level === "error") errors.push(message.params.entry.text);
  const handler = pending.get(message.id);
  if (handler) { pending.delete(message.id); handler(message); }
};
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const key = ++id;
  pending.set(key, (message) => message.error ? reject(new Error(JSON.stringify(message.error))) : resolve(message.result));
  socket.send(JSON.stringify({ id: key, method, params }));
});
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const evaluate = async (expression) => {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  return result.result.value;
};
async function waitFor(expression) {
  for (let count = 0; count < 80; count++) {
    if (await evaluate(expression)) return;
    await pause(100);
  }
  throw new Error(`Timeout: ${expression}`);
}
async function check(name, expression) { assert.ok(await evaluate(expression), name); console.log(`PASS ${name}`); }
async function navigate(url) { await send("Page.navigate", { url }); await pause(500); await waitFor("document.readyState === 'complete'"); }
async function key(key, shift = false) {
  const windowsVirtualKeyCode = { Enter: 13, Escape: 27, Tab: 9, Home: 36, ArrowDown: 40 }[key];
  await send("Input.dispatchKeyEvent", { type: "keyDown", key, code: key, windowsVirtualKeyCode, nativeVirtualKeyCode: windowsVirtualKeyCode, text: key === "Enter" ? "\r" : undefined, modifiers: shift ? 8 : 0 });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key, code: key, windowsVirtualKeyCode });
}
async function snapshot(name) {
  const result = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  fs.writeFileSync(path.join(os.tmpdir(), `portfolio-v3-${name}.png`), Buffer.from(result.data, "base64"));
}
async function mode(motion, graphics = "balanced") {
  await evaluate(`localStorage.setItem('portfolio-game-preferences',JSON.stringify({theme:'dark',motion:${JSON.stringify(motion)},graphics:${JSON.stringify(graphics)},sound:false}));window.dispatchEvent(new Event('portfolio-preferences-change'))`);
  await pause(150);
}
async function scrollScene(selector, progress) {
  await evaluate(`(() => {const scene=document.querySelector(${JSON.stringify(selector)});const stage=scene.firstElementChild;const top=parseFloat(getComputedStyle(stage).top)||0;scrollTo({top:scrollY+scene.getBoundingClientRect().top-top+(scene.offsetHeight-stage.offsetHeight)*${progress},behavior:'instant'});})()`);
  await pause(500);
}
async function start() {
  await waitFor("!!document.querySelector('.main-menu-buttons')");
  await pause(150);
  await evaluate("document.querySelector('.game-menu-button-primary').click()");
  await waitFor("!document.querySelector('.main-menu-root')");
  await pause(250);
}

try {
  await send("Page.enable"); await send("Runtime.enable"); await send("Log.enable");
  await send("Page.bringToFront");
  await send("Emulation.setFocusEmulationEnabled", { enabled: true });
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send("Emulation.setTouchEmulationEnabled", { enabled: false });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
  await navigate(base);
  await evaluate("localStorage.clear()");
  await navigate(base);
  await waitFor("!!document.querySelector('.main-menu-buttons')");
  await pause(250);
  await check("menu traps page content", "document.querySelector('main').inert && document.querySelector('.main-menu-root').contains(document.activeElement)");
  await evaluate("document.querySelector('.game-menu-button-primary').click()");
  await pause(350);
  await check("world loading before spawn", "document.querySelector('.main-menu-root')?.dataset.state === 'entering' && document.querySelector('.world-loading').innerText.includes('Generating')");
  await waitFor("!document.querySelector('.main-menu-root')");
  await pause(700);
  await check("spawn focus and server content", "document.activeElement.id === 'hero-title' && !document.querySelector('main').inert && document.querySelector('.spawn-hud').innerText.includes('Software Developer')");
  await snapshot("spawn-desktop");
  await mode("full");
  for (const [index, progress] of [0.28, 0.48, 0.68, 0.88].entries()) {
    await scrollScene("[data-project-story]", progress);
    await check(`quest ${index + 1} selected`, `document.querySelector('[data-quest="${index}"]').dataset.active === 'true' && getComputedStyle(document.querySelector('[data-quest="${index}"]')).visibility === 'visible'`);
    await check(`quest ${index + 1} fits stage`, `(() => {const quest=document.querySelector('[data-quest="${index}"]');const stage=document.querySelector('[data-project-story]').firstElementChild;return quest.querySelector('a').getBoundingClientRect().bottom < stage.getBoundingClientRect().bottom-50;})()`);
    if (index === 0) await snapshot("quest-desktop");
  }
  await check("bounded project narrative", "document.querySelector('[data-project-story]').offsetHeight <= innerHeight * 3");
  await send("Emulation.setDeviceMetricsOverride", { width: 1024, height: 820, deviceScaleFactor: 1, mobile: false });
  await evaluate("document.querySelector('.language-toggle button:last-child').click()");
  await pause(300);
  for (const [index, progress] of [0.28, 0.48, 0.68, 0.88].entries()) {
    await scrollScene("[data-project-story]", progress);
    await check(`small desktop ID quest ${index + 1} fits`, `(() => {const quest=document.querySelector('[data-quest="${index}"]');const stage=document.querySelector('[data-project-story]').firstElementChild;return quest.querySelector('a').getBoundingClientRect().bottom < stage.getBoundingClientRect().bottom-50;})()`);
  }
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await evaluate("document.querySelector('.language-toggle button:first-child').click()");
  await pause(300);
  await evaluate("document.querySelector('[data-project-story] button[aria-label]').focus()");
  await key("Enter");
  await pause(500);
  await waitFor("document.querySelector('[data-quest=" + '"0"' + "]').dataset.active === 'true'");
  await evaluate("document.activeElement.blur()");
  for (const [index, progress] of [0.1, 0.5, 0.9].entries()) {
    await scrollScene("[data-journey-story]", progress);
    await check(`journey node ${index + 1}`, `document.querySelectorAll('.experience-timeline button')[${index}].getAttribute('aria-selected') === 'true'`);
  }
  await snapshot("journey-desktop");
  await evaluate("document.querySelector('.experience-timeline button[aria-selected=true]').focus()");
  await key("Home");
  await check("journey keyboard Home", "document.activeElement.id === 'experience-tab-kandu'");
  await evaluate("document.activeElement.blur();document.querySelector('#skills').scrollIntoView({behavior:'instant'})");
  await pause(300);
  await evaluate("document.querySelector('.capability-tabs button').focus()");
  await key("ArrowDown");
  await check("inventory keyboard navigation", "document.activeElement.id === 'capability-tab-backend-data'");
  await evaluate("document.querySelector('#capability-tab-web-development').click();document.querySelector('#capability-panel-web-development .inventory-item summary').click()");
  await check("skill evidence linked to project", "!!document.querySelector('#capability-panel-web-development .inventory-item details[open] a[href*=kandu]')");
  await evaluate("document.querySelector('#achievements').scrollIntoView({behavior:'instant'})");
  await waitFor("!!document.querySelector('.story-milestone[data-discovered=true]')");
  await evaluate("document.querySelector('#contact').scrollIntoView({behavior:'instant'})");
  await pause(500);
  await snapshot("portal-desktop");
  const originalY = await evaluate("scrollY");
  await evaluate("document.querySelector('.world-actions button').focus();document.querySelector('.world-actions button').click()");
  await waitFor("!!document.querySelector('.main-menu-root')");
  await check("reopen does not restart intro", "document.querySelector('.main-menu-root').dataset.entry === 'return'");
  await evaluate("document.querySelector('.game-menu-button-primary').click()");
  await waitFor("!document.querySelector('.main-menu-root') && document.activeElement.matches('.world-actions button')");
  await check("menu restores focus and position", `!document.querySelector('.main-menu-root') && document.activeElement.matches('.world-actions button') && Math.abs(scrollY-${originalY}) < 2`);

  await evaluate("document.querySelector('[data-project-story] button[aria-controls=project-gallery]').click()");
  await waitFor("document.querySelector('#project-gallery').dataset.expanded === 'true'");
  await pause(800);
  await evaluate("[...document.querySelectorAll('.filter-list button')].find(b=>b.innerText==='Automation').click()");
  await pause(650);
  await check("filter and aria-live", "document.querySelectorAll('.projects-grid .project-card').length===2 && !!document.querySelector('#project-gallery [aria-live=polite]')");
  await evaluate("document.querySelector('.quick-view-button').focus();document.querySelector('.quick-view-button').click()");
  await waitFor("document.querySelector('.quick-view-dialog').open");
  await key("Tab", true);
  await check("quick view focus remains trapped", "document.querySelector('.quick-view-dialog').contains(document.activeElement)");
  await key("Escape"); await pause(250);
  await check("quick view Escape restores focus", "!document.querySelector('.quick-view-dialog').open && document.activeElement.matches('.quick-view-button')");
  await evaluate("document.querySelector('.quick-view-button').click()");
  await waitFor("document.querySelector('.quick-view-dialog').open");
  await send("Input.dispatchMouseEvent", { type: "mousePressed", x: 4, y: 4, button: "left", clickCount: 1 });
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: 4, y: 4, button: "left", clickCount: 1 });
  await pause(250);
  await check("quick view outside click", "!document.querySelector('.quick-view-dialog').open");
  await evaluate("document.querySelector('.nav-expand-button')?.click()"); await pause(250);
  await evaluate("document.querySelector('.command-trigger').focus();document.querySelector('.command-trigger').click()");
  await waitFor("document.querySelector('.command-dialog').open");
  await check("command palette focus", "document.activeElement.matches('.command-search input')");
  await key("Escape"); await pause(250);
  await evaluate("document.querySelector('.project-card a[href*=\"/projects/kandu\"]').click()");
  await waitFor("location.pathname.replace(/\\/$/,'').endsWith('/projects/kandu') && !!document.querySelector('.case-study')");
  await pause(900);
  await check("case study metadata and image", "document.title.includes('KandU') && !!document.querySelector('.case-cover img') && !!document.querySelector('script[type=\"application/ld+json\"]')");
  await evaluate("history.back()");
  await waitFor("!!document.querySelector('[data-project-story]') && !document.querySelector('.main-menu-root')");
  await waitFor("document.querySelector('#project-gallery').dataset.expanded === 'true'");
  await check("back restores browsing context", "location.hash==='#project-gallery'");
  await evaluate("history.forward()");
  await waitFor("!!document.querySelector('.case-study')");
  await navigate(new URL("projects/greenpoint/", base).href);
  await waitFor("!!document.querySelector('.case-study')");
  await check("direct project URL skips menu", "!document.querySelector('.main-menu-root') && document.title.includes('GreenPoint')");
  await navigate(base); await start();
  for (const motion of ["reduced", "minimal", "off"]) {
    await mode(motion);
    await check(`${motion} keeps every quest and experience readable`, "[...document.querySelectorAll('[data-quest],.experience-detail-panels article')].every(el=>getComputedStyle(el).display!=='none' && getComputedStyle(el).visibility==='visible') && getComputedStyle(document.querySelector('[data-project-story]').firstElementChild).position!=='sticky'");
  }
  await mode("full", "low");
  await check("low graphics static fallback", "getComputedStyle(document.querySelector('[data-project-story]').firstElementChild).position!=='sticky'");
  await mode("full");
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await waitFor("document.documentElement.dataset.motion==='reduced'");
  await check("OS preference overrides saved full", "getComputedStyle(document.querySelector('[data-project-story]').firstElementChild).position!=='sticky'");
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send("Emulation.setTouchEmulationEnabled", { enabled: true });
  await navigate(base); await start();
  await check("mobile static and no horizontal overflow", "document.documentElement.scrollWidth<=innerWidth && getComputedStyle(document.querySelector('[data-project-story]').firstElementChild).position!=='sticky'");
  await evaluate("document.querySelector('.language-toggle button:last-child').click()");
  await pause(200);
  await check("Indonesian content and CV", "document.documentElement.lang==='id' && document.querySelector('.hero-actions [data-cv-language=id]').getClientRects().length>0 && document.querySelector('#experience-title').innerText.includes('Pengalaman')");
  await evaluate("document.querySelector('#work').scrollIntoView({behavior:'instant'})"); await pause(500); await snapshot("mobile-id");
  await evaluate("document.querySelector('.language-toggle button:first-child').click()");
  await check("English CV", "document.documentElement.lang==='en' && document.querySelector('.hero-actions [data-cv-language=en]').getClientRects().length>0");
  await evaluate("document.querySelector('button[title=\"Switch color theme\"]').click()");
  await pause(600);
  await check("theme toggle", "document.documentElement.dataset.theme==='light'");
  await check("light theme text is dark", "getComputedStyle(document.querySelector('#work-title')).color.match(/\\d+/g).slice(0,3).map(Number).every(channel=>channel<120)");
  await snapshot("mobile-light");
  assert.deepEqual(errors, [], "No browser runtime/network errors");
  console.log("PASS browser runtime and network console clean");
} finally { socket.close(); }
