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
  constructor(app) {
    this.network = app.network;
    this.app = app;
    Addon.exportExternals();
  }

  async loadAddon(addonName: string) {
    let manifest = await (await fetch(`${this.network.addonServerInfo.host}/addons/${addonName}/package.json`)).text();
    manifest = JSON.parse(manifest);
    const addon = new Addon(this.app, addonName, manifest);
    await addon.load();
  }

  async loadAddons() {
    return Promise.all(addonsToLoad.map(el => this.loadAddon(el)));
  }

  async loadAddonScripts(addonName: string, scripts, tag) {
    const indexFile = await (await fetch(`${this.network.addonServerInfo.host}/addons/${addonName}/${scripts}`)).text();
    return new Promise((resolve) => {
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.id = addonName;
      const script = URL.createObjectURL(new Blob([`${indexFile}//@ sourceURL=${s.id}`], { type: 'text/javascript' }));
      s.onload = function onload() {
        URL.revokeObjectURL(script);
        resolve(indexFile);
      };
      s.src = script;
      tag.appendChild(s);
    });
  }
};

export default resourceLoaderProvider;
