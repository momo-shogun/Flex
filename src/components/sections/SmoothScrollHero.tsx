import { useRef, type RefObject } from 'react';
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'framer-motion';
import { SiSpacex } from 'react-icons/si';
import { FiArrowRight, FiMapPin } from 'react-icons/fi';

const SECTION_HEIGHT = 1500;

function Nav({ scrollContainerRef }: { scrollContainerRef: RefObject<HTMLDivElement | null> }) {
  const scrollToSchedule = () => {
    const el = scrollContainerRef.current?.querySelector('#launch-schedule');
    el?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 text-white bg-zinc-950/80 backdrop-blur-sm">
      <SiSpacex className="text-3xl mix-blend-difference" />
      <button
        type="button"
        onClick={scrollToSchedule}
        className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
      >
        LAUNCH SCHEDULE <FiArrowRight />
      </button>
    </nav>
  );
}

function CenterImage({ containerRef }: { containerRef: RefObject<HTMLDivElement | null> }) {
  const { scrollY } = useScroll(containerRef ? { container: containerRef } : undefined);

  const clip1 = useTransform(scrollY, [0, SECTION_HEIGHT], [25, 0]);
  const clip2 = useTransform(scrollY, [0, SECTION_HEIGHT], [75, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const backgroundSize = useTransform(
    scrollY,
    [0, SECTION_HEIGHT + 500],
    ['170%', '100%']
  );
  const opacity = useTransform(
    scrollY,
    [SECTION_HEIGHT, SECTION_HEIGHT + 500],
    [1, 0]
  );

  return (
    <motion.div
      className="sticky top-0 h-[70vh] min-h-[400px] w-full"
      style={{
        clipPath,
        backgroundSize,
        opacity,
        backgroundImage:
          'url(https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop)',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
}

interface ParallaxImgProps {
  containerRef: RefObject<HTMLDivElement | null>;
  className?: string;
  alt: string;
  src: string;
  start: number;
  end: number;
}

function ParallaxImg({ containerRef, className, alt, src, start, end }: ParallaxImgProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  const { scrollYProgress } = useScroll(
    containerRef
      ? { container: containerRef, target: imgRef, offset: [`${start}px end`, `end ${-end}px`] }
      : { target: imgRef, offset: [`${start}px end`, `end ${-end}px`] }
  );

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);

  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      ref={imgRef}
      style={{ transform, opacity }}
    />
  );
}

function ParallaxImages({ containerRef }: { containerRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-[200px]">
      <ParallaxImg
        containerRef={containerRef}
        src="https://images.unsplash.com/photo-1484600899469-230e8d1d59c0?q=80&w=2670&auto=format&fit=crop"
        alt="Space launch"
        start={-200}
        end={200}
        className="w-1/3"
      />
      <ParallaxImg
        containerRef={containerRef}
        src="https://images.unsplash.com/photo-1446776709462-d6b525c57bd3?q=80&w=2670&auto=format&fit=crop"
        alt="Space launch"
        start={200}
        end={-250}
        className="mx-auto w-2/3"
      />
      <ParallaxImg
        containerRef={containerRef}
        src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=2370&auto=format&fit=crop"
        alt="Orbiting satellite"
        start={-200}
        end={200}
        className="ml-auto w-1/3"
      />
      <ParallaxImg
        containerRef={containerRef}
        src="https://images.unsplash.com/photo-1494022299300-899b96e49893?q=80&w=2670&auto=format&fit=crop"
        alt="Orbiting satellite"
        start={0}
        end={-500}
        className="ml-24 w-5/12"
      />
    </div>
  );
}

function Hero({ containerRef }: { containerRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div
      style={{ height: `calc(${SECTION_HEIGHT}px + 70vh)` }}
      className="relative w-full"
    >
      <CenterImage containerRef={containerRef} />
      <ParallaxImages containerRef={containerRef} />
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-zinc-950/0 to-zinc-950 pointer-events-none" />
    </div>
  );
}

interface ScheduleItemProps {
  title: string;
  date: string;
  location: string;
}

function ScheduleItem({ title, date, location }: ScheduleItemProps) {
  return (
    <motion.div
      initial={{ y: 48, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ ease: 'easeInOut', duration: 0.75 }}
      className="mb-9 flex items-center justify-between border-b border-zinc-800 px-3 pb-9"
    >
      <div>
        <p className="mb-1.5 text-xl text-zinc-50">{title}</p>
        <p className="text-sm uppercase text-zinc-500">{date}</p>
      </div>
      <div className="flex items-center gap-1.5 text-end text-sm uppercase text-zinc-500">
        <p>{location}</p>
        <FiMapPin />
      </div>
    </motion.div>
  );
}

function Schedule() {
  return (
    <section
      id="launch-schedule"
      className="mx-auto max-w-5xl px-4 py-48 text-white"
    >
      <motion.h1
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ ease: 'easeInOut', duration: 0.75 }}
        className="mb-20 text-4xl font-black uppercase text-zinc-50"
      >
        Launch Schedule
      </motion.h1>
      <ScheduleItem title="NG-21" date="Dec 9th" location="Florida" />
      <ScheduleItem title="Starlink" date="Dec 20th" location="Texas" />
      <ScheduleItem title="Starlink" date="Jan 13th" location="Florida" />
      <ScheduleItem title="Turksat 6A" date="Feb 22nd" location="Florida" />
      <ScheduleItem title="NROL-186" date="Mar 1st" location="California" />
      <ScheduleItem title="GOES-U" date="Mar 8th" location="California" />
      <ScheduleItem title="ASTRA 1P" date="Apr 8th" location="Texas" />
    </section>
  );
}

/** Smooth scroll hero with parallax. Uses a scroll container ref so animations work inside a scrollable div (e.g. playground preview). */
export function SmoothScrollHero() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollContainerRef}
      className="h-full min-h-[500px] max-h-[75vh] overflow-auto bg-zinc-950"
    >
      <Nav scrollContainerRef={scrollContainerRef} />
      <Hero containerRef={scrollContainerRef} />
      <Schedule />
    </div>
  );
}
