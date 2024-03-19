import { Base } from './Base';
import { baseColors } from '../Constants';
import { IObjectBaseConfig } from '../interfaces/Interfaces';

/** Обьест стол */
export class Table extends Base {
  constructor(ctx: CanvasRenderingContext2D | null, config: IObjectBaseConfig) {
    super(ctx, config);
    this.draw();
  }

  draw() {
    if (this.ctx) {
      const margin = this.config.coor.x + this.config.coor.y;
      this.ctx.fillStyle = baseColors.table;
      this.ctx.strokeStyle = baseColors.border;
      this.ctx.beginPath();
      this.ctx.roundRect(
        this.config.coor.x || 0,
        this.config.coor.y || 0,
        (this.config.size?.w || 0) - margin,
        (this.config.size?.h || 0) - margin,
        [this.config.radius || 0]
      );
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();
    }
  }
}
