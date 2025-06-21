import TemplatePages from '../../components/TemplatePages';

export default function GetOpportunityPage() {
  return (
    <TemplatePages
      title="Get Opportunity"
      subtitle="Encontre oportunidades reais para sua jornada nos EUA."
      ctaText="Buscar oportunidades"
      ctaHref="/formulario"
    >
      <div className="flex flex-col items-center">
        <img src="/images/tools/get-opportunity.png" alt="Get Opportunity" className="mb-6 rounded-xl shadow-lg w-40 h-40 object-cover" />
        <p className="text-lg text-gray-700 text-center mb-6">Ferramenta para encontrar oportunidades nos EUA.</p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="font-semibold text-xl text-azul-petroleo mb-3">Exemplos de Aplicação</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Exemplo: Busque vagas de trabalho.</li>
            <li>Exemplo: Veja oportunidades por estado.</li>
            <li>Exemplo: Receba alertas personalizados.</li>
          </ul>
        </div>
      </div>
    </TemplatePages>
  );
}
