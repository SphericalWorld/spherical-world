// @flow strict
import {
  BlockRemover as BlockRemoverComponent, Transform, Visual, Joint,
} from '../components/react';
import { React, GameObject, type Entity } from '../../common/ecs';
import { createCube } from '../engine/Model';
import { materialLibrary, GlObject } from '../engine';

type Props = {|
  +parent: Entity;
|};

export const BlockRemover = ({ parent }: Props) => {
  const model = createCube(1.001, false, false, [0.5, 0.5, 0.5]);
  const material = materialLibrary.get('blockRemover');
  const object = new GlObject({ model, material });

  return (
    <GameObject>
      <Transform />
      <Visual object={object} />
      <BlockRemoverComponent />
      <Joint parent={parent} />
    </GameObject>
  );
};
