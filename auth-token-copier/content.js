async function writeToken() {
  console.log("[Auth Token Copier] Token written to local storage");
  const { token, destUrl, lStorKey } = await browser.storage.local.get(["token", "destUrl", "lStorKey"]);
  if (token && destUrl) {
    const currUrl = window.location.href;
    const destUrlRegex = new RegExp(destUrl
      .split("*")
      .map(s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
      .join(".*"));
    if (destUrlRegex.test(currUrl)) {
      localStorage.setItem(lStorKey, token);
    }
  }
}

async function main() {
  const { mode } = await browser.storage.local.get("mode");
  if (mode === "auto") writeToken();
}

main();

browser.runtime.onMessage.addListener(async message => {
  if (message.command === "update-lstor") writeToken();
});
