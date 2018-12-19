// @flow strict

// TODO: grab list from server
const addonsToLoad = [
  'xpbar',
  'debug',
  'unit-player',
  'inventory',
  'sw-chat',
  'sw-minimap',
];

const resourceLoaderProvider = Addon => class ResourceLoader {
  addonServerInfo = {
    host: window.location.origin,
  };

  async loadAddon(addonName: string) {
    let manifest = await (await fetch(`${this.addonServerInfo.host}/addons/${addonName}/package.json`)).text();
    manifest = JSON.parse(manifest);
    const addon = new Addon(addonName, manifest);
    await this.loadAddonScripts(addon.name, addon.manifest.main, addon.scriptsNode);
  }

  async loadAddons() {
    return Promise.all(addonsToLoad.map(el => this.loadAddon(el)));
  }

  async loadAddonScripts(addonName: string, bundlePath: string, tag: HTMLElement) {
    const scriptBundle = await (await fetch(`${this.addonServerInfo.host}/addons/${addonName}/${bundlePath}`)).text();
    return new Promise((resolve) => {
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.id = addonName;
      const script = URL.createObjectURL(new Blob([`${scriptBundle}//@ sourceURL=${s.id}`], { type: s.type }));
      s.onload = function onload() {
        URL.revokeObjectURL(script);
        resolve(scriptBundle);
      };
      s.src = script;
      tag.appendChild(s);
    });
  }
};

export default resourceLoaderProvider;
