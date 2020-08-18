import type Network from './network';
import { initWebGL } from './engine/glEngine';
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

const engineProvider = (network: Network, ecs: World) => {
  class Engine {
    ecs: World = ecs;
    lastTime = 0;
    gameLoopWasStopped = false;

    constructor() {
      this.init().catch(console.error);
    }

    async init() {
      await network.connect();
      initWebGL();

      network.events
        .filter((e) => e.type === 'LOGGED_IN')
        .subscribe(({ payload }) => {
          localStorage.setItem('userId', payload.data.id);
          const PlayerComp = () => <Player {...payload.data} isMainPlayer />;
          const SkyboxComp = () => <Skybox parent={payload.data.id} />;

          render(PlayerComp, ecs);
          render(SkyboxComp, ecs);
        });

      network.events
        .filter((e) => e.type === 'GAME_START')
        .subscribe(() => {
          requestAnimationFrame(this.gameCycle);
        });

      network.emit('LOGIN', {
        cookie: 12345,
        userId: localStorage.getItem('userId'),
      });
      network.start();
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.gameLoopWasStopped = true;
          ecs.startPseudoSyncTimer();
        } else {
          ecs.stopPseudoSyncTimer();
        }
      });
    }

    gameCycle = (time: number): void => {
      if (this.gameLoopWasStopped) {
        this.lastTime = time;
        this.gameLoopWasStopped = false;
      }
      const delta = time - this.lastTime;
      this.lastTime = time;
      this.ecs.update(delta);
      requestAnimationFrame(this.gameCycle);
    };

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
