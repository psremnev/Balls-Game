import { ISize } from '../interfaces/Interfaces';
import { Circle } from './Circle';

/** Обьект отверстие */
export class Hole extends Circle {
  /** Получить коор. расположения отверстий на столе */
  static getHolesCoords = (
    tableSize: ISize,
    margin: number,
    holeRadius: number
  ) => {
    const twoMargin = margin * 2;
    const twoMarginAndRadius = twoMargin + holeRadius;
    const wWithOutMargin = tableSize.w - twoMarginAndRadius;
    const hWithOutMargin = tableSize.h - twoMarginAndRadius;
    const halfW = tableSize.w / 2;
    const holeRadiusHalf = holeRadius / 2;
    const marginWithOutHoleRadiusHalf = margin - holeRadiusHalf;
    return [
      { x: marginWithOutHoleRadiusHalf, y: marginWithOutHoleRadiusHalf },
      { x: halfW, y: marginWithOutHoleRadiusHalf },
      { x: wWithOutMargin + holeRadiusHalf, y: marginWithOutHoleRadiusHalf },
      {
        x: wWithOutMargin + holeRadiusHalf,
        y: hWithOutMargin + holeRadiusHalf
      },
      { x: halfW, y: hWithOutMargin + holeRadiusHalf },
      {
        x: marginWithOutHoleRadiusHalf,
        y: hWithOutMargin + holeRadiusHalf
      }
    ];
  };
}
