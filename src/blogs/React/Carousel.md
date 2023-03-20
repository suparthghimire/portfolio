# Use Clever Math to Make Responsive Carousel

**BEFORE WE BEGIN, THIS IS NOT ANOTHER NPM PACKAGE**

I have used a lot of carousel components in the past, and they work good, but none of them work as expected. They often require static values when you want to make them responsive. I have decided to make my own carousel component that is responsive (on any screen size) without providing any static screen size values.

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
   Also, it says ReactComponent version will be deprecated in favor of web-componenjsx, which are not supported well in React yet.

See a pattern here? All of these need hard coded values to make them responsive.

All of these component packages, though they provide great deal of customization and features, require hard coded values to make them responsive.

This is something we often see in these componenjsx

```jsx
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

# Demo and Tech Stack

[View Demo](http://carousel.suparthnarayanghimire.com.np/)

I will be using the things that are popular at the time being to create the carousel and which probably will be used in many of your projects.

- [React](#) _You can use any other libraries_
- [Typescript](#) _(optional)_
- [Tailwindcss](#) _(optional)_
- [Framer Motion](#)
- [Use Measure](#) _Simple hook to get width and height of our elements_

# Setup

Goto [Github Repo](https://github.com/suparthghimire/custom-carousel) and clone the repo.

1. Get the code

   ```bash
   git clone
   cd carousel
   ```

2. Install Dependencies

   ```bash
   yarn
   ```

   or

   ```bash
   npm install
   ```

3. Start the dev server

   ```bash
   yarn dev
   ```

   or

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](#) to view it in the browser.

# Explanation

We will be using the `useMeasure` hook to get the width of our carousel. We will also be using the `useTransform` hook from `react-use-measure` that provides bounds for the carousel and finally, we will use `framer-motion` for animation.

Lets jump into Carousel Components to see the props it takes

```js
type PropsWithoutAutoplay = {
  autoPlay?: false,
  hideControls?: boolean,
  batchScroll?: boolean,
};
type PropsWithAutoplay = {
  autoPlay: true,
  interval: number,
};
type CommonProps = {
  spacing?: number,
  hideControls?: boolean,
  batchScroll?: boolean,
  scaleOnHover?: boolean,
  children: React.ReactNode,
  pagination?: boolean,
};
type Props = (PropsWithoutAutoplay | PropsWithAutoplay) & CommonProps;
```

Most of these are self explanatory, but I will explain the ones that are not.

- `autoPlay` - If you want the carousel to auto play, set this to true. If you don't want it to auto play, set it to false or don't pass it at all.

- `interval` - If you want to set the interval for auto play, pass this prop. The default value is 3000ms.

- `spacing` - If you want to set the spacing between the carousel items, pass this prop. The default value is 0.

- `hideControls` - If you want to hide the controls, pass this prop. The default value is false.

- `batchScroll` - If you want to scroll multiple items at once, pass this prop. The default value is false.

- `scaleOnHover` - If you want to scale the carousel items on hover, pass this prop. The default value is false.

- `pagination` - If you want to show the pagination, pass this prop. The default value is false.

- `children` - The children of the carousel. This is where you will pass the carousel items.

Lets look at the state variables for the component

```js
const [activeCardIdx, setActiveCardIdx] = useState(0);
const [scrollAmount, setScrollAmount] = useState(0);
const [containerRef, containerBounds] = useMeasure();
const [childRef, childBounds] = useMeasure();
```

- `activeCardIdx` - This is the index of the active carousel item. This is used to show the active carousel item.

- `scrollAmount` - This is the amount of scroll that we want to do. This is used to scroll the carousel.

- `containerRef and containerBounds` - This is the ref of the container of the carousel. This is used to get the width of the container.

- `childRef and childBounds` - This is the ref of the carousel item. This is used to get the width of the carousel item.

We need to convert the items in children prop into array so that we can use `map` on it later on to render the carousel items.

```js
const ITEMS = useMemo<React.ReactNode[]>(() => {
  if (Array.isArray(props.children))
    return props.children.map((child) => child);
  else return [props.children];
}, [props.children]);
```

The `useMemo` hook is used here to memoize the array of carousel items. This is done so that we don't have to convert the children prop into array on every render. If we don't use `useMemo`, the carousel will be re-rendered on every scroll.

The next step is to setup some default values for the carousel.

```js
const parentWidth = containerBounds.width;
const childWidth = childBounds.width;

