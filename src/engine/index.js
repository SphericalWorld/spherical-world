// @flow strict
import GlTextureLibrary from './Texture/TextureLibrary';
import { ShaderLibrary } from './ShaderLibrary';
import { MaterialLibrary } from './Material';

export type { MaterialLibrary } from './Material/MaterialLibrary';
export type { ShaderLibrary } from './ShaderLibrary';
export { default as GlObject } from './glObject';

export const textureLibrary = new GlTextureLibrary();
export const shaderLibrary = new ShaderLibrary();
export const materialLibrary = new MaterialLibrary();
