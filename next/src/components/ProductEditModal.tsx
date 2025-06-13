'use client';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import api from '../app/index';
import { Dialog } from '@headlessui/react';

interface Product {
  id?: number;
  name: string;
  quantity: string;
  price: string;
  manufacturerId: number;
  photoUrl: string;
}

interface Manufacturer {
  id: number;
  name: string;
}

interface ProductEditModalProps {
  productId: string;
  manufacturers: Manufacturer[];
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
}

export default function ProductEditModal({
  productId,
  manufacturers,
  isOpen,
  onClose,
  onProductUpdated
}: ProductEditModalProps) {
  const [formData, setFormData] = useState<Product>({
    name: '',
    quantity: '',
    price: '',
    manufacturerId: 0,
    photoUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productResponse = await api.get<Product>(`/products/${productId}`);
        setFormData(productResponse.data);
      } catch (err) {
        console.error('Ошибка при загрузке товара:', err);
        onClose();
      }
    };

    if (isOpen && productId) {
      fetchProductData();
    }
  }, [productId, isOpen, onClose]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('quantity', formData.quantity);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('manufacturerId', formData.manufacturerId.toString());
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      await api.patch(`/products/${productId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onProductUpdated();
      onClose();
    } catch (err) {
      console.error('Ошибка при сохранении товара:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
          <Dialog.Title className="text-2xl font-bold mb-6">
            Редактирование товара
          </Dialog.Title>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Название</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Количество</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Цена</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Производитель</label>
              <select
                name="manufacturerId"
                value={formData.manufacturerId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Выберите производителя</option>
                {manufacturers.map((manufacturer) => (
                  <option key={manufacturer.id} value={manufacturer.id}>
                    {manufacturer.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Изображение</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded"
                accept="image/*"
              />
            </div>
            {formData.photoUrl && !imageFile && (
              <div className="mb-4">
                <img
                  src={formData.photoUrl}
                  alt="Текущее изображение"
                  className="h-32 object-cover"
                />
              </div>
            )}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}