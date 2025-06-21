const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-azul-claro to-azul-petroleo flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-baskerville text-3xl text-azul-petroleo font-bold">
            LifeWayUSA
          </h1>
          <p className="text-gray-600 mt-2">Sua jornada para os Estados Unidos começa aqui</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
