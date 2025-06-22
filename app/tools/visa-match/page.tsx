import TemplatePages from '../../components/TemplatePages';
import VisaMatchClient from '../../components/tools/VisaMatchClient';

export default function VisaMatchPage() {
  return (
    <TemplatePages
      title="VisaMatch"
      subtitle="Descubra qual tipo de visto americano é o ideal para seu perfil em minutos"
      ctaText="Fazer Análise"
      ctaHref="#section2"
    >
      <VisaMatchClient />
    </TemplatePages>
  );
}
