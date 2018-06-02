// @flow
import type { System } from './System';
import { Transform, Component } from '../components';

export default class BlockRemove implements System {
  components: Component[][] = [];

  update(delta: number): void {
    // console.log(34)
    // for each( var target:MoveNode in targets )
    // {
    //   target.position.x += target.velocity.velocityX * time;
    //   target.position.y += target.velocity.velocityY * time;
    //   target.position.rotation += target.velocity.angularVelocity * time;
    // }
  }
}
