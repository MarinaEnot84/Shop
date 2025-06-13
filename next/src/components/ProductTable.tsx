import Link from 'next/link';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import ProductEditModal from './ProductEditModal';
import { useState } from 'react';
import api from '@/app';

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

interface ProductTableProps {
  products: Product[];
  manufacturers: Manufacturer[];
  onDelete: (id: number) => void;
  userRoles?: Role[];
}

export default function ProductTable({ products, manufacturers, onDelete, userRoles }: ProductTableProps) {
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);


  const getManufacturerName = (id: number): string => {
    const manufacturer = manufacturers.find((m) => m.id === id);
    return manufacturer ? manufacturer.name : 'Неизвестно';
  };
  const handleRowClick = (product: Product) => {
    setDetailProduct(product);
  };

  const handleDeleteClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setProductToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleModalDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!detailProduct) return;
    setProductToDelete(detailProduct.id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await onDelete(productToDelete);
      setShowDeleteConfirm(false);
      setProductToDelete(null);
      if (detailProduct?.id === productToDelete) {
        setDetailProduct(null);
      }
    } catch (error) {
      console.error('Ошибка при удалении товара:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b whitespace-nowrap">
              Фото
            </th>
            <th className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b whitespace-nowrap">
              Название
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Количество
            </th>
            <th className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b whitespace-nowrap hidden sm:table-cell">
              Производитель
            </th>
            <th className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b whitespace-nowrap">
              Цена
            </th>
            {userRoles?.some(role => role.id === 1) && (
              <th className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b whitespace-nowrap">
                Действия
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 pointer" onClick={() => handleRowClick(product)}>
              <td className="py-4 px-2 sm:px-4 text-sm text-gray-500 border-b">
                {product.photoUrl && 
                <div className="relative h-8 w-8 sm:h-10 sm:w-10">
                <img 
                  src={product.photoUrl} 
                  alt={product.name}
                  className="h-full w-full object-cover rounded"
                  title={product.name}
                />
                </div>}
              </td>
              <td className="py-4 px-2 sm:px-4 text-sm font-medium text-gray-900 border-b max-w-[150px] sm:max-w-none truncate">
                {product.name}
              </td>
              <td className="py-4 px-2 sm:px-4 text-sm text-gray-500 border-b hidden md:table-cell">
                {product.quantity}
              </td>
              <td className="py-4 px-2 sm:px-4 text-sm text-gray-500 border-b hidden sm:table-cell">
                {getManufacturerName(product.manufacturerId)}
              </td>
              <td className="py-4 px-2 sm:px-4 text-sm text-gray-500 border-b whitespace-nowrap">
                ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
              </td>
                <td className="py-4 px-2 sm:px-4 text-sm text-gray-500 border-b whitespace-nowrap">
                  <div className="flex space-x-1 sm:space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingProductId(product.id);
                    }}
                    className="p-1 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors"
                    title="Редактировать"
                  >
                    <PencilSquareIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#0F172A]" />
                  </button>
                    <button
                      onClick={(e) => handleDeleteClick(product.id, e)}
                      className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Удалить"
                      type="button"
                    >
                      <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#0F172A]" />
                    </button>
                  </div>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
      {detailProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-[338px] max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-end mb-2">
                <button 
                  onClick={() => setDetailProduct(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="relative h-48 mb-4">
                <img
                  src={detailProduct.photoUrl}
                  alt={detailProduct.name}
                  className="object-cover rounded-lg w-full h-full"
                />
              </div>
              
              <h2 className="text-xl font-bold mb-4">{detailProduct.name}</h2>
              
              <div className="space-y-3 mb-6">
                <p className="text-gray-600">
                  <span className="font-medium">Количество:</span> {detailProduct.quantity}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Цена:</span> ${typeof detailProduct.price === 'number' ? detailProduct.price.toFixed(2) : detailProduct.price}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Производитель:</span> {getManufacturerName(detailProduct.manufacturerId)}
                </p>
              </div>
              
              <div className="flex justify-between mt-6">
                <button 
                  className="px-[25px] py-[10px] bg-[#CBD5E1] rounded-[6px] hover:bg-gray-300 transition-colors"
                  onClick={() => setDetailProduct(null)}
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
      {editingProductId && (
        <ProductEditModal
          productId={editingProductId.toString()}
          manufacturers={manufacturers}
          isOpen={!!editingProductId}
          onClose={() => setEditingProductId(null)}
          onProductUpdated={() => window.location.reload()} 
        />
      )}
    </div>
  );
}