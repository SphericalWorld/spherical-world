// @flow

// TODO: grab list from server
const addonsToLoad = [
  'xpbar',
  'debug',
  'unit-player',
  'main-panel',
  'inventory',
  'sw-chat',
  'sw-minimap',
];

const resourceLoaderProvider = Addon => class ResourceLoader {
  constructor(network) {
    this.network = network;
  }

  async loadAddon(addonName: string) {
    let manifest = await (await fetch(`${this.network.addonServerInfo.host}/addons/${addonName}/package.json`)).text();
    manifest = JSON.parse(manifest);
    const addon = new Addon(this, addonName, manifest);
    await addon.load();
  }

  async loadAddons() {
    return Promise.all(addonsToLoad.map(el => this.loadAddon(el)));
  }

  async loadAddonScripts(addonName: string, bundlePath: string, tag) {
    const scriptBundle = await (await fetch(`${this.network.addonServerInfo.host}/addons/${addonName}/${bundlePath}`)).text();
    return new Promise((resolve) => {
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.id = addonName;
      const script = URL.createObjectURL(new Blob([`${scriptBundle}//@ sourceURL=${s.id}`], { type: 'text/javascript' }));
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
