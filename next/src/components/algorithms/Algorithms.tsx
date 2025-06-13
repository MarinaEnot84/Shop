'use client'
import api from '@/app';
import { useState } from 'react';

interface Breadcrumb {
  id: number;
  parent: number | null;
  advertisement_count: number;
  has_child_cache: boolean;
  name_en_us: string;
  name_ru: string;
  name_src: string;
}

const Algorithms = () => {
    const [breadcrumbPath, setBreadcrumbPath] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const buildBreadcrumbPath = (breadcrumbs: Breadcrumb[], startId: number): string => {
        const path: string[] = [];
        let currentId: number | null = startId;

        while (currentId !== null) {
            const crumb = breadcrumbs.find(b => b.id === currentId);
            if (!crumb) break;
            
            path.unshift(crumb.name_ru);
            currentId = crumb.parent;
        }

        return path.join(' → ');
    };

    const handleGetFinalBreadcrumb = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const { data } = await api.get('/breadcrumbs');
            const finalCrumbs = data.filter((crumb: Breadcrumb) => 
                !data.some((b: Breadcrumb) => b.parent === crumb.id)
            );
            
            if (finalCrumbs.length === 0) {
                throw new Error('Не найдено конечных хлебных крошек');
            }

            const randomFinalCrumb = finalCrumbs[
                Math.floor(Math.random() * finalCrumbs.length)
            ];
            const path = buildBreadcrumbPath(data, randomFinalCrumb.id);
            setBreadcrumbPath(path);
        } catch (err) {
            setError((err as Error).message || 'Произошла ошибка при загрузке данных');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Algorithms</h1>
            
            <button
                onClick={handleGetFinalBreadcrumb}
                disabled={loading}
                className="w-[185px] h-[38px] bg-[#CBD5E1] hover:bg-gray-500 text-[#18181B] font-medium text-base py-2 px-4 rounded-[6px] disabled:opacity-50 flex items-center justify-center"
            >
                {loading ? 'Загрузка...' : 'Получить цепочку хлебных крошек'}
            </button>
            
            {error && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            
            {breadcrumbPath && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Цепочка хлебных крошек:</h2>
                    <div className="bg-gray-100 p-4 rounded text-lg">
                        {breadcrumbPath}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Algorithms;