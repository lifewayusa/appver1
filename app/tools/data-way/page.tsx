import TemplatePages from '../../components/TemplatePages';

export default function DataWayPage() {
  return (
    <TemplatePages
      title="Data Way"
      subtitle="Ferramenta de análise de dados para imigrantes. Compare cidades, veja estatísticas e analise tendências."
      ctaText="Explorar dados"
      ctaHref="/tools/data-way/start"
      heroImages={['/images/tools/data-way.png']}
    >
      <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
        <li>Compare cidades por custo de vida.</li>
        <li>Veja estatísticas de imigração.</li>
        <li>Analise tendências de mercado.</li>
      </ul>
    </TemplatePages>
  );
}
