type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

type Props = {
  products: Product[];
  onSelect: (productId: string) => void;
};

export default function IdleScreen({ products, onSelect }: Props) {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <header className="mb-6 flex items-end justify-center gap-x-2">
        <h1 className="text-xl font-bold tracking-tight">🍀</h1>
        <p className="muted">재고 0은 선택 불가</p>
      </header>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 w-xs relative top-24 left-28">
        {products.map((p) => {
          const disabled = p.stock === 0;
          return (
            <button
              key={p.id}
              disabled={disabled}
              className={`rounded-xl border p-3 text-left shadow-sm transition w-24 text-white bg-[#1A1A1A] 
                ${disabled ? 'cursor-not-allowed opacity-40' : 'hover:shadow-md -translate-y-0.5'}`}
              onClick={() => onSelect(p.id)}
            >
              <div className="text-lg font-semibold">{p.name}</div>
              <div className="muted">{p.price.toLocaleString()}원</div>
              <div className="mt-1 text-sm text-gray-400">재고: {p.stock}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