const spacing = useMemo(() => props.spacing || 10, []);

const SCALE_FACTOR = useMemo(() => 1.1, []);
const ITEMS_IN_VIEW = useMemo(
  () => Math.floor((parentWidth - spacing * 4) / (childWidth + spacing * 4)),
  [parentWidth, childWidth]
);
```

Everything here is self explanatory. The only thing that is not is the `ITEMS_IN_VIEW` variable. This is the number of carousel items that can be shown in the carousel at a time. This is calculated by dividing the width of the carousel by the width of the carousel item.

The use of `useMemo` here is to memoize the value of `ITEMS_IN_VIEW`. This is done so that we don't have to calculate the value of `ITEMS_IN_VIEW` on every render, rather only when the value of `parentWidth` or `childWidth` changes.

Say the width of the parent container is `1000px` and each carousel item 's width is `200px`. Now say the spacing is `10px`. So the width of the carousel item will be

```math
Padding Space = 2 * 10px = 20px
```

```math
Gap Space = 2 * 10px = 20px
```

```math
Total Space = 40px
```

```math
Width of Carousel Item = 200px + 40px = 240px
```

Since we are using same value for Padding and Gap between the carousel items, we are multiplying the spacing by 4.

The total items, of width `240px`, that can be viewed within the container, of width `1000px`, is `Math.floor(1000px/240px) = 4`. Hence container can only fit `4` items at a time.

We have initialized all the state variables and calculated the default values except for the `scrollAmount`. This is because we need to calculate the `scrollAmount` only when the carousel is scrolled. So we will do that in the `useEffect` hook

```js
useEffect(() => {
  const current = Math.floor(activeCardIdx / ITEMS_IN_VIEW);
  const prev = Math.floor((activeCardIdx - 1) / ITEMS_IN_VIEW);
  const next = Math.floor((activeCardIdx + 1) / ITEMS_IN_VIEW);
  let amt = 0;
  if (props.batchScroll) {
    if (current === prev)
      amt = -(childWidth + spacing * 4) * prev * ITEMS_IN_VIEW;
    else if (current === next)
      amt = -(childWidth + spacing * 4) * current * ITEMS_IN_VIEW;
    else
      amt =
        activeCardIdx >= ITEMS_IN_VIEW % activeCardIdx
          ? -(childWidth + spacing * 4) * activeCardIdx
          : 0;
  } else {
    amt =
      activeCardIdx >= ITEMS_IN_VIEW % activeCardIdx
        ? -(childWidth + spacing * 4) * activeCardIdx
        : 0;
  }
  setScrollAmount(amt);
}, [activeCardIdx]);
```

The `useEffect` hook is used here to calculate the `scrollAmount` whenever the `activeCardIdx` changes. The `useEffect` hook takes a callback function as the first argument and an array of dependencies as the second argument. The callback function is called whenever the value of any of the dependencies changes.

In our case, the callback function here will be called whenever the value of `activeCardIdx` changes. The `activeCardIdx` changes when the user clicks on the next or previous button or when the carousel auto plays.

To change the activeCardIdx, we will use the `setActiveCardIdx` function. This function takes the index of the carousel item that we want to show as the argument.

The final thing before creating our UI is to create a useEffect hook which runs the callback function on component mount; which means empty dependency array. This hook is to automatically play the carousel, this we need to set the interval for auto play.

```js
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
```

The callback function here will be called on component mount. The callback function here is to set the interval for auto play. The interval is set to the value of the `interval` prop. The `interval` prop is the time in milliseconds after which the carousel will auto play.

We need to return a function from the callback function. This function will be called when the component unmounts. This function is used to clear the interval. This is done so that the interval is cleared when the component unmounts. If we don't clear the interval, the callback function will be called even after the component unmounts. This will cause weird behavior in the app.

Now that we have all the state variables and the useEffect hooks, we can create our UI.

```js
return (
  <div className="w-full grid items-center " ref={containerRef}>
    <div className="w-full grid items-center">
      <div
        id="carousel-wrapper"
        className={`flex overflow-x-hidden py-5`}
        style={{
          gap: `${spacing * 4}px`,
          paddingLeft: `${spacing * 4}px`,
          paddingRight: `${spacing * 4}px`,
        }}
      >
        {ITEMS.map((item, idx) => (
          <AnimatePresence key={`carousel-item-${idx}`}>
            <motion.div
              ref={childRef}
              className="flex-1"
              initial={{
                scale: 1,
              }}
              whileHover={{
                scale:
                  activeCardIdx === idx
                    ? SCALE_FACTOR
                    : props.scaleOnHover
                    ? SCALE_FACTOR
                    : 1,
              }}
              animate={{
                scale: idx === activeCardIdx ? 1 * SCALE_FACTOR : 1,
                x: scrollAmount,
              }}
            >
              {item}
            </motion.div>
          </AnimatePresence>
        ))}
      </div>

      <div className="w-full grid place-items-center">
        {props.pagination && (
          <div className="mt-5 h-full flex gap-2">
            {ITEMS.map((_, idx) => (
              <button
                onClick={() => {
                  setActiveCardIdx(idx);
                }}
                key={`pagination-carousel-${idx}`}
                className={`w-[10px] h-[10px] ${
                  idx === activeCardIdx ? "bg-neutral-900" : "bg-neutral-300"
                } rounded-full`}
              />
            ))}
          </div>
        )}
      </div>
      <>
        {!props.hideControls && (
          <div className="flex w-full justify-center spacing-2 w-1/5 mt-5">
            <button
              onClick={() => {
                setActiveCardIdx((prevCardIdx) => {
                  return prevCardIdx - 1 < 0
                    ? ITEMS.length - 1
                    : prevCardIdx - 1;
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
        )}
      </>
    </div>
  </div>
);
```

Lets look at the code below the actual carousel and finish it before moving on to the carousel component.

We see that if the `pagination` prop is true, we render a div with the pagination buttons. The pagination buttons are rendered using the `ITEMS` array. The `ITEMS` array is the array of items that we pass to the carousel component. The `ITEMS` array is mapped to render a button for each item. The `onClick` handler of the button is set to a function which sets the `activeCardIdx` to the index of the item that the button is for.

We can also see that if the `hideControls` prop is false, we render a div with the next and previous buttons. The `onClick` handler of the buttons is set to a function which sets the `activeCardIdx` to the index of the previous or next item.

Now for the actual carousel component

We see that the carousel component has the outermost `div` with the width of full parent's width and the `ref` is th `containerRef`. This one defines the width of the carousel. The `ref` is set to the `containerRef` so that we can get the width of the carousel.

The next `div` is the one which contains extra items for carousel such as pagination and controls.

The next `div` contains the carousel items, and its width is set to the width of the carousel. The `gap`, `paddingLeft` and `paddingRight` are set to the value of the `spacing * 4`. This is done so that the carousel items are not cut off when the carousel is scrolled.

## Why 4?

We are adding spacing on 4 sides of each component. `PaddingLeft`, `paddingRight` and `gap`. So we need to multiply the spacing by 4.

## Rendering the Carousel Items

Each element in `ITEMS` array is rendered by wrapping them inside two components provided by framer-motion. The first component is the `AnimatePresence` component. This component is used to animate the elements when they are added or removed from the DOM. The second component is the `motion.div` component. This component is used to animate the elements when they are added or removed from the DOM.

`AnimatePresence` can animate the elements not only when the children components are mounted, but when they are unmounted. This means exit animations can be played when the children components are unmounted.

The `motion.div` component is an addition to the `html` `div` element. This component can be used to animate the `div` element. The `motion.div` component has the `initial`, `whileHover`, `animate` props. The `initial` prop is used to set the initial state of the element. The `whileHover` prop is used to set the state of the element when the element is hovered. The `animate` prop is used to set the state of the element when the element is mounted.

We need to set the key of the `AnimatePresence` component to `carousel-item-${idx}`. This is done so that the AnimatePresence component can animate the elements when they are added or removed from the DOM.

The `motion.div` component has the `ref` prop set to the `childRef`. This is done so that we can get the width of the carousel items.

The `motion.div` component has the `initial` prop set to an object with the `scale` property set to 1. This is done so that the carousel items are not scaled when they are mounted.

When user hovers, if the `scaleOnHover` is true, the items should be scaled by factor of `SCALE_FACTOR`. But, the active item already has a scale of `SCALE_FACTOR`. So, if the `scaleOnHover` is true, and if the hovering item is not the active item, the item should be scaled by factor of `SCALE_FACTOR`. If the `scaleOnHover` is false, the item should not be scaled.

Each div should be animated by the `x` and the `scale` property. The `x` property defines the translation of the element along the x-axis. The `x` property is set to the `scrollAmount` whose value is calculated using the `activeCardIdx` and the width of the carousel items above inside the `useEffect` hook.

The `scale` property is set to the `idx === activeCardIdx ? 1 * SCALE_FACTOR : 1`. This is done so that the active item is scaled by factor of `SCALE_FACTOR`.

We finally set the child of `motion.div` to be the actual item that we want to render.

Thats It! We got it

Now we can use the Carousel Component inside any component that we want to use it in. We can pass the items that we want to render in the carousel as the `items` prop. We can also pass the `pagination` prop to render the pagination buttons. We can also pass the `hideControls` prop to hide the next and previous buttons. The carousel is responsive by design and will work on any screen size, or on any size of the parent's div. The only thing you need to worry is the width of the child element. The child element should be visible within the parent div.

## Conclusion

We can now use the carousel component with variations like this

```js
import React from "react";
import Card from "./components/Card";
import Carousel from "./components/Carousel";
import { ITEMS } from "./utils/mockdata";

export default function App() {
  return (
    <div className="flex flex-col gap-10 p-10 overflow-y-hidden">
      <Wrapper>
        <h1 className="font-bold text-lg px-7">Individual Scroll</h1>
        <div className="w-full overflow-y-hidden">
          <Carousel>
            {ITEMS.map((item, idx) => (
              <Card item={item} key={`carousel-default-${idx}`} />
            ))}
          </Carousel>
        </div>
      </Wrapper>
      <Wrapper>
        <h1 className="font-bold text-lg px-7">Pagination</h1>
        <div className="w-full overflow-y-hidden">
          <Carousel pagination>
            {ITEMS.map((item, idx) => (
              <Card item={item} key={`carousel-default-${idx}`} />
            ))}
          </Carousel>
        </div>
      </Wrapper>
      <Wrapper>
        <h1 className="font-bold text-lg px-7">Scale on Hover</h1>
        <div className="w-full overflow-y-hidden">
          <Carousel scaleOnHover>
            {ITEMS.map((item, idx) => (
              <Card item={item} key={`carousel-default-${idx}`} />
            ))}
          </Carousel>
        </div>
      </Wrapper>
      <Wrapper>
        <h1 className="font-bold text-lg px-7">Custom Spacing</h1>
        <div className="w-full overflow-y-hidden">
          <Carousel spacing={20}>
            {ITEMS.map((item, idx) => (
              <Card item={item} key={`carousel-default-${idx}`} />
            ))}
          </Carousel>
        </div>
      </Wrapper>
      <Wrapper>
        <h1 className="font-bold text-lg px-7">Batch Scroll</h1>
        <div className="w-full overflow-y-hidden">
          <Carousel batchScroll>
            {ITEMS.map((item, idx) => (
              <Card item={item} key={`carousel-default-${idx}`} />
            ))}
          </Carousel>
        </div>
      </Wrapper>
      <Wrapper>
        <h1 className="font-bold text-lg px-7">Automatic Scroll</h1>
        <div className="w-full overflow-y-hidden">
          <Carousel pagination autoPlay interval={1000} hideControls>
            {ITEMS.map((item, idx) => (
              <Card item={item} key={`carousel-default-${idx}`} />
            ))}
          </Carousel>
        </div>
      </Wrapper>
      <Wrapper>
        <h1 className="font-bold text-lg px-7">Automatic Batch Scroll</h1>
        <div className="w-full overflow-y-hidden">
          <Carousel batchScroll autoPlay interval={500} hideControls>
            {ITEMS.map((item, idx) => (
              <Card item={item} key={`carousel-default-${idx}`} />
            ))}
          </Carousel>
        </div>
      </Wrapper>
    </div>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return <div className="w-full bg-neutral-200 py-5 rounded">{children}</div>;
}
```

That all for this tutorial. I hope you enjoyed it. If you find any issues, add them in the github repository. This is not a react component that you can npm install though. You can copy the code and use it in your project. If you want to use it as a react component, you can fork the repository and make it into a react component. I will be happy to merge your pull request.

Alright! Bye now.
