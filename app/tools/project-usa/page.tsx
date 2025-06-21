'use client';

import TemplatePages from '../../components/TemplatePages';
import dynamic from 'next/dynamic';

const ProjectUSAClientWrapper = dynamic(() => import('../../components/tools/ProjectUSAClientWrapper'), { ssr: false });

export default function ProjectUSAPage() {
  return (
    <TemplatePages
      title="Project USA"
      subtitle="Gerenciamento de projetos para imigrantes. Organize tarefas, acompanhe prazos e compartilhe planos."
      ctaText="Começar projeto"
      ctaHref="/tools/project-usa/start"
      heroImages={['/images/tools/project-usa.png']}
    >
      <ProjectUSAClientWrapper />
    </TemplatePages>
  );
}
