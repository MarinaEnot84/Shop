export default function ForbiddenPage() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
          <h2 className="text-2xl mb-4">Доступ запрещен</h2>
          <p className="mb-6">У вас недостаточно прав для просмотра этой страницы</p>
          <a 
            href="/products" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Вернуться в панель управления
          </a>
        </div>
      </div>
    );
  }