import TemplatePages from '../../components/TemplatePages';

export default function VisaMatchPage() {
  return (
    <TemplatePages
      title="Visa Match"
      subtitle="Descubra o visto ideal para sua jornada nos EUA."
      ctaText="Simular visto"
      ctaHref="/formulario"
    >
      <div className="flex flex-col items-center">
        <img src="/images/tools/visa-match.png" alt="Visa Match" className="mb-6 rounded-xl shadow-lg w-40 h-40 object-cover" />
        <p className="text-lg text-gray-700 text-center mb-6">Ferramenta para análise de elegibilidade de visto.</p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="font-semibold text-xl text-azul-petroleo mb-3">Exemplos de Aplicação</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Exemplo: Descubra o melhor visto para seu perfil.</li>
            <li>Exemplo: Simule diferentes situações.</li>
            <li>Exemplo: Veja requisitos detalhados.</li>
          </ul>
        </div>
      </div>
    </TemplatePages>
  );
}
