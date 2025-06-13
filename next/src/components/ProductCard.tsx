import Link from 'next/link';
import Image from 'next/image';
import ProductEditModal from './ProductEditModal';
import { useState } from 'react';

interface Role {
  id: number;
  name: string;
}

interface Manufacturer {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  quantity: number | string;
  price: number | string;
  manufacturerId: number;
  photoUrl: string;
}

interface ProductCardProps {
  product: Product;
  manufacturers: Manufacturer[];
  onDelete: (id: number) => Promise<{ shouldRedirect: boolean; newPage?: number }>;
  userRoles?: Role[];
  currentPage: number;
  totalProducts: number;
  productsPerPage: number;
  onPageChange?: (page: number) => void;
}

export default function ProductCard({ product, manufacturers, onDelete, userRoles, currentPage,
  totalProducts,
  productsPerPage,
  onPageChange }: ProductCardProps ) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const manufacturer = manufacturers.find((m) => m.id === product.manufacturerId);

  const handleModalDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProductToDelete(product.id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      const result = await onDelete(productToDelete);
      setShowDeleteConfirm(false);
      setProductToDelete(null);
      setIsDetailModalOpen(false);

      if (result.shouldRedirect && onPageChange) {
        onPageChange(result.newPage || currentPage);
      }
    } catch (error) {
      console.error('Ошибка при удалении товара:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  const closeDetailModal = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsDetailModalOpen(false);
  };


  return (
    <div 
    className="w-full max-w-[244px] h-auto rounded-[10px] p-[10px] grid grid-rows-[auto_auto_auto] gap-[2px] bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow"
    onClick={() => setIsDetailModalOpen(true)}
  >
    <div className="w-full aspect-square rounded-[10px] overflow-hidden relative row-start-1">
      <Image
        src={product.photoUrl}
        alt={product.name}
        fill
        className="object-cover"
        unoptimized={true}
      />
    </div>

    <div className="w-full grid grid-cols-1 justify-items-center pt-1 gap-2 row-start-2">
      <h3 className="text-sm font-normal text-[#0F172A] text-center line-clamp-1">
        {product.name}
      </h3>
      <p className="text-base font-normal text-[#0F172A] text-center line-clamp-1">
        {manufacturer?.name || 'Неизвестно'}
      </p>
    </div>

    <div className="w-full grid grid-cols-2 items-center px-2 row-start-3">
      <p className="text-sm font-normal text-[#0F172A] justify-self-start">
        Кол-во: {product.quantity}
      </p>
      <p className="text-sm font-normal text-[#0F172A] justify-self-end">
        ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
      </p>
    </div>

      {isDetailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-[338px] max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-end mb-2">
                <button 
                  onClick={closeDetailModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              
              <div className="relative h-48 mb-4">
                <Image
                  src={product.photoUrl}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                  unoptimized={true}
                />
              </div>
              
              <h2 className="text-xl font-bold mb-4">{product.name}</h2>
              
              <div className="space-y-3 mb-6">
                <p className="text-gray-600">
                  <span className="font-medium">Количество:</span> {product.quantity}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Цена:</span> ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Производитель:</span> {manufacturer?.name || 'Неизвестно'}
                </p>
              </div>          
                <div className="flex justify-between mt-6">
                  <button 
                    className="px-[25px] py-[10px] bg-[#CBD5E1] rounded-[6px] hover:bg-gray-300 transition-colors"
                    onClick={closeDetailModal}
                  >
                    Назад
                  </button>
                  <button 
                    className="px-[25px] py-[10px] bg-[#404040] text-white rounded-[6px] hover:bg-gray-700 transition-colors"
                    onClick={handleModalDeleteClick}
                  >
                    Удалить
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[10px] w-[338px] p-[16px_10px] h-[154px] flex flex-col justify-between">
            <p className="text-center text-gray-800">
              Вы действительно хотите удалить товар?
            </p>
            
            <div className="flex justify-between">
              <button 
                className="px-[25px] py-[10px] bg-[#CBD5E1] rounded-[6px] hover:bg-gray-300 transition-colors"
                onClick={handleCancelDelete}
                style={{ width: '129px' }}
              >
                Отменить
              </button>
              <button 
                className="px-[25px] py-[10px] bg-[#404040] text-white rounded-[6px] hover:bg-gray-700 transition-colors"
                onClick={handleConfirmDelete}
                style={{ width: '116px' }}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}


      <ProductEditModal
        productId={product.id.toString()}
        manufacturers={manufacturers}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onProductUpdated={() => window.location.reload()} 
      />
    </div>
  );
}