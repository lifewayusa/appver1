import TemplatePages from '../../components/TemplatePages';

export default function CalcWayPage() {
  return (
    <TemplatePages
      title="Calc Way"
      subtitle="Calculadora de custos e planejamento financeiro para imigrantes. Simule despesas e planeje investimentos."
      ctaText="Calcule agora"
      ctaHref="/tools/calc-way/start"
      heroImages={['/images/tools/calc-way.png']}
    >
      <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
        <li>Simule custos de mudança.</li>
        <li>Calcule despesas mensais.</li>
        <li>Planeje investimentos.</li>
      </ul>
    </TemplatePages>
  );
}
