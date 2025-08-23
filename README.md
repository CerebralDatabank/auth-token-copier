# Auth Token Copier

This extension copies the authentication token from the source URL's network headers and stores it in the destination URL's local storage.

It is intended for use in development environments where the locally hosted development server needs an authentication token from a live environment.

## Installation

First, go to `chrome://extensions` in Chrome/Edge and enable "Developer mode".

After that, there are two ways of installing:

- Download the `.zip` file from the [latest release](https://github.com/CerebralDatabank/auth-token-copier/releases/latest) and unzip it. Click "Load unpacked" to select the unzipped folder.
  - Make sure you choose the folder that contains the `manifest.json` file.
- Download the `.crx` file from the latest release. Then, go to `chrome://extensions` and drag the `.crx` file onto the page to install it.
  - You may need to run the provided `enable-install.reg` file first and restart Chrome/Edge to allow installation of these extensions since they are from outside the Chrome Web Store.  
    *Note: the `enable-install.reg` file sets registry entries for Chrome and Edge only.*
  - See [here](https://superuser.com/questions/767286/re-enable-extensions-not-coming-from-chrome-web-store-on-chrome-v35-with-enhan) for more details.
