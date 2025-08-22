import "./browser-polyfill.min.js";

function setMode(mode) {
  if (mode === "auto") {
    browser.storage.local.set({ mode: "auto" });
    document.getElementById("ext-status").innerHTML = "AUTO";
  }
  else if (mode === "manual") {
    browser.storage.local.set({ mode: "manual" });
    document.getElementById("ext-status").innerHTML = "MANUAL";
  }
  else {
    browser.storage.local.set({ mode: "off" });
    document.getElementById("ext-status").innerHTML = "OFF";
  }

  const isOff = (mode === "off");
  document.body.classList.toggle("off", isOff);
  document.getElementById("ext-status").style.color = isOff ? "#A00" : "#0A0";
  document.getElementById("token").disabled = !isOff;
}

function updateMode(mode) {
  if (mode === "manual") setMode("auto");
  else if (mode === "off") setMode("manual");
  else setMode("off");
}

async function applyRegex() {
  const { origToken, regexFind, regexReplace, mode } = await browser.storage.local.get(["origToken", "regexFind", "regexReplace", "mode"]);
  if (mode === "off") return;
  const token = regexFind
    ? origToken.replace(new RegExp(regexFind), regexReplace)
    : origToken;
  document.getElementById("token").value = token;
  await browser.storage.local.set({ token });
}

document.getElementById("mode-btn").addEventListener("click", async () => {
  const { mode } = await browser.storage.local.get("mode");
  updateMode(mode);
});

document.getElementById("src-url").addEventListener("input", async event => {
  const srcUrl = event.target.value;
  await browser.storage.local.set({ srcUrl });
  browser.runtime.sendMessage({ command: "reg-listener" });
});

document.getElementById("dest-url").addEventListener("input", async event => {
  const destUrl = event.target.value;
  await browser.storage.local.set({ destUrl });
  browser.runtime.sendMessage({ command: "reg-listener" });
});

document.getElementById("regex-find").addEventListener("input", async event => {
  const regexFind = event.target.value;
  await browser.storage.local.set({ regexFind });
  applyRegex();
});

document.getElementById("regex-replace").addEventListener("input", async event => {
  const regexReplace = event.target.value;
  await browser.storage.local.set({ regexReplace });
  applyRegex();
});

document.getElementById("token").addEventListener("input", async event => {
  const token = event.target.value;
  await browser.storage.local.set({ token });
});

document.getElementById("copy-btn").addEventListener("click", async () => {
  const token = document.getElementById("token").value;
  await navigator.clipboard.writeText(token);
});

document.getElementById("about-btn").addEventListener("click", () => {
  document.getElementById("main-page").style.display = "none";
  document.getElementById("about-page").style.display = "flex";
});

document.getElementById("about-back-btn").addEventListener("click", () => {
  document.getElementById("main-page").style.display = "flex";
  document.getElementById("about-page").style.display = "none";
});

globalThis.addEventListener("load", async () => {
  const { srcUrl, destUrl, regexFind, regexReplace, token, mode } = await browser.storage.local.get();
  setMode(mode);
  document.getElementById("src-url").value = srcUrl || "";
  document.getElementById("dest-url").value = destUrl || "";
  document.getElementById("regex-find").value = regexFind || "";
  document.getElementById("regex-replace").value = regexReplace || "";
  document.getElementById("token").value = token || "";
});

browser.runtime.onMessage.addListener(async message => {
  if (message.command === "update-token-ui") {
    const { token } = await browser.storage.local.get("token");
    document.getElementById("token").value = token || "";
    document.getElementById("msg").innerText = "Token updated @ " + new Date().toLocaleTimeString();
  }
});
