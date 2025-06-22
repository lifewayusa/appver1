import TemplatePages from '../../components/TemplatePages';
import GetOpportunityClient from '../../components/tools/GetOpportunityClient';

export default function GetOpportunityPage() {
  return (
    <TemplatePages
      title="Get Opportunity"
      subtitle="Encontre oportunidades de trabalho e negócios nos EUA baseadas no seu perfil profissional"
      ctaText="Buscar Oportunidades"
      ctaHref="#section2"
    >
      <GetOpportunityClient />
    </TemplatePages>
  );
}
