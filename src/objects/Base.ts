import { BaseColor } from '../Constants';
import { HitObjects, IObjectBaseConfig } from '../interfaces/Interfaces';

/** Базовый обьект */
export class Base {
  ctx: CanvasRenderingContext2D | null = null;
  defaultConfig: IObjectBaseConfig = {
    coor: { x: 0, y: 0 },
    size: { w: 0, h: 0 },
    borderRadius: 0,
    radius: 0,
    color: BaseColor.RED,
    text: ''
  };
  config: IObjectBaseConfig = this.defaultConfig;
  constructor(ctx: CanvasRenderingContext2D | null, config: IObjectBaseConfig) {
    this.ctx = ctx;
    this.config = config
      ? {
          ...this.defaultConfig,
          ...config
        }
      : this.defaultConfig;
  }

  /** Определяет ест ли столкновение между 2 обьектами
   * needMoveObject - корректировать или нет положение обьекта при столкновении(чтоы обьекты не наезжали друг на друга)
   */
  static hasHit(
    obj: HitObjects,
    anotherObj: HitObjects,
    needMoveObject: boolean = false
  ) {
    const diametrObj = obj?.config.radius && obj.config.radius * 2;
    const diametrAnotherObj =
      (anotherObj?.config.radius && anotherObj.config.radius * 2) || 0;
    const hObj = obj?.config.size?.h || diametrObj || 0;
    const wObj = obj?.config.size?.w || diametrObj || 0;
    const wAnotherObj = anotherObj?.config.size?.w || diametrAnotherObj || 0;
    const hAnotherObj = anotherObj?.config.size?.h || diametrAnotherObj || 0;
    const objX = obj?.config.coor.x || 0;
    const objY = obj?.config.coor.y || 0;
    const anotherObjX = anotherObj?.config.coor.x || 0;
    const anotherObjY = anotherObj?.config.coor.y || 0;
    const coordsObj = {
      startX: objX,
      endX: objX + wObj,
      startY: objY,
      endY: objY + hObj
    };
    const coordsAnotherObj = {
      startX: anotherObjX,
      endX: anotherObjX + wAnotherObj,
      startY: anotherObjY,
      endY: anotherObjY + hAnotherObj
    };

    const top =
      coordsObj.endY > (coordsAnotherObj.startY || 0) &&
      coordsObj.endY < coordsAnotherObj.endY;
    const bottom =
      coordsObj.startY < coordsAnotherObj.endY &&
      coordsObj.startY > coordsAnotherObj.startY;
    const left =
      coordsObj.startX < coordsAnotherObj.endX &&
      coordsObj.startX > coordsAnotherObj.startX;
    const right =
      coordsObj.endX > coordsAnotherObj.startX &&
      coordsObj.endX < coordsAnotherObj.endX;
    const hit =
      (top && (left || right)) ||
      (bottom && (left || right)) ||
      (left && (top || bottom)) ||
      (right && (top || bottom));
    const offset = 2;
    if (hit && needMoveObject && anotherObj && obj) {
      const deltaY = Math.abs(anotherObjY - objY);
      if (left && deltaY + offset < diametrAnotherObj) {
        anotherObj.config.coor.x =
          obj.config.coor.x -
          (obj.config.radius ? obj.config.radius * 2 : wObj) -
          offset;
      } else if (right && deltaY + offset < diametrAnotherObj) {
        anotherObj.config.coor.x =
          obj.config.coor.x +
          (obj.config.radius ? obj.config.radius * 2 : wObj) +
          offset;
      } else if (top) {
        anotherObj.config.coor.y =
          obj.config.coor.y +
          (obj.config.radius ? obj.config.radius * 2 : hObj) +
          offset;
      } else if (bottom) {
        anotherObj.config.coor.y =
          obj.config.coor.y -
          (obj.config.radius ? obj.config.radius * 2 : hObj) -
          offset;
      }
    }

    return hit;
  }

  /** Рассчитывает шаг на x, y для направления в котором должен двигаться обьект при столкновении */
  static calculateMoveStep(
    obj: HitObjects,
    anotherObj: HitObjects,
    step: number = 0.2
  ) {
    const reverseVectorObj = {
      x: (obj?.config.coor.x || 0) * -1,
      y: (obj?.config.coor.y || 0) * -1
    };
    const summVector = {
      x: reverseVectorObj.x + (anotherObj?.config.coor.x || 0),
      y: reverseVectorObj.y + (anotherObj?.config.coor.y || 0)
    };
    const x_ = summVector.x > 0 ? 1 : -1;
    const y_ = summVector.y > 0 ? 1 : -1;
    const delta = Math.abs(summVector.x / summVector.y);
    return { x: step * delta * x_, y: step * y_ };
  }
}
