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
  ["read-btn", "write-btn", "copy-btn"].forEach(id => document.getElementById(id).disabled = isOff);
}

function updateMode(mode) {
  if (mode === "manual") setMode("auto");
  else if (mode === "off") setMode("manual");
  else setMode("off");
}

document.getElementById("mode-btn").addEventListener("click", async () => {
  const { mode } = await browser.storage.local.get("mode");
  updateMode(mode);
});

document.getElementById("src-url").addEventListener("input", async (event) => {
  const srcUrl = event.target.value;
  await browser.storage.local.set({ srcUrl });
});

document.getElementById("dest-url").addEventListener("input", async (event) => {
  const destUrl = event.target.value;
  await browser.storage.local.set({ destUrl });
});

globalThis.addEventListener("load", async () => {
  const storage = await browser.storage.local.get();
  setMode(storage.mode);
  document.getElementById("src-url").value = storage.srcUrl || "";
  document.getElementById("dest-url").value = storage.dstUrl || "";
});
