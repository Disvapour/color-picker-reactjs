import Head from 'next/head';
import styled from '@emotion/styled';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const Frame = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  --picker-width: 24rem;
  --picker-height: 22rem;
  align-items: center;
  place-items: center;
  min-height: 100vh;
`;
const ColorWheel = styled.div`
  width: var(--picker-width);
  height: var(--picker-height);
  border-radius: 12px 12px 0 0;
  position: relative;
  max-width: 95%;
  /*background-image: linear-gradient(0deg, #000, transparent), linear-gradient(180deg, #fff, transparent 50%), linear-gradient(90deg, #fff, transparent); */
  background-image: linear-gradient(0deg, #000, transparent), linear-gradient(90deg, #fff, transparent);
  box-shadow: 0 48px 32px -12px #0008, 0 8px 12px -4px #0008;
`;
const PickerButton = styled.div`
  width: 2rem;
  height: 2rem;
  border: 3px solid #fff;
  box-shadow: 0 4px 8px -2px #0006;
  border-radius: 50%;
  position: absolute;
  transform: translate(-50%, 50%);
  z-index: 999;
  &.active{
    scale: 1.1;
  }
`;
const HueSlider = styled(motion.div)`
  width: var(--picker-width);
  height: 2rem;
  border-radius: 0 0 12px 12px;
  position: relative;
  max-width: 95%;
  background-image: linear-gradient(90deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red);
`;

export default function Home() {
  const SelecterRef = useRef();
  const HueSelectorRef = useRef();
  const [Hue, setHue] = useState(65);
  const [Opacity, setOpacity] = useState(1);
  const [Color, setColor] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [favIcon, setFavIcon] = useState('');
  const [isHueDragging, setIsHueDragging] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 1 });
  const generateFavIcon = (col) => {
    let canvas = document.createElement('canvas');
    canvas.height = 64;
    canvas.width = 64;
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, 2 * Math.PI);
    ctx.fill();
    return canvas.toDataURL('image/jpeg');
  };
  const handleMoveBoth = (clientX, clientY) => {
    if (isDragging) {
      let offsetBottom =
        SelecterRef.current.offsetTop + SelecterRef.current.offsetHeight;
      let offsetRight =
        SelecterRef.current.offsetLeft + SelecterRef.current.offsetWidth;
      if (
        clientY >= SelecterRef.current.offsetTop &&
        clientY <= offsetBottom &&
        clientX >= SelecterRef.current.offsetLeft &&
        clientX <= offsetRight
      ) {
        setMousePos({
          x:
            (clientX - SelecterRef.current.offsetLeft) /
            SelecterRef.current.offsetWidth,
          y:
            1 -
            (clientY - SelecterRef.current.offsetTop) /
              SelecterRef.current.offsetHeight,
        });
      } else if (
        clientY >= SelecterRef.current.offsetTop &&
        clientY <= offsetBottom
      ) {
        setMousePos({
          ...mousePos,
          y:
            1 -
            (clientY - SelecterRef.current.offsetTop) /
              SelecterRef.current.offsetHeight,
        });
      } else if (
        clientX >= SelecterRef.current.offsetLeft &&
        clientX <= offsetRight
      ) {
        setMousePos({
          ...mousePos,
          x:
            (clientX - SelecterRef.current.offsetLeft) /
            SelecterRef.current.offsetWidth,
        });
      }
    }
    if (isHueDragging) {
      let offsetRight =
        HueSelectorRef.current.offsetLeft + HueSelectorRef.current.offsetWidth;
      clientX >= HueSelectorRef.current.offsetLeft &&
        clientX <= offsetRight &&
        setHue(
          Math.floor(
            ((clientX - HueSelectorRef.current.offsetLeft) /
              HueSelectorRef.current.offsetWidth) *
              360
          )
        );
    }
  };
  // useEffect(() => {
  //   setColor(
  //     `hsla(${Hue}, ${Math.floor(mousePos.x * 100)}%, ${Math.floor(
  //       mousePos.y * 100
  //     )}%, ${Opacity})`
  //   );
  // }, [mousePos]);
  useEffect(() => {
    setColor(
      `hsla(${Hue}, ${Math.floor(mousePos.x * 100)}%, ${Math.floor(
        mousePos.y * 100 * (1 - mousePos.x / 2)
      )}%, ${Opacity})`
    );
  }, [mousePos, Hue]);
  useEffect(() => {
    setHue(Math.floor(Math.random() * 360));
    setMousePos({ x: Math.random(), y: Math.random() });
  }, []);
  useEffect(() => {
    setFavIcon(generateFavIcon(Color));
  }, [Color]);
  return (
    <>
      <Head>
        <link rel="icon" type="image/jpeg" href={favIcon} />
      </Head>
      <Frame
        style={{
          backgroundColor: Color,
        }}
        onMouseMove={(e) => {
          handleMoveBoth(e.clientX, e.clientY);
        }}
        onMouseUp={() => {
          isDragging && setIsDragging(false);
          isHueDragging && setIsHueDragging(false);
        }}
      >
        <ColorWheel
          style={{
            backgroundColor: `hsla(${Hue}, 100%, 50%, 1)`,
          }}
          onMouseDown={(e) => {
            setIsDragging(true);
            handleMoveBoth(e.clientX, e.clientY);
          }}
          ref={SelecterRef}
        >
          <PickerButton
            style={{
              bottom: `${Math.floor(mousePos.y * 100)}%`,
              left: `${Math.floor(mousePos.x * 100)}%`,
              backgroundColor: Color,
            }}
            className={isDragging ? 'active' : ''}
          />
        </ColorWheel>
        <HueSlider
          onMouseDown={(e) => {
            setIsHueDragging(true);
            handleMoveBoth(e.clientX, e.clientY);
          }}
          ref={HueSelectorRef}
        >
          <PickerButton
            onMouseDown={(e) => {
              setIsHueDragging(true);
            }}
            style={{
              transform: 'translate(-50%, 0)',
              background: `hsl(${Hue}, 100%, 50%)`,
              left: `${Math.floor((Hue / 360) * 100)}%`,
            }}
          />
        </HueSlider>
        <h2 style={{ position: 'fixed' }}>{Color}</h2>
      </Frame>
    </>
  );
}
