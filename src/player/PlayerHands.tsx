import { vec3, quat } from 'gl-matrix';
import type { Entity } from '../../common/ecs';
import { Transform, Visual, Joint, Script } from '../components/react';
import { React, GameObject } from '../../common/ecs';
import { materialLibrary, GlObject } from '../engine';
import { createModelFromSprite } from '../engine/Model/ModelFromSprite';
import { blocksInfo } from '../blocks/blockInfo';
import { WorldMainThread, GameEvent } from '../Events';

type Props = Readonly<{
  parent: Entity;
}>;

class PlayerScript extends Script {
  start(world: WorldMainThread) {
    world.events
      .filter((e) => e.type === GameEvent.itemSelected && e)
      .subscribe((data) => {
        const model = data.payload ? blocksInfo[data.payload?.itemTypeId]?.asItem : null;
        const visual = this.gameObject.get('visual');
        if (model) {
          visual.glObject.model = model;
          visual.enabled = true;
        } else {
          visual.enabled = false;
        }
      });
  }
}

export const PlayerScriptComponent = (): JSX.Element => new PlayerScript();

export const PlayerHands = ({ parent }: Props): JSX.Element => {
  const material = materialLibrary.get('blocksDropable');
  // const material = materialLibrary.get('flame');
  // const model = createModelFromSprite(material.diffuse);
  const model = blocksInfo[21].asItem;
  const object = new GlObject({ model, material });

  return (
    <GameObject>
      {/* <Transform rotation={quat.fromEuler(quat.create(), 0, 0, 90)} /> */}
      <Transform rotation={quat.fromEuler(quat.create(), 90, 90, 0)} />
      {/* TODO check if main player */}
      <PlayerScriptComponent />
      <Visual object={object} />
      {/* <Joint parent={parent} distance={vec3.fromValues(-0.5, -1.1, 0.6)} /> */}
      <Joint parent={parent} distance={vec3.fromValues(-1.5, -0.1, 1.6)} />
    </GameObject>
  );
};
