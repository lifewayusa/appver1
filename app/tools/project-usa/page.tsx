import TemplatePages from '../../components/TemplatePages';
import ProjectUSAClient from '../../components/tools/ProjectUSAClient';

export default function ProjectUSAPage() {
  return (
    <TemplatePages
      title="Project USA"
      subtitle="Crie um plano detalhado e cronograma personalizado para sua mudança para os Estados Unidos"
      ctaText="Criar Projeto"
      ctaHref="#section2"
    >
      <ProjectUSAClient />
    </TemplatePages>
  );
}
