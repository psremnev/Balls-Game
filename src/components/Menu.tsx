import { useState } from 'react';
import { IMenuOptions } from '../interfaces/Interfaces';
import type { ChangeEvent } from 'react';
import { BaseColor } from '../Constants';
import './Menu.less';

/** Компонент меню цвета */
export default ({
  color = BaseColor.RED,
  position = { x: 100, y: 100 },
  changeCallback
}: IMenuOptions) => {
  const [selectColor, setSelectColor] = useState(color);

  /** Коллбек на изменение цвета */
  const onColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setSelectColor(color);
    changeCallback && changeCallback(color);
  };

  return (
    <div className="menu" style={{ left: position.x, top: position.y }}>
      <span>Выбрать цвет</span>
      <input type="color" value={selectColor} onChange={onColorChange} />
    </div>
  );
};
