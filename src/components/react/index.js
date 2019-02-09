// @flow strict
import { type ComponentType } from 'react';
import {
  BlockRemover as BlockRemoverComponent,
  Camera as CameraComponent,
  Collider as ColliderComponent,
  Gravity as GravityComponent,
  Physics as PhysicsComponent,
  Player as PlayerComponent,
  Raytracer as RaytracerComponent,
  Skybox as SkyboxComponent,
  TransformComponent,
  UserControlled as UserControlledComponent,
  Velocity as VelocityComponent,
  Visual as VisualComponent,
  JointComponent,
  Item as ItemComponent,
  NetworkSync as NetworkSyncComponent,
  Inventory as InventoryComponent,
} from '../index';

/**
 * Component to allow entity to destroy blocks. Used to destroy blocks by players
 */
export const BlockRemover: ComponentType<{||}> = (props: {||}) => new BlockRemoverComponent();
export const Camera = () => new CameraComponent();
export const Collider = ({ type, params }) => new ColliderComponent(type, ...params);
export const Gravity = () => new GravityComponent();
export const Physics = () => new PhysicsComponent();
export const Player = () => new PlayerComponent();
export const Raytracer = () => new RaytracerComponent();
export const Skybox = () => new SkyboxComponent();
export { TransformComponent as Transform };
export const UserControlled = () => new UserControlledComponent();
export const Velocity = () => new VelocityComponent();
export const Visual = ({ object }) => new VisualComponent(object);
export { JointComponent as Joint };
export const Item = () => new ItemComponent();
export const NetworkSync = () => new NetworkSyncComponent();
export const Inventory = ({ slots, items, selectedItem }) => new InventoryComponent({ slots, items, selectedItem });
