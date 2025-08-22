import "./browser-polyfill.min.js";

async function saveToken(details) {
  const origToken = details.requestHeaders.find(header => header.name.toLowerCase() === "authorization")?.value.replace(/^Bearer /, "") || "";
  const { regexFind, regexReplace } = await browser.storage.local.get(["regexFind", "regexReplace"]);
  const token = regexFind
    ? origToken.replace(new RegExp(regexFind), regexReplace)
    : origToken;
  browser.storage.local.set({ token, origToken });
  browser.runtime.sendMessage({ command: "update-token-ui" });
  const tabs = await browser.tabs.query({});
  for (const tab of tabs) {
    browser.tabs.sendMessage(tab.id, { command: "update-lstor" });
  }
}

async function regListener() {
  const { srcUrl, mode } = await browser.storage.local.get();
  browser.webRequest.onBeforeSendHeaders.removeListener(saveToken);
  if (mode === "off") return;
  if (srcUrl) {
    browser.webRequest.onSendHeaders.addListener(
      saveToken,
      { urls: [srcUrl] },
      ["requestHeaders"]
    );
  }
}
    
browser.runtime.onInstalled.addListener(async details => {
  const { srcUrl, destUrl, lStorKey, regexFind, regexReplace, token, origToken, mode } = await browser.storage.local.get();
  await browser.storage.local.set({
    srcUrl: srcUrl || "",
    destUrl: destUrl || "",
    lStorKey: lStorKey || "token",
    regexFind: regexFind || "",
    regexReplace: regexReplace || "",
    token: token || "",
    origToken: origToken || "",
    mode: mode || "off"
  });
});

browser.runtime.onMessage.addListener(async message => {
  if (message.command === "reg-listener") regListener();
  return true;
});


