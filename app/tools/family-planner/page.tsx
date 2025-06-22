import TemplatePages from '../../components/TemplatePages';
import FamilyPlannerClient from '../../components/tools/FamilyPlannerClient';

export default function FamilyPlannerPage() {
  return (
    <TemplatePages
      title="Family Planner"
      subtitle="Planeje os próximos passos da sua família rumo aos EUA com análise personalizada"
      ctaText="Começar Planejamento"
      ctaHref="#section2"
    >
      <FamilyPlannerClient />
    </TemplatePages>
  );
}
