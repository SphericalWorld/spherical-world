// @flow
import { initWebGL } from './engine/glEngine';
import Model from './engine/Model';
import HUD from './hud/hud';
import { connect } from './util';
// import playerModel from '../models/player.json';
import {
  playerStopJumping, // TODO: needs only for swimming
  playerRun,
  playerStopRun,
} from './player/playerActions';

import { World } from './ecs';

let tex = 0;
setInterval(() => {
  tex += 1;
  if (tex === 16) {
    tex = 0;
  }
}, 100);

const mapState = state => ({
  // mvMatrix: state.camera.mvMatrix,
  // pMatrix: state.camera.pMatrix,
});

const engineProvider = (
  store,
  network,
  Player,
  ResourceLoader,
  SocketHandlers,
  ecs: World,
  Skybox,
) => {
  @connect(mapState, null, store)
  class Engine {
    ecs: World = ecs;
    lastTime: number = 0;
    resourceLoader: ResourceLoader;

    constructor() {
      this.socketHandlers = new SocketHandlers(this, network);
      this.init().catch(console.error);
    }

    async init() {
      await network.connect();
      this.resourceLoader = new ResourceLoader(network);
      initWebGL();

      Player.hudBillboardModel = Model.createPrimitive('billboard', 2.0);

      this.player = await network.request('LOGIN', { cookie: 12345 });

      // Player.model = new Model(playerModel, 2);

      this.player = Player(this.player);

      this.hud = new HUD(store);

      await this.resourceLoader.loadAddons();
      this.skyBox = Skybox();
      await network.start();
      requestAnimationFrame(this.gameCycle);
    }

    gameCycle = (time: number): void => {
      const delta: number = time - this.lastTime;
      this.lastTime = time;
      this.ecs.update(delta);
      requestAnimationFrame(this.gameCycle);
    }

    static initKeyboardActions() {
      // this.keyboard.registerAction('run', playerRun(this.player.id), playerStopRun(this.player.id));
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
      //
      // for (const i in Player.instances) {
      //   if (Player.instances[i] !== this.player) {
      //     this.mvPushMatrix();
      //     Player.instances[i].draw();
      //     this.mvPopMatrix();
      //   }
      // }
      //
      // this.useShader('billboard');
      //
      // for (const i in Player.instances) {
      //   if (Player.instances[i] !== this.player) {
      //     this.mvPushMatrix();
      //     Player.instances[i].drawHud();
      //     this.mvPopMatrix();
      //   }
      // }
    }
  }
  return Engine;
};


export default engineProvider;
