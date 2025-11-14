import Login from './login';

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Bem-vindo ao Meu App
          </h1>
          <p className="text-xl text-gray-600">
            Sua aplicação Next.js está funcionando!
          </p>
        </header>
        
        <main className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Sobre o Projeto
              </h2>
              <p className="text-gray-600 mb-4">
                Este é um projeto Next.js configurado com Tailwind CSS e convertido para JavaScript.
              </p>
              <ul className="list-disc list-inside text-gray-600">
                <li>Componentes em JavaScript</li>
                <li>Estrutura organizada</li>
                <li>Sistema de login</li>
                <li>Design responsivo</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Componentes Disponíveis
              </h2>
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                  <strong className="text-blue-800">Login Component</strong>
                  <p className="text-blue-600 text-sm">
                    Componente de autenticação com formulário
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                  <strong className="text-green-800">Index Component</strong>
                  <p className="text-green-600 text-sm">
                    Página principal da aplicação
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Acesso ao Sistema
            </h2>
            <Login />
          </div>
        </main>
      </div>
    </div>
  );
}