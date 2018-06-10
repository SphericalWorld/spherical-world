// @flow
const addonProvider = store => class Addon {
  constructor(resourceLoader, addonName, manifest) {
    this.name = addonName;
    this.manifest = manifest;
    this.loaded = true;
    this.resourceLoader = resourceLoader;
    this.mainNode = document.createElement('div');
    this.mainNode.setAttribute('id', `addon-${this.name}`);

    this.scriptsNode = document.createElement('div');
    this.scriptsNode.setAttribute('id', `addon-scripts-${this.name}`);

    this.mainNode.appendChild(this.scriptsNode);

    document.getElementById('addons').appendChild(this.mainNode);
  }

  async load() {
    await this.resourceLoader.loadAddonScripts(this.name, this.manifest.main, this.scriptsNode);
  }

  removeFromGame() {

  }
};

export default addonProvider;
