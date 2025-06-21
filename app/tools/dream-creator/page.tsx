import TemplatePages from '../../components/TemplatePages';

export default function DreamCreatorPage() {
  return (
    <TemplatePages
      title="Criador de Sonhos"
      subtitle="Planeje e realize seus sonhos nos EUA com inteligência."
      ctaText="Comece seu sonho"
      ctaHref="/formulario"
    >
      <div className="flex flex-col items-center">
        <img src="/images/tools/dream-creator.png" alt="Criador de Sonhos" className="mb-6 rounded-xl shadow-lg w-40 h-40 object-cover" />
        <p className="text-lg text-gray-700 text-center mb-6">Ferramenta para criar e planejar sonhos nos EUA.</p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="font-semibold text-xl text-azul-petroleo mb-3">Exemplos de Aplicação</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Exemplo: Planeje sua mudança para os EUA.</li>
            <li>Exemplo: Simule diferentes cenários de vida.</li>
            <li>Exemplo: Receba dicas personalizadas.</li>
          </ul>
        </div>
      </div>
    </TemplatePages>
  );
}
