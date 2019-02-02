[![codebeat badge](https://codebeat.co/badges/d20af41a-34c8-4eae-888c-f26d340e59cc)](https://codebeat.co/projects/github-com-sphericalworld-spherical-world-master)
[![Maintainability](https://api.codeclimate.com/v1/badges/84f406944af6cb051ff7/maintainability)](https://codeclimate.com/github/SphericalWorld/spherical-world/maintainability)
[![devDependencies Status](https://david-dm.org/SphericalWorld/spherical-world/dev-status.svg)](https://david-dm.org/SphericalWorld/spherical-world?type=dev)
[![dependencies Status](https://david-dm.org/SphericalWorld/spherical-world/status.svg)](https://david-dm.org/SphericalWorld/spherical-world)
[![CircleCI](https://circleci.com/gh/SphericalWorld/spherical-world.svg?style=svg)](https://circleci.com/gh/SphericalWorld/spherical-world)

# Spherical World
This project is an attempt to create voxel-based game in pure javascript. It was resurrected after 4 years of inactivity and right now under heavy refactorings.

## Requirements
Latest NodeJS, Latest Chrome/Firefox, Latest Docker

## Running
### Server
```bash
npm run start-server
```

linux users may need to run docker under sudo:

```bash
sudo npm run start-server
```

`nvm` is not working with `sudo` out of the box, if you use `nvm` to manage your `node` versions, you may need to apply this workaround to make `nvm` compatible with `sudo`:
```bash
n=$(which node);n=${n%/bin/node}; chmod -R 755 $n/bin/*; sudo cp -r $n/{bin,lib,share} /usr/local
```
### Client
`npm start`

## License
Source code provided under [MIT license](LICENSE)

It also use textures created by David Stridh Andersson, under [CC BY license](https://creativecommons.org/licenses/by/2.0/) https://www.planetminecraft.com/texture_pack/davids-drawn-64x64-texturepack/
It also use textures created by Soar49, under [Public domain](https://soartex.net/license/)
http://dl.soartex.net/q7ui6
