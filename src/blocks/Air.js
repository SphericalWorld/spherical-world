// @flow
import Block from './Block';

const Air = () => Block({
  id: 0,
  lightTransparent: true,
  sightTransparent: true,
  selfTransparent: true,
  needPhysics: false,
});

export default Air;
