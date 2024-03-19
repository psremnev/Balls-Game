import { Ball } from '../objects/Ball';
import { Base } from '../objects/Base';
import { Cue } from '../objects/Cue';
import { Hole } from '../objects/Hole';

export interface IAppOptions {
  size?: ISize;
}

export interface IMenuOptions {
  color: string | undefined;
  position: ICoor;
  changeCallback: (color: string) => void;
}

export interface ICoor {
  x: number;
  y: number;
}

export interface ISize {
  w: number;
  h: number;
}

export interface IObjectBaseConfig {
  coor: ICoor;
  size?: ISize;
  borderRadius?: number;
  radius?: number;
  color?: string | undefined;
  text?: string;
}

export type HitObjects = Ball | Hole | Cue | Base | null;
