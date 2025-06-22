import TemplatePages from '../../components/TemplatePages';

export default function ProjectUSAPage() {
  return (
    <TemplatePages
      title="ProjectUSA"
      subtitle="Esta ferramenta estará disponível em breve"
      ctaText="Voltar ao Início"
      ctaHref="/"
    >
      <div className="text-center py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 mb-8">
          <div className="text-6xl mb-4">🚧</div>
          <h3 className="text-2xl font-baskerville text-gray-800 mb-4">Em Desenvolvimento</h3>
          <p className="text-lg text-gray-600 mb-6">
            O ProjectUSA será sua central de comando para planejar, acompanhar 
            e controlar todos os aspectos da sua mudança para os EUA.
          </p>
          <div className="bg-yellow-100 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">O que estará disponível:</h4>
            <ul className="text-left text-gray-700 space-y-1">
              <li>• Dashboard centralizado do seu projeto de mudança</li>
              <li>• Controle detalhado de custos e orçamentos</li>
              <li>• Timeline de atividades e prazos</li>
              <li>• Gestão de documentos necessários</li>
              <li>• Relatórios de progresso personalizados</li>
            </ul>
          </div>
          <p className="text-sm text-gray-500">
            Cadastre-se em nossa newsletter para ser notificado quando a ferramenta estiver pronta!
          </p>
        </div>
      </div>
    </TemplatePages>
  );
}
