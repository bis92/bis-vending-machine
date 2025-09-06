import { useReducer, useState } from 'react';
import IdleScreen from './components/IdleScreen';
import PaymentModal from './components/PaymentModal';
import CashModal from './components/CashModal';
import CardModal from './components/CardModal';
import DispenseModal from './components/DispenseModal';
import type { Product } from './types/product';
import { productsReducer } from './reducers/productReducer';
import type { PaymentMode } from './types/payment';

const sampleProducts: Product[] = [
  { id: 'a', name: '콜라', price: 1100, stock: 5 },
  { id: 'b', name: '물', price: 600, stock: 11 },
  { id: 'c', name: '커피', price: 700, stock: 5 },
];

export default function App() {
  const [products, dispatch] = useReducer(productsReducer, sampleProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mode, setMode] = useState<PaymentMode>('idle');
  const [insertedCash, setInsertedCash] = useState(0);
  const [change, setChange] = useState<number>();
  const [isRefund, setIsRefund] = useState<boolean>(false);

  const resetFlow = () => {
    setSelectedProduct(null);
    setInsertedCash(0);
    setChange(undefined);
    setMode('idle');
    if (isRefund) {
      setIsRefund(false);
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50 flex items-center">
      <div className="mx-auto max-w-3xl p-6">
        <div className="bg-[url('/images/vending-machine.png')] bg-cover w-[44rem] h-[45rem]">
          <IdleScreen
            products={products}
            onSelect={(id) => {
              setSelectedProduct(products.find((p) => p.id === id) || null);
              setMode('payment');
            }}
          />
        </div>

        {mode === 'payment' && (
          <PaymentModal
            onCash={() => setMode('cash')}
            onCard={() => setMode('card')}
            onClose={resetFlow}
          />
        )}

        {mode === 'cash' && selectedProduct && (
          <CashModal
            inserted={insertedCash}
            price={selectedProduct?.price}
            handleInsertCash={(amount) => {
              const newInsertedCash = insertedCash + amount;
              setInsertedCash(newInsertedCash);
              if (newInsertedCash >= selectedProduct.price) {
                setChange(newInsertedCash - selectedProduct.price);
                dispatch({ type: 'DISPENSE', id: selectedProduct.id });
                setIsRefund(false);
                setMode('dispense');
              }
            }}
            handleCancelCash={() => {
              if (insertedCash > 0) {
                setChange(insertedCash);
                setInsertedCash(0);
                setMode('dispense');
                setIsRefund(true);
              } else {
                setMode('payment');
              }
            }}
          />
        )}

        {mode === 'card' && selectedProduct && (
          <CardModal
            handleCardSubmit={() => {
              dispatch({ type: 'DISPENSE', id: selectedProduct.id });
              setIsRefund(false);
              setMode('dispense');
            }}
            handleChangePaymentMethod={() => setMode('payment')}
          />
        )}

        {mode === 'dispense' && (
          <DispenseModal
            productName={selectedProduct?.name}
            change={change}
            isRefund={isRefund}
            onComplete={isRefund ? () => setMode('payment') : resetFlow}
          />
        )}
      </div>
    </div>
  );
}
