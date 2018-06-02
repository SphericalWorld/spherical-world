// @flow
import { mat4 } from 'gl-matrix';
import { initWebGL } from './engine/glEngine';
import Model from './engine/Model';
import HUD from './hud/hud';
import Gradient from './gradient';
import { connect } from './util';
// import playerModel from '../models/player.json';
import {
  playerJump,
  playerStopJumping,
  playerMove,
  playerStopMoving,
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
  textureLibrary,
  ecs: World,
  Skybox,
) => {
  @connect(mapState, null, store)
  class Engine {
    ecs: World = ecs;
    lastTime: number = 0;

    constructor() {
      this.network = network;
      this.socketHandlers = new SocketHandlers(this);
      this.init().catch((e) => { console.error(e); });
    }

    async init() {
      this.globalColor = [0, 0, 0, 1];
      await network.connect();
      this.resourceLoader = new ResourceLoader(this);
      this.dayTime = Math.asin(-1);
      this.lightColorGradient = new Gradient([[0, 0xFFFFFF], [15, 0xEDEDC9], [28, 0xffffd8], [40, 0xDBBB48], [57, 0x893C18], [71, 0x41035B], [87, 0x1C1C5B], [100, 0x1a1a1a]]);

      const pMatrix = mat4.create();
      initWebGL(pMatrix);

      Player.hudBillboardModel = Model.createPrimitive('billboard', 2.0);
      this.textureLibrary = textureLibrary;

      try {
        this.player = await network.request('LOGIN', { cookie: 12345 });

        // Player.model = new Model(playerModel, 2);

        Player.texture = textureLibrary.get('player');
        this.player.mainPlayer = true;
        this.player = Player(this.player);

        this.hud = new HUD();

        await this.resourceLoader.loadAddons();
        this.skyBox = Skybox();
        await network.start();
        requestAnimationFrame(this.gameCycle.bind(this));
      } catch (e) {
        console.error(e);
      }
    }

    gameCycle(time: number): void {
      const delta: number = time - this.lastTime;
      this.lastTime = time;
      const dayLightLevel = (Math.sin(this.dayTime) + 1) * 50;
      const color = Math.floor(this.lightColorGradient.getAtPosition(dayLightLevel));
      this.globalColor = [((color & 0xFF0000) >> 16) / 256, ((color & 0xFF00) >> 8) / 256, (color & 0xFF) / 256, 1];

      this.ecs.update(delta);
      requestAnimationFrame(this.gameCycle.bind(this));
    }

    static initKeyboardActions() {
      // this.keyboard.registerAction('jump', playerJump(this.player.id), playerStopJumping(this.player.id));
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
