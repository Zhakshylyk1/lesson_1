import { useMemo, useState, type ReactNode } from 'react';
import {
  Menu, Search, ShoppingBag, Plus, Minus, X,
  CreditCard, Banknote, QrCode, CheckCircle2, Trash2, User,
} from 'lucide-react';
import { globusProducts, superAdmin, type MarketProduct } from './data/mockData';

type Pay = 'card' | 'qr' | 'cash';
interface CartItem { product: MarketProduct; quantity: number }

const PAYMENTS: { id: Pay; title: string; hint: string; icon: typeof CreditCard }[] = [
  { id: 'card', title: 'Картой', hint: 'Visa / Mastercard', icon: CreditCard },
  { id: 'qr', title: 'QR-код', hint: 'Быстро', icon: QrCode },
  { id: 'cash', title: 'Наличными', hint: 'При получении', icon: Banknote },
];


function Modal({ onClose, children, side = false }: { onClose: () => void; children: ReactNode; side?: boolean }) {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex bg-black/40 backdrop-blur-sm animate-in fade-in ${
        side ? 'justify-end' : 'items-center justify-center p-4'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={
          side
            ? 'flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right'
            : 'relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95'
        }
      >
        {children}
      </div>
    </div>
  );
}

const CloseBtn = ({ onClick, className = '' }: { onClick: () => void; className?: string }) => (
  <button onClick={onClick} className={`flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 ${className}`}>
    <X className="h-4 w-4" />
  </button>
);

const PrimaryBtn = ({ children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...p}
    className="w-full rounded-2xl bg-gradient-to-r from-[#009640] to-[#00b350] py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition active:scale-[0.98] hover:brightness-105"
  >
    {children}
  </button>
);

