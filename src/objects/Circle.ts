import { IObjectBaseConfig } from '../interfaces/Interfaces';
import { Base } from './Base';

/** Базовый обьект круг */
export class Circle extends Base {
  constructor(ctx: CanvasRenderingContext2D | null, config: IObjectBaseConfig) {
    super(ctx, config);
    this.draw();
  }

  draw() {
    if (this.ctx) {
      this.ctx.fillStyle = this.config.color || '';
      this.ctx.beginPath();
      this.ctx.arc(
        this.config.coor.x + (this.config.radius || 0),
        this.config.coor.y + (this.config.radius || 0),
        this.config.radius || 0,
        0,
        2 * Math.PI
      );
      this.ctx.closePath();
      this.ctx.fill();
    }
  }
}
