// @flow strict
const addonProvider = store => class Addon {
  name: string;
  mainNode: HTMLElement = document.createElement('div');

  constructor(addonName: string, manifest) {
    this.name = addonName;
    this.manifest = manifest;
    this.loaded = true;
    this.mainNode.setAttribute('id', `addon-${this.name}`);

    const node = document.getElementById('addons');
    if (!node) {
      throw new Error('node not found');
    }
    node.appendChild(this.mainNode);
  }

  removeFromGame() {

  }
};

export default addonProvider;
