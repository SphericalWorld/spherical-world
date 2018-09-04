// @flow
const addonProvider = store => class Addon {
  name: string;
  mainNode: HTMLElement = document.createElement('div');

  constructor(addonName: string, manifest) {
    this.name = addonName;
    this.manifest = manifest;
    this.loaded = true;
    this.mainNode.setAttribute('id', `addon-${this.name}`);

    this.scriptsNode = document.createElement('div');

    this.mainNode.appendChild(this.scriptsNode);

    document.getElementById('addons').appendChild(this.mainNode);
  }

  removeFromGame() {

  }
};

export default addonProvider;
