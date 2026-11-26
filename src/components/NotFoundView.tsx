import React from 'react';
import { Compass, Home } from 'lucide-react';

export const NotFoundView: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => (
  <div className="flex-1 flex items-center justify-center p-6 min-h-[calc(100vh-4rem)]">
    <div className="max-w-md text-center">
      <span className="inline-flex p-4 rounded-3xl bg-white/5 border border-white/10 text-(--brand-light)">
        <Compass className="w-10 h-10" />
      </span>
      <p className="mt-5 text-6xl font-black text-white tabular-nums tracking-tight">404</p>
      <h1 className="mt-2 text-lg font-extrabold text-white">Không tìm thấy trang này</h1>
      <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">
        Đường dẫn có thể đã sai, hoặc kênh / buổi live này không còn tồn tại.
      </p>
      <button
        onClick={onGoHome}
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-(--brand) hover:bg-(--brand-hover) shadow-lg transition-colors cursor-pointer"
      >
        <Home className="w-4 h-4" /> Về trang chủ
      </button>
    </div>
  </div>
);
