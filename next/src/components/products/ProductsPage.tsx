'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../app/index';
import ProductCard from '../../components/ProductCard';
import ProductTable from '../../components/ProductTable';
import Pagination from '../../components/Pagination';
import AddProductModal from '@/components/AddProductModal';
import { IoGrid } from "react-icons/io5"
import { LuTableOfContents } from "react-icons/lu";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Manufacturer {
    id: number;
    name: string;
  }
  
  interface Product {
    id: number;
    name: string;
    quantity: number;
    price: string;
    photoUrl: string;
    manufacturerId: number;
  }
  
  interface Role {
    id: number;
    name: string;
    pages: string[];
  }
  
  interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
  }
  interface ProductFormData {
    name: string;
    quantity: number;
    price: string;
    photoUrl: string;
    manufacturerId: number;
  }

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(8);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); 
    }, 500); 

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
      try {
        const userResponse = await api.get<User>('/me',{
            signal: controller.signal
          });
          if (isMounted) setUser(userResponse.data);

        const response = await api.get<{
            data: Product[];
            headers: { 'x-total-count'?: string };
          }>(
          `/products?_page=${currentPage}&_limit=${itemsPerPage}&q=${debouncedSearchTerm}`, {
            signal: controller.signal
          }
        );

        if (!Array.isArray(response.data)) {
            throw new Error('Неверный формат данных товаров');
          }
        
        if (isMounted) {
            setProducts(response.data);
            setTotalItems(parseInt(response.headers['x-total-count'] || response.data.length.toString(), 10));
        }

        const manufacturersResponse = await api.get<Manufacturer[]>('/manufacturers', {
            signal: controller.signal
          });

        if (isMounted) setManufacturers(manufacturersResponse.data || []);

      } catch (err) {
        if (isMounted && !controller.signal.aborted) {
          console.error('Ошибка загрузки:', err);
          setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
          
          if ((err as any)?.response?.status === 401) {
            router.push('/login');
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
        isMounted = false;
        controller.abort();
      };
  }, [currentPage, debouncedSearchTerm, router]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddProduct = async (productData: ProductFormData) => {
    try {
      setIsLoading(true);
      const response = await api.post<Product>('/products', productData);
      setTotalItems(prev => prev + 1);
      const totalPages = Math.ceil((totalItems + 1) / itemsPerPage);
      if (currentPage !== totalPages) {
        setCurrentPage(totalPages);
      } else {
        setProducts(prev => [...prev, response.data]);
      }     
      toast.success('Товар успешно добавлен!', {
        position: "top-right",
        autoClose: 3000,
      });
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Не удалось добавить товар', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => setIsModalOpen(false), 100); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number): Promise<{ shouldRedirect: boolean; newPage?: number }> => {
    try {
      await api.delete(`/products/${id}`);
      
      const response = await api.get<Product[]>(
        `/products?_page=${currentPage}&_limit=${itemsPerPage}&q=${debouncedSearchTerm}`
      );
      
      const updatedProducts = response.data;
      const newTotalItems = parseInt(response.headers['x-total-count'] || updatedProducts.length.toString(), 10);
      
      setProducts(updatedProducts);
      setTotalItems(newTotalItems);
      
      const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);
      let shouldRedirect = false;
      let newPage = currentPage;
      
      if (updatedProducts.length === 0 && currentPage > 1) {
        shouldRedirect = true;
        newPage = Math.min(currentPage - 1, newTotalPages);
      }
      toast.success('Товар успешно удален', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      return { shouldRedirect, newPage };
    } catch (err) {
      toast.error('Произошла ошибка при удалении товара', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return { shouldRedirect: false };
    }
  };


  const getUserRoles = (): Role[] | undefined => {
    if (!user) return undefined;
    return user.roles;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
          <button 
            onClick={() => window.location.reload()}
            className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Обновить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
      <ToastContainer 
        className="toast-container"
        toastClassName="custom-toast"
        style={{ zIndex: 9999 }}
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        aria-label="Уведомления"
      />
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 w-full">
    <form className="w-full sm:w-auto sm:flex-1 sm:mr-4">
      <input
        type="text"
        placeholder="Поиск"
        className="w-[240px] h-[28px] px-[10px] py-[6px] border border-gray-300 rounded-[6px] bg-gray-200"
        value={searchTerm}
        onChange={handleSearchChange}
        autoFocus
        onBlur={(e) => e.target.focus()}
      />
    </form>
    <div className="flex items-center gap-[16px]">
      <div className="flex h-[39px] rounded-[6px] overflow-hidden border border-gray-200">
        <button
          onClick={() => setViewMode('table')}
          className={`w-[50px] h-full flex items-center justify-center ${viewMode === 'table' ? 'bg-[#94A3B8] text-white' : 'bg-[#CBD5E1]'}`}
        >
          <LuTableOfContents />
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={`w-[50px] h-full flex items-center justify-center ${viewMode === 'grid' ? 'bg-[#94A3B8] text-white' : 'bg-[##CBD5E1]'}`}
        >
          <IoGrid />
        </button>
      </div>
    </div>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="ml-[16px] px-4 py-2 bg-[#CBD5E1] text-[#18181B] rounded-[6px] h-[39px]">
        Добавить
      </button>
    </div>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                manufacturers={manufacturers}
                onDelete={handleDelete}
                userRoles={getUserRoles()}
                currentPage={currentPage}
                totalProducts={totalItems}
                productsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p>Товары не найдены</p>
            </div>
          )}
        </div>
      ) : (
        <ProductTable
          products={products}
          manufacturers={manufacturers}
          onDelete={handleDelete}
          userRoles={getUserRoles()}
        />
      )}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddProduct}
        manufacturers={manufacturers}
      />

      {products.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default ProductsPage