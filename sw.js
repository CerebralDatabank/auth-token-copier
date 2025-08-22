import "./browser-polyfill.min.js";

browser.runtime.onInstalled.addListener(async details => {
  console.log("Extension installed");
  if (true) {
    await browser.storage.local.set({
      srcUrl: "",
      dstUrl: "",
      token: "",
      mode: true
    });
  }
});

browser.runtime.onMessage.addListener(async message => {
  if (message.command === "update-storage") {
    const options = await browser.storage.local.get(["options"]);
    const token = await browser.storage.local.get(["token"]);
    console.log(options, token);
  }
  return true;
});
