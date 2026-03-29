const BUBBLES = [
  { pos: "top-[5%] left-[-8%] md:left-[-2%] lg:left-[5%]", size: "w-28 h-28 md:w-40 md:h-40 lg:w-56 lg:h-56", border: "border-4", src: "photo-1522708323590-d24dbb6b0267" },
  { pos: "bottom-[8%] left-[-8%] md:left-[0%] lg:left-[8%]", size: "w-28 h-28 md:w-44 md:h-44 lg:w-60 lg:h-60", border: "border-4", src: "photo-1512918728675-ed5a9ecdebfd" },
  { pos: "top-[15%] right-[-8%] md:right-[-2%] lg:right-[5%]", size: "w-28 h-28 md:w-48 md:h-48 lg:w-64 lg:h-64", border: "border-4", src: "photo-1493809842364-78817add7ffb" },
  { pos: "bottom-[5%] right-[-8%] md:right-[2%] lg:right-[10%]", size: "w-28 h-28 md:w-40 md:h-40 lg:w-52 lg:h-52", border: "border-4", src: "photo-1484154218962-a197022b5858" },
] as const;

const SMALL_BUBBLES = [
  { pos: "top-[45%] left-[18%]", size: "w-24 h-24", hide: "lg", opacity: "opacity-90", src: "photo-1522708323590-d24dbb6b0267" },
  { pos: "top-[22%] left-[22%]", size: "w-16 h-16", hide: "lg", opacity: "opacity-80", src: "photo-1493809842364-78817add7ffb" },
  { pos: "top-[38%] right-[16%]", size: "w-20 h-20", hide: "lg", opacity: "opacity-90", src: "photo-1512918728675-ed5a9ecdebfd" },
  { pos: "top-[28%] right-[22%]", size: "w-14 h-14", hide: "lg", opacity: "opacity-80", src: "photo-1484154218962-a197022b5858" },
] as const;

export default function DecorativeBubbles() {
  return (
    <div className="hidden md:block absolute inset-0 overflow-hidden rounded-t-[3rem] pointer-events-none z-0">
      {BUBBLES.map((b) => (
        <div key={b.src} className={`absolute ${b.pos} ${b.size} rounded-full ${b.border} border-white overflow-hidden opacity-100`}>
          <img src={`https://images.unsplash.com/${b.src}?fit=crop&w=600&q=100`} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
      {SMALL_BUBBLES.map((b) => (
        <div key={b.src + b.pos} className={`hidden ${b.hide}:block absolute ${b.pos} ${b.size} rounded-full border-2 border-white overflow-hidden ${b.opacity}`}>
          <img src={`https://images.unsplash.com/${b.src}?fit=crop&w=300&q=80`} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}
