import React, { useState } from 'react';
import {
  Sparkles,
  Crown,
  Check,
  ShoppingBag,
  Trash2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Gift,
} from 'lucide-react';
import type { LiveProduct } from '../data/mockData';
import type { ActiveTab } from './Navbar';
import { AnimatedArrow } from './AnimatedArrow';

interface WalletViewProps {
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  cartItems: { product: LiveProduct; qty: number }[];
  onClearCart: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const WalletView: React.FC<WalletViewProps> = ({
  coins,
  setCoins,
  cartItems,
  onClearCart,
  setActiveTab,
}) => {
  const [purchaseToast, setPurchaseToast] = useState<string | null>(null);
  const [subTier, setSubTier] = useState<number>(2);

  const coinPackages = [
    { id: 'pkg-1', coins: 500, bonus: 50, price: '99.000đ', popular: false },
    { id: 'pkg-2', coins: 1500, bonus: 250, price: '279.000đ', popular: true },
    { id: 'pkg-3', coins: 5000, bonus: 1200, price: '890.000đ', popular: false },
    { id: 'pkg-4', coins: 15000, bonus: 4500, price: '2.490.000đ', popular: false },
  ];

  const handleTopup = (amount: number, bonus: number) => {
    const total = amount + bonus;
    setCoins((prev) => prev + total);
    setPurchaseToast(`🎉 Nạp thành công +${total.toLocaleString('vi-VN')} Xu vào Ví của bạn!`);
    setTimeout(() => setPurchaseToast(null), 3500);
  };

  const totalCartPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-[#0E0E12]">
      {/* Top Wallet Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-violet-600/20 to-rose-500/20 border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Ví Kim Cương & Hội Viên PulseLive
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tabular-nums">
            Số dư hiện tại: <span className="text-amber-400">{coins.toLocaleString('vi-VN')} Xu</span>
          </h1>
          <p className="text-xs text-zinc-300">
            Sử dụng Xu để gửi Quà tặng hiệu ứng 3D, nhắn Super Chat ghim nổi bật và tiếp máu đấu PK.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('watch')}
          className="group inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-slate-950 font-extrabold text-xs shadow-lg hover:bg-zinc-200 transition-colors cursor-pointer shrink-0"
        >
          <AnimatedArrow direction="left" />
          Quay lại Phòng Live dùng Xu
        </button>
      </div>

      {purchaseToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs sm:text-sm font-extrabold flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-400" />
          <span>{purchaseToast}</span>
        </div>
      )}

      {/* 1. COIN TOP-UP PACKAGES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-400" />
              <span>Nạp Nhanh Gói Xu Ưu Đãi</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Bấm chọn gói bất kỳ để cộng ngay số dư Xu vào tài khoản dùng thử
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
            <QrCode className="w-4 h-4 text-emerald-400" /> VietQR • MoMo • Thẻ Quốc Tế
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coinPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative p-5 rounded-2xl bg-[#15151E] border transition-all flex flex-col justify-between ${
                pkg.popular
                  ? 'border-amber-400 shadow-xl ring-1 ring-amber-400/30'
                  : 'border-white/10 hover:border-white/25'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  BÁN CHẠY NHẤT
                </span>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💎</span>
                  <div>
                    <h3 className="text-lg font-black text-white tabular-nums">
                      {pkg.coins.toLocaleString('vi-VN')} Xu
                    </h3>
                    <span className="text-xs font-bold text-emerald-400">
                      + Tặng thêm {pkg.bonus} Xu
                    </span>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 mt-3">
                  Mở khóa đầy đủ hiệu ứng Tên lửa, Siêu xe và Rồng vàng trong phòng live.
                </p>
              </div>

              <button
                onClick={() => handleTopup(pkg.coins, pkg.bonus)}
                className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-95 text-slate-950 font-black text-xs shadow cursor-pointer"
              >
                Nạp Ngay • {pkg.price}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 2. VIP SUBSCRIPTION TIERS & LIVE COMMERCE CART */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subscription Tiers (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-3xl bg-[#15151E] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-violet-400" />
              <span>Gói Đăng Ký Hội Viên Kênh (Channel Sub Tiers)</span>
            </h2>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Không quảng cáo
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                tier: 1,
                name: 'Hội Viên Bạc (Tier 1)',
                price: '79.000đ/tháng',
                perks: ['Huy hiệu ⭐ Sub trước tên', '15 Bộ Emote kênh', 'Xem 1080p60 mượt'],
              },
              {
                tier: 2,
                name: 'Hội Viên Vàng (Tier 2)',
                price: '149.000đ/tháng',
                perks: ['Huy hiệu 💎 VIP Phát Sáng', 'Toàn bộ 35 Emote động', 'Tặng 300 Xu mỗi tháng'],
              },
              {
                tier: 3,
                name: 'Đại Gia Bảo Trợ (Tier 3)',
                price: '399.000đ/tháng',
                perks: ['Huy hiệu 👑 TOP 1 Độc Quyền', 'Hiệu ứng vào phòng Live', 'Tặng 1,000 Xu mỗi tháng'],
              },
            ].map((item) => {
              const active = subTier === item.tier;
              return (
                <div
                  key={item.tier}
                  onClick={() => setSubTier(item.tier)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    active
                      ? 'bg-violet-600/15 border-violet-400'
                      : 'bg-white/[0.02] border-white/8 hover:border-white/20'
                  }`}
                >
                  <div>
                    <h3 className="text-xs font-extrabold text-white">{item.name}</h3>
                    <p className="text-sm font-black text-violet-300 mt-1">{item.price}</p>
                    <ul className="mt-3 space-y-1.5 text-[11px] text-zinc-300">
                      {item.perks.map((p) => (
                        <li key={p} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTopup(300, 0);
                    }}
                    className={`mt-4 w-full py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                      active
                        ? 'bg-violet-600 text-white'
                        : 'bg-white/10 text-zinc-200 hover:bg-white/15'
                    }`}
                  >
                    {active ? 'Gói Đang Chọn' : 'Chọn Gói Này'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Commerce Shopping Cart Checkout (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-[#15151E] border border-white/10 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <span>Giỏ Hàng Live Commerce</span>
              </h2>
              {cartItems.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-zinc-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa giỏ
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <p className="text-xs text-zinc-400">
                  Chưa có sản phẩm nào trong giỏ hàng Live.
                </p>
                <button
                  onClick={() => setActiveTab('watch')}
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 transition-colors cursor-pointer"
                >
                  Vào Phòng Live chọn chế độ "Live Bán Hàng" để săn Flash Sale
                  <AnimatedArrow />
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                {cartItems.map(({ product, qty }) => (
                  <div
                    key={product.id}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/8 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-11 h-11 rounded-lg object-cover shrink-0"
                      />
                      <div className="truncate">
                        <p className="text-xs font-bold text-white truncate">{product.name}</p>
                        <p className="text-[11px] text-amber-400 font-bold tabular-nums">
                          {product.price.toLocaleString('vi-VN')}đ × {qty}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Tổng thanh toán (Đã áp Voucher Live):</span>
              <strong className="text-base font-black text-amber-400 tabular-nums">
                {totalCartPrice.toLocaleString('vi-VN')}đ
              </strong>
            </div>

            <button
              disabled={cartItems.length === 0}
              onClick={() => {
                onClearCart();
                setPurchaseToast('🛍️ Đặt hàng Flash Sale thành công! Đơn hàng đang được chuẩn bị.');
                setTimeout(() => setPurchaseToast(null), 3500);
              }}
              className="w-full py-2.5 rounded-xl bg-amber-400 disabled:opacity-40 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Chốt Đơn Ngay Trong Phiên Live</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
