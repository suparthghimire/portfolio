# Use Clever Math to Make Responsive Carousel

I have used a lot of carousel components in the past, and they work good, but none of them work as expected. They are very hard to customize for smaller screens and often require static values when you want to make them responsive. I have decided to make my own carousel component that is responsive (on any screen size) and easy to customize.

# Problem

The problem that we have on hand by looking at some popular carousel components.

1. React Slick
   Good Features, but requires custom hard coded values for responsive design.
2. Mantine Carousel
   Good Features, but requires custom hard coded values for responsive design.
3. React Responsive Carousel
   Good Features, but requires custom hard coded values for responsive design.
4. React Multi Carousel
   Good Features, but requires custom hard coded values for responsive design.
5. Swiper
   Good Features, but requires custom hard coded values for responsive design.
   Also, it says ReactComponent version will be deprecated in favor of web-components, which are not supported well in React yet.

See a pattern here? All of these need hard coded values to make them responsive.

All of these component packages, though they provide great deal of customization and features, require hard coded values to make them responsive.

This is something we often see in these components

```ts
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    slidesToSlide: 5, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
    slidesToSlide: 3, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};
```

What if I don't want to specify these values and want them to be dynamic? The major drawback of this is that the size of carousel in different screens dictates the size of inner carousel child components. This really hard to maintain.

# Objective

I have one job, To make a carousel with **NO HARD CODED VALUES**

# Solution

I will be using the things that are popular at the time being to create the carousel and which probably will be used in many of your projects.

- [React](#)
- [Typescript (optional)](#)
- [Tailwindcss](#)
- [Framer Motion](#)
- [Use Measure](#) _Simple hook to get width and height of our elements_

# Setup

Install the dependencies and start your server. (Figure out how to do this yourself)

# Create the Carousel

We will be using the `useMeasure` hook to get the width of our carousel. We will also be using the `useTransform` hook from `framer-motion` to make the carousel slide.

I wont go block by block because I know the pain to compile code from blog posts. I will just show the final code and explain the parts later if you want to know how this works.

Here is the code

`File: Card.ts`
_Write your own mockdata and import it_

```ts
import { ITEMS } from "../utils/mockdata";

export default function Card(props: {
  item: typeof ITEMS[number];
  active: boolean;
}) {
  return (
    <div
      className={`border w-[300px] shadow rounded ${
        props.active ? "bg-red-200" : ""
      }`}
    >
      <img
        src={props.item.img}
        className="w-[300px] aspect-video object-cover"
      />
      <div className="p-4">
        <h2 className="text-2xl font-bold">{props.item.title}</h2>
        <p className="text-gray-500">{props.item.description}</p>
      </div>
      <div className="w-full p-2">
        <button className="bg-black rounded text-white p-2 w-full hover:bg-neutral-700 transition">
          View Info
        </button>
      </div>
    </div>
  );
}
```

`File: Carousel.ts`

```ts
import Card from "./Card";
import { ITEMS } from "../utils/mockdata";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import useMeasure from "react-use-measure";

type PropsWithoutAutoplay = {
  autoPlay?: false;
};
type PropsWithAutoplay = {
  autoPlay: true;
  interval: number;
};

export default function Carousel(
  props: PropsWithoutAutoplay | PropsWithAutoplay
) {
  const SCALE_FACTOR = 1.1;
  const [activeCardIdx, setActiveCardIdx] = useState(0);

  const [containerRef, containerBounds] = useMeasure();
  const [childRef, childBounds] = useMeasure();

  // define values
  const parentWidth = containerBounds.width;
  const childWidth = childBounds.width;

  const gap = 10;
  const paddingX = gap;
  const ITEMS_IN_VIEW = Math.floor(
    (parentWidth - paddingX * 2 + gap * 2) / (childWidth + gap * 4)
  );

  useEffect(() => {
    if (!props.autoPlay || !props.interval) return;
    const selfIncTimerInterval = setInterval(() => {
      setActiveCardIdx((prevCardIdx) => {
        return prevCardIdx + 1 >= ITEMS.length ? 0 : prevCardIdx + 1;
      });
    }, props.interval);
    return () => {
      clearInterval(selfIncTimerInterval);
    };
  }, []);

  return (
    <div className="w-full grid items-center " ref={containerRef}>
      <div className="w-full grid items-center">
        <div
          id="carousel-wrapper"
          className="flex gap-10 px-10 overflow-x-hidden py-5"
        >
          {ITEMS.map((item, idx) => (
            <AnimatePresence key={`carousel-item-${idx}`}>
              <motion.div
                ref={childRef}
                className="flex-1"
                initial={{
                  scale: 1,
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeInOut",
                }}
                animate={{
                  scale: idx === activeCardIdx ? 1 * SCALE_FACTOR : 1,
                  x:
                    activeCardIdx >= ITEMS_IN_VIEW % activeCardIdx
                      ? -((childWidth + paddingX * 2 + gap * 2) * activeCardIdx)
                      : 0,
                }}
              >
                <Card item={item} active={idx === activeCardIdx} />
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
        <div className="flex w-full justify-center gap-2 w-1/5 mt-5">
          <button
            onClick={() => {
              setActiveCardIdx((prevCardIdx) => {
                return prevCardIdx - 1 < 0 ? ITEMS.length - 1 : prevCardIdx - 1;
              });
            }}
            className="p-2 w-1/5 bg-black text-white hover:bg-neutral-600 transition"
          >
            {"<"}
          </button>
          <button
            onClick={() => {
              setActiveCardIdx((prevCardIdx) => {
                return prevCardIdx + 1 >= ITEMS.length ? 0 : prevCardIdx + 1;
              });
            }}
            className="p-2 w-1/5 bg-black text-white hover:bg-neutral-600 transition"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
```

`File: App.ts`

```ts
import React from "react";
import Carousel from "./components/Carousel";

export default function App() {
  return (
    <div className="flex flex-col gap-10">
      <div className="w-[500px] overflow-y-hidden">
        <Carousel />
      </div>
      <div className="w-[500px] overflow-y-hidden">
        <Carousel autoPlay={true} interval={1000} />
      </div>
      <div className="w-[500px] overflow-y-hidden">
        <Carousel />
      </div>
    </div>
  );
}
```
