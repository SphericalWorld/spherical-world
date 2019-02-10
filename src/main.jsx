// @flow strict
import type Network from './network';
import type { Store } from './store/store';
import { initWebGL } from './engine/glEngine';
import HUD from './hud/HudApi';
import { World, React, render } from '../common/ecs';
import { Player } from './player/Player';
import { Skybox } from './Skybox';

let tex = 0;
setInterval(() => {
  tex += 1;
  if (tex === 16) {
    tex = 0;
  }
}, 100);

const engineProvider = (
  store: Store,
  network: Network,
  resourceLoader,
  ecs: World,
) => {
  class Engine {
    ecs: World = ecs;
    lastTime: number = 0;

    constructor() {
      this.init().catch(console.error);
    }

    async init() {
      await network.connect();
      initWebGL();
      this.hud = new HUD(store);

      network.events
        .filter(e => e.type === 'LOGGED_IN')
        .subscribe(({ payload }) => {
          localStorage.setItem('userId', payload.data.id);
          render(() => <Player {...payload.data} isMainPlayer />, ecs);
          render(() => <Skybox parent={payload.data.id} />, ecs);
        });

      network.events
        .filter(e => e.type === 'GAME_START')
        .subscribe(() => {
          resourceLoader.loadAddons();
          requestAnimationFrame(this.gameCycle);
        });

      network.emit('LOGIN', { cookie: 12345, userId: localStorage.getItem('userId') });
      network.start();
    }

    gameCycle = (time: number): void => {
      const delta = time - this.lastTime;
      this.lastTime = time;
      this.ecs.update(delta);
      requestAnimationFrame(this.gameCycle);
    }

    static initKeyboardActions() {
      // this.keyboard.registerAction({
      //   name: 'showDebugInfo',
      //   onKeyDown() {
      //     this.hud.showDebugInfo();
      //   },
      // });
      // this.keyboard.registerAction({
      //   name: 'enterFullscreen',
      //   onKeyUp() {
      //     if (document.body.requestFullscreen) {
      //       document.body.requestFullscreen();
      //     } else if (document.body.mozRequestFullScreen) {
      //       document.body.mozRequestFullScreen();
      //     } else if (document.body.webkitRequestFullscreen) {
      //       document.body.webkitRequestFullscreen();
      //     }
      //   },
      // });
    }

    static drawGL() {
      // gl.disable(gl.BLEND);
      // this.useShader('chunk');
      //
      //
      // // gl.uniform3fv(this.shaders.get('chunk').uAnimTextures, [127.0, 0, tex / 16]);
      //
      // // this.terrain.draw();
      //
      // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      // this.useShader('diffuse');
    }
  }
  return Engine;
};


export default engineProvider;
