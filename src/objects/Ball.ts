import { ISize } from '../interfaces/Interfaces';
import { Circle } from './Circle';
import { BaseColor } from '../Constants';

/** Обьект шар */
export class Ball extends Circle {
  stop_step = 0.5;
  step = 2;
  timeOutIds = [];

  draw() {
    super.draw();
    this.drawText();
  }

  drawText() {
    if (this.ctx) {
      const r = this.config.radius || 0;
      const offset = 2;
      this.ctx.beginPath();
      this.ctx.fillStyle = BaseColor.BLACK;
      this.ctx.fillText(
        this.config.text || '',
        this.config.coor.x + r - offset,
        this.config.coor.y + r + offset
      );
      this.ctx.closePath();
    }
  }

  /** Получить коорю раскладки шаров */
  static getBallsCoords = (tableSize: ISize, ballRadius: number) => {
    const halfH = tableSize.h / 2;
    const ballOffset = 2;
    const ballPlusOffset = ballRadius * 2 + ballOffset;
    const ballRadiusPlusOffset = ballRadius + ballOffset;
    const firstRowW = 100;
    const secondRowW = firstRowW + ballPlusOffset;
    const thirdRowW = secondRowW + ballPlusOffset;
    const fourthRowW = thirdRowW + ballPlusOffset;
    const fifthRowW = fourthRowW + ballPlusOffset;
    return [
      {
        x: firstRowW,
        y: halfH - ballPlusOffset * 2,
        num: '1',
        color: BaseColor.RED
      },
      {
        x: firstRowW,
        y: halfH - ballPlusOffset,
        num: '2',
        color: BaseColor.YELLOW
      },
      { x: firstRowW, y: halfH, num: '3', color: BaseColor.BLUE },
      {
        x: firstRowW,
        y: halfH + ballPlusOffset,
        num: '4',
        color: BaseColor.GREEN
      },
      {
        x: firstRowW,
        y: halfH + ballPlusOffset * 2,
        num: '5',
        color: BaseColor.GRAY
      },

      {
        x: secondRowW,
        y: halfH - ballPlusOffset - ballRadiusPlusOffset,
        num: '6',
        color: BaseColor.PURPLE
      },
      {
        x: secondRowW,
        y: halfH - ballRadiusPlusOffset,
        num: '7',
        color: BaseColor.PINK
      },
      {
        x: secondRowW,
        y: halfH + ballRadiusPlusOffset,
        num: '8',
        color: BaseColor.GRAY
      },
      {
        x: secondRowW,
        y: halfH + ballPlusOffset + ballRadiusPlusOffset,
        num: '9',
        color: BaseColor.BLUE
      },

      {
        x: thirdRowW,
        y: halfH - ballPlusOffset,
        num: '10',
        color: BaseColor.WHITE
      },
      { x: thirdRowW, y: halfH, num: '11', color: BaseColor.RED },
      {
        x: thirdRowW,
        y: halfH + ballPlusOffset,
        num: '12',
        color: BaseColor.GREEN
      },

      {
        x: fourthRowW,
        y: halfH - ballRadiusPlusOffset,
        num: '13',
        color: BaseColor.PINK
      },
      {
        x: fourthRowW,
        y: halfH + ballRadiusPlusOffset,
        num: '14',
        color: BaseColor.YELLOW
      },

      { x: fifthRowW, y: halfH, num: '15', color: BaseColor.BLUE }
    ];
  };
}
