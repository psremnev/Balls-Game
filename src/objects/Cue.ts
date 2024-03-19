import { BaseColor } from '../Constants';
import { IObjectBaseConfig } from '../interfaces/Interfaces';
import { Base } from './Base';

/** Базовый обьект круг */
export class Cue extends Base {
  constructor(ctx: CanvasRenderingContext2D | null, config: IObjectBaseConfig) {
    super(ctx, config);
    this.draw();
  }

  draw() {
    if (this.ctx) {
      this.ctx.fillStyle = this.config.color || '';
      this.ctx.beginPath();
      this.ctx.roundRect(
        this.config.coor.x || 0,
        this.config.coor.y || 0,
        this.config.size?.w || 0,
        this.config.size?.h || 0,
        [this.config.radius || 0]
      );

      this.ctx.stroke();
      this.ctx.fillStyle = BaseColor.WHITE;
      this.ctx.fillText(
        'take and break',
        this.config.coor.x - 20,
        this.config.coor.y - 10
      );
      this.ctx.closePath();
    }
  }
}
