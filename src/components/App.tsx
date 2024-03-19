import { useRef, useState } from 'react';
import { Table } from '../objects/Table';
import { Hole } from '../objects/Hole';
import { Ball } from '../objects/Ball';
import { Cue } from '../objects/Cue';
import { Base } from '../objects/Base';
import Menu from './Menu';
import { HitObjects, IAppOptions, ICoor } from '../interfaces/Interfaces';
import './App.less';

/** Компонент основного приложения */
export default ({ size = { w: 500, h: 300 } }: IAppOptions) => {
  const [cueUp, setCueUp] = useState(false);
  const [selectBall, setSelectBall] = useState<Ball | null>(null);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [menuColorPosition, setMenuColorPosition] = useState({
    x: 100,
    y: 100
  });
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const table = useRef<Table | null>(null);
  const cue = useRef<Cue | null>(null);
  const balls = useRef<Ball[] | null>(null);
  const holes = useRef<Hole[] | null>(null);
  const margin = 10;
  const holeCoords = Hole.getHolesCoords(size, margin, 10);
  const ballsCoords = Ball.getBallsCoords(size, 10);
  const getCanvasElement = (ref: HTMLCanvasElement | null) => {
    if (!canvas.current && ref) {
      canvas.current = ref;
      ctx.current = ref.getContext('2d');
      draw();
    }
  };

  /** Основная функция перерисовки Canvas */
  const draw = () => {
    ctx?.current?.clearRect(0, 0, size.w, size.h);
    drawTable();
    drawHoles();
    drawBalls();
    drawCue();
  };

  /** Перерисовка стола */
  const drawTable = () => {
    if (table.current) {
      table.current.draw();
    } else {
      table.current = new Table(ctx.current, {
        coor: { x: 10, y: 10 },
        size,
        radius: 10
      });
    }
  };

  /** Перерисовка отверстий для шаров */
  const drawHoles = () => {
    if (holes.current) {
      holes.current.forEach((hole) => {
        hole.draw();
      });
    } else {
      holes.current = holeCoords.map(({ x, y }) => {
        return new Hole(ctx.current, {
          coor: { x, y },
          radius: 10,
          color: '#2a2f2d'
        });
      });
    }
  };

  /** Перерисовка шаров */
  const drawBalls = () => {
    if (balls.current) {
      balls.current.forEach((ball) => {
        ball.draw();
      });
    } else {
      balls.current = ballsCoords.map(({ x, y, num, color }) => {
        return new Ball(ctx.current, {
          coor: { x, y },
          radius: 10,
          color,
          text: num
        });
      });
    }
  };

  /** Перерисовка кия */
  const drawCue = () => {
    cue.current
      ? cue.current.draw()
      : (cue.current = new Cue(ctx.current, {
          coor: { x: 400, y: size.h / 2 },
          size: { w: 20, h: 20 },
          color: '#442210',
          radius: 10
        }));
  };

  /** Получить шары с которым столкнулся обьект */
  const getBallsHit = (obj: HitObjects) => {
    const hits: Ball[] = [];
    balls.current?.forEach((ball) => {
      if (Base.hasHit(obj, ball)) {
        hits.push(ball);
      }
    });
    return hits;
  };

  /** Получить обьект мыши */
  const getMouseObject = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const canRect: DOMRect | undefined =
      canvas.current?.getBoundingClientRect();
    return new Base(ctx.current, {
      coor: {
        x: e.clientX - (canRect?.left || 0),
        y: e.clientY - (canRect?.top || 0)
      }
    });
  };

  /** Закрыть меню выбора цвета */
  const closeColorMenu = (target: EventTarget | null) => {
    const menu = document.querySelector('.menu');
    if (target !== menu) {
      setShowColorMenu(false);
    }
  };

  /** Событие клика мышью */
  const onPointerDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    closeColorMenu(e.target);
    const mouse = getMouseObject(e);
    if (Base.hasHit(mouse, cue.current)) {
      setCueUp(true);
    }
  };

  /** Событие перемещения курсора мыши */
  const onPointerMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (cueUp) {
      const canRect = canvas.current?.getBoundingClientRect();
      if (cue.current) {
        cue.current.config.coor = {
          x:
            e.clientX -
            (canRect?.left || 0) -
            (cue.current?.config.size?.w || 0) / 2,
          y:
            e.clientY -
            (canRect?.top || 0) -
            (cue.current?.config.size?.h || 0) / 2
        };
      }

      const ballsHits = getBallsHit(cue.current);
      if (ballsHits.length) {
        const hitBall = ballsHits[0];
        const moveStep = Base.calculateMoveStep(cue.current, hitBall);
        moveBall(hitBall, 5, moveStep);
      }
      draw();
    }
  };

  /** Событие отпускания курсора мыши */
  const onPointerUp = () => {
    setCueUp(false);
  };

  /** Событие клика правой кнопкой мыши */
  const onContextMenu = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    e.preventDefault();
    const mouse = getMouseObject(e);
    const ballsHits = getBallsHit(mouse);
    const ball = ballsHits[0];
    setSelectBall(ball);
    setMenuColorPosition({ x: ball.config.coor.x, y: ball.config.coor.y });
    setShowColorMenu(true);
  };

  /** Коллбек на выбор цвета */
  const selectColorCallback = (color: string) => {
    if (selectBall) {
      selectBall.config.color = color;
      selectBall.draw();
    }
  };

  /** Функция движения мяча */
  const moveBall = (ball: Ball, speed: number, moveStep: ICoor) => {
    const border = table.current;
    let step = moveStep;
    const stop_step = 0.5;
    let currSpeed = speed;

    const clearInt = (id: NodeJS.Timer) => {
      if (currSpeed <= 0) {
        clearInterval(id);
      }
    };
    const breakSpeed = () => {
      currSpeed *= 0.7;
    };

    const moveIntId = setInterval(() => {
      clearInt(moveIntId);

      // движения мяча в нужном направлениии
      ball.config.coor = {
        x: ball.config.coor.x + currSpeed * step.x,
        y: ball.config.coor.y + currSpeed * step.y
      };

      // затухание скорости мяча
      currSpeed -= stop_step;

      // упал в дыру
      holes.current?.forEach((hole) => {
        if (Ball.hasHit(ball, hole) && balls.current) {
          balls.current = balls.current.filter((currBall) => currBall !== ball);
        }
      });

      // столкнулся с другим шаром
      balls.current?.forEach((currBall) => {
        if (Ball.hasHit(ball, currBall, true)) {
          clearInt(moveIntId);
          // новое направление для текущего мяча
          step = Ball.calculateMoveStep(currBall, ball);
          // направление движения для мяча с которым столкнулись
          const moveStepСurrBall = Ball.calculateMoveStep(ball, currBall);
          breakSpeed();
          moveBall(currBall, currSpeed, moveStepСurrBall);
        }
      });

      // столкновение мяча с границами
      const ballSize = (ball.config?.radius || 0) * 2;
      const borderCoor = border?.config.coor;
      const borderSize = {
        w: (border?.config.size?.w || 0) - (border?.config.coor.x || 0) * 2,
        h: (border?.config.size?.h || 0) - (border?.config.coor.y || 0) * 2
      };
      const top = ball.config.coor.y < (borderCoor?.y || 0);
      const left = ball.config.coor.x < (borderCoor?.x || 0);
      const right =
        ball.config.coor.x + ballSize > (borderCoor?.x || 0) + borderSize.w;
      const bottom =
        ball.config.coor.y + ballSize > (borderCoor?.y || 0) + borderSize.h;
      if (top || bottom) {
        ball.config.coor.y = top
          ? borderCoor?.y || 0
          : (borderCoor?.y || 0) + borderSize.h - ballSize;
        step.y *= -1;
        breakSpeed();
      } else if (left || right) {
        ball.config.coor.x = left
          ? borderCoor?.x || 0
          : (borderCoor?.x || 0) + borderSize.w - ballSize;
        step.x *= -1;
        breakSpeed();
      }

      console.log(`r ${right} l ${left} t ${top} b ${bottom}`);
      draw();
    }, 100);
  };

  return (
    <>
      {showColorMenu && (
        <Menu
          color={selectBall?.config.color}
          position={menuColorPosition}
          changeCallback={selectColorCallback}
        />
      )}
      <canvas
        onContextMenu={onContextMenu}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        ref={getCanvasElement}
        className="game"
        width={size.w}
        height={size.h}
      ></canvas>
    </>
  );
};
