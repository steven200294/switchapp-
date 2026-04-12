"use client";

interface Props {
  photos: string[];
  title: string;
}

export default function PhotoGallery({ photos, title }: Props) {
  if (photos.length === 0) return null;

  const [main, ...rest] = photos;

  return (
    <div className="mt-4">
      {/* Mobile: stacked layout */}
      <div className="md:hidden">
        <div className="rounded-2xl overflow-hidden aspect-16/10">
          <img src={main} alt={title} className="w-full h-full object-cover" />
        </div>
        {rest.length > 0 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {rest.map((url, i) => (
              <div key={i} className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: main left + grid right */}
      <div className="hidden md:grid md:grid-cols-2 gap-3 rounded-2xl overflow-hidden" style={{ maxHeight: 400 }}>
        <div className="relative h-full min-h-[300px]">
          <img src={main} alt={title} className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
        </div>
        {rest.length > 0 && (
          <div className="grid grid-cols-2 gap-2 h-full">
            {rest.slice(0, 4).map((url, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden min-h-[140px]">
                <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                {i === 3 && rest.length > 4 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-bold text-title">+{rest.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
