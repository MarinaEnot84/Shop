'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

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

  interface ProductFormData {
    name: string;
    quantity: number;
    price: string;
    photoUrl: string;
    manufacturerId: number;
  }

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: ProductFormData) => Promise<void>;
  manufacturers: Manufacturer[];
}

export default function AddProductModal({
  isOpen,
  onClose,
  onAdd,
  manufacturers,
}: AddProductModalProps) {
  const { register, handleSubmit, reset, formState: { errors }, watch, setValue, trigger, } = useForm<ProductFormData>();

  const currentManufacturerId = watch('manufacturerId');

  const onSubmit = async (data: ProductFormData) => {
    if (!data.manufacturerId || !manufacturers.some(m => m.id === data.manufacturerId)) {
      alert('Пожалуйста, выберите производителя из списка');
      return;
    }
    await onAdd({
      ...data,
      manufacturerId: Number(data.manufacturerId) 
    });
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Создание товара</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Название</label>
            <input
              {...register('name', { required: 'Обязательное поле' })}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Количество</label>
            <input
              type="number"
              {...register('quantity', { required: 'Обязательное поле', min: 0 })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Цена</label>
            <input
              type="number"
              step="0.01"
              {...register('price', { required: 'Обязательное поле', min: 0 })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Производитель</label>
            <select
              value={currentManufacturerId || ''}
              className="w-full px-3 py-2 border rounded"
              onChange={async (e) => {
                const manufacturerId = Number(e.target.value);
                setValue('manufacturerId', manufacturerId);
                await trigger('manufacturerId');
              }}
            >
              <option value={0}>Выберите производителя</option>
              {manufacturers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            {errors.manufacturerId && (
              <p className="text-red-500 text-sm mt-1">Пожалуйста, выберите производителя</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">URL изображения</label>
            <input
              type="url"
              {...register('photoUrl')}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#404040] rounded hover:bg-gray-400"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#CBD5E1] text-white rounded hover:bg-gray-400"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}