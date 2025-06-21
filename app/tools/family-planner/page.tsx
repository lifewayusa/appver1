import TemplatePages from '../../components/TemplatePages';

export default function FamilyPlannerPage() {
  return (
    <TemplatePages
      title="Family Planner"
      subtitle="Planejamento familiar para imigrantes nos EUA. Organize, simule custos e receba dicas para sua família."
      ctaText="Comece seu planejamento"
      ctaHref="/tools/family-planner/start"
      heroImages={['/images/tools/family-planner.png']}
    >
      <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
        <li>Organize documentos familiares.</li>
        <li>Simule custos de vida para família.</li>
        <li>Receba dicas para adaptação.</li>
      </ul>
    </TemplatePages>
  );
}