function Qty({ quantity, onMinus, onPlus }: { quantity: number; onMinus: () => void; onPlus: () => void }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1">
      <button onClick={onMinus} className="text-slate-500 hover:text-rose-500">
        {quantity === 1 ? <Trash2 className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
      </button>
      <span className="w-4 text-center text-xs font-bold">{quantity}</span>
      <button onClick={onPlus} className="text-slate-500 hover:text-[#009640]">
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}


export default function App() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<MarketProduct | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pay, setPay] = useState<Pay>('card');
  const [modal, setModal] = useState<null | 'cart' | 'profile' | 'qr' | 'success'>(null);
  const [toast, setToast] = useState<string | null>(null);

  const count = cart.reduce((s, i) => s + i.quantity, 0);
  const total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const products = useMemo(
    () => globusProducts.filter((p) => p.title.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const change = (product: MarketProduct, delta: 1 | -1, notify = false) => {
    setCart((prev) => {
      const next = prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + delta } : i));
      if (delta === 1 && !prev.some((i) => i.product.id === product.id)) next.push({ product, quantity: 1 });
      return next.filter((i) => i.quantity > 0);
    });
    if (notify) showToast(`«${product.title}» добавлен в корзину`);
  };

  const checkout = () => setModal(pay === 'qr' ? 'qr' : 'success');

  const finish = () => {
    setCart([]);
    setModal(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-white to-white font-sans text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition hover:bg-slate-200">
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex flex-col leading-none">
            <span className="text-xl font-black tracking-tight text-[#009640]">GLOBUS</span>
            <span className="text-xs font-semibold italic text-[#f37021]">Online</span>
          </div>

          <div className="relative order-last w-full md:order-none md:mx-4 md:w-auto md:flex-1 md:max-w-xl">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найти в Globus Online"
              className="w-full rounded-xl border border-transparent bg-slate-100 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setModal('cart')}
              className="flex items-center gap-2 rounded-xl bg-[#009640] px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 transition hover:brightness-110"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="rounded-full bg-white/25 px-1.5">{count}</span>
              <span className="hidden sm:inline">{total} сом</span>
            </button>
            <button
              onClick={() => setModal('profile')}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 transition hover:bg-slate-200"
            >
              <User className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

  
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Фрукты</h1>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            {products.length} товаров
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="group rounded-3xl border border-slate-100 bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/5 sm:p-4"
            >
              <div
                onClick={() => setSelected(p)}
                className="relative mb-3 flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50 p-4"
              >
                <img src={p.image} alt={p.title} className="h-full w-full object-contain transition duration-300 group-hover:scale-110" />
                <button
                  onClick={(e) => { e.stopPropagation(); change(p, 1, true); }}
                  className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#009640] text-white shadow-lg transition hover:scale-110"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-baseline gap-1.5 px-1">
                <span className="text-lg font-extrabold">{p.price} сом</span>
                <span className="text-xs text-slate-400">{p.unit || '/кг'}</span>
              </div>
              <h3 onClick={() => setSelected(p)} className="mt-1 line-clamp-2 cursor-pointer px-1 text-sm leading-snug text-slate-600 hover:text-[#009640]">
                {p.title}
              </h3>
            </div>
          ))}
        </div>

        {products.length === 0 && <p className="py-20 text-center text-slate-400">Ничего не найдено </p>}
      </main>

    
      {modal === 'cart' && (
        <Modal side onClose={() => setModal(null)}>
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <h3 className="flex items-center gap-2 text-base font-bold">
              <ShoppingBag className="h-5 w-5 text-[#009640]" /> Корзина
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{count}</span>
            </h3>
            <CloseBtn onClick={() => setModal(null)} />
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center text-sm text-slate-400">Корзина пуста </div>
            ) : (
              <>
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <img src={product.image} alt="" className="h-14 w-14 shrink-0 rounded-xl bg-white object-contain p-1" />
                    <div className="min-w-0 flex-1">
                      <h4 className="line-clamp-1 text-xs font-semibold">{product.title}</h4>
                      <div className="mt-0.5 text-xs font-bold">{product.price * quantity} сом</div>
                    </div>
                    <Qty quantity={quantity} onMinus={() => change(product, -1)} onPlus={() => change(product, 1)} />
                  </div>
                ))}

                <div className="pt-3">
                  <div className="mb-2 text-sm font-bold">Способ оплаты</div>
                  <div className="grid grid-cols-3 gap-2">
                    {PAYMENTS.map(({ id, title, hint, icon: Icon }) => {
                      const active = pay === id;
                      return (
                        <button
                          key={id}
                          onClick={() => setPay(id)}
                          className={`relative rounded-2xl border p-3 text-left transition ${
                            active ? 'border-[#009640] bg-emerald-50 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {active && <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-[#009640]" />}
                          <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${active ? 'bg-[#009640] text-white' : 'bg-slate-100 text-slate-600'}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="text-xs font-bold">{title}</div>
                          <div className="mt-0.5 text-[10px] text-slate-400">{hint}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {cart.length > 0 && (
            <div className="space-y-3 border-t border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between text-sm font-bold">
                <span>Итого</span>
                <span className="text-xl text-[#009640]">{total} сом</span>
              </div>
              <PrimaryBtn onClick={checkout}>
                {pay === 'cash' ? 'Заказать с оплатой при получении' : pay === 'qr' ? 'Показать QR-код →' : 'Перейти к оплате →'}
              </PrimaryBtn>
            </div>
          )}
        </Modal>
      )}

      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <CloseBtn onClick={() => setSelected(null)} className="absolute right-4 top-4" />
          <img src={selected.image} alt={selected.title} className="mx-auto mb-4 h-36 w-36 object-contain" />
          <div className="text-base font-bold">{selected.title}</div>
          <div className="mb-2 text-lg font-extrabold text-[#009640]">
            {selected.price} сом <span className="text-xs font-normal text-slate-400">{selected.unit}</span>
          </div>
          <p className="mb-4 text-xs text-slate-500">{selected.description}</p>
          <div className="mb-4 space-y-1 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            <div>Страна: <b className="text-slate-900">{selected.manufacturer.country}</b></div>
            <div>Город: <b className="text-slate-900">{selected.manufacturer.city}</b></div>
          </div>
          <PrimaryBtn onClick={() => { change(selected, 1, true); setSelected(null); }}>Добавить в корзину</PrimaryBtn>
        </Modal>
      )}

      {modal === 'profile' && (
        <Modal onClose={() => setModal(null)}>
          <CloseBtn onClick={() => setModal(null)} className="absolute right-4 top-4" />
          <h3 className="mb-4 text-base font-bold">Профиль</h3>
          <div className="mb-4 space-y-2 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
            <div>Имя: <b className="text-slate-900">{superAdmin.name}</b></div>
            <div>Email: <b className="text-slate-900">{superAdmin.email}</b></div>
            <div>Роль: <b className="text-slate-900">{superAdmin.role}</b></div>
          </div>
          <button onClick={() => setModal(null)} className="w-full rounded-xl bg-slate-100 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200">
            Закрыть
          </button>
        </Modal>
      )}

      {/* QR */}
      {modal === 'qr' && (
        <Modal onClose={() => setModal('cart')}>
          <CloseBtn onClick={() => setModal('cart')} className="absolute right-4 top-4" />
          <div className="pt-2 text-center">
            <h2 className="text-xl font-extrabold">Оплата по QR</h2>
            <p className="mt-1 text-xs text-slate-400">Отсканируйте код в банковском приложении</p>

            <div className="mt-5 rounded-3xl border border-slate-200 p-5 shadow-sm">
              <div className="mx-auto grid h-48 w-48 grid-cols-9 gap-1">
                {Array.from({ length: 81 }, (_, i) => {
                  const edge = i < 9 || i > 71 || i % 9 === 0 || i % 9 === 8;
                  return <div key={i} className={edge || (i * 17 + i * i) % 7 < 3 ? 'rounded-sm bg-slate-900' : ''} />;
                })}
              </div>
            </div>

            <div className="my-4 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <span className="text-xs text-slate-500">К оплате</span>
              <span className="text-xl font-extrabold text-[#009640]">{total} сом</span>
            </div>
            <PrimaryBtn onClick={() => setModal('success')}>Я оплатил</PrimaryBtn>
          </div>
        </Modal>
      )}

      
      {modal === 'success' && (
        <Modal onClose={finish}>
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-24 w-24 animate-bounce items-center justify-center rounded-full bg-emerald-50 [animation-iteration-count:1]">
              <CheckCircle2 className="h-14 w-14 text-[#009640]" />
            </div>
            <h2 className="text-2xl font-extrabold">Заказ оформлен!</h2>
            <p className="mt-2 text-sm text-slate-500">Спасибо за покупку в Globus Online.<br />Мы уже начали собирать ваш заказ.</p>
            <div className="my-5 space-y-2 rounded-2xl bg-slate-50 p-4 text-xs">
              <div className="flex justify-between"><span className="text-slate-400">Сумма</span><b>{total} сом</b></div>
              <div className="flex justify-between"><span className="text-slate-400">Статус</span><b className="text-[#009640]">В обработке</b></div>
            </div>
            <PrimaryBtn onClick={finish}>Отлично</PrimaryBtn>
          </div>
        </Modal>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-[80] rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-lg animate-in slide-in-from-bottom">
          {toast}
        </div>
      )}
    </div>
  );
}