async function main() {
  const { token, destUrl, lStorKey } = await browser.storage.local.get(["token", "destUrl", "lStorKey"]);
  if (token && destUrl) {
    const currOrigin = new URL(window.location.href).origin;
    const destOrigin = new URL(destUrl).origin;
    if (currOrigin === destOrigin) {
      localStorage.setItem(lStorKey, token);
    }
  }
}

main();

browser.runtime.onMessage.addListener(async message => {
  if (message.command === "update-lstor") main();
});
