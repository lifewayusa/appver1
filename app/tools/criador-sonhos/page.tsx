import TemplatePages from '../../components/TemplatePages';
import CriadorSonhosClient from '../../components/tools/CriadorSonhosClient';

export default function CriadorSonhosPage() {
  return (
    <TemplatePages
      title="Criador de Sonhos"
      subtitle="Descubra como seria viver nos EUA e planeje toda sua jornada de imigração personalizada para sua família"
      ctaText="Simular Experiência"
      ctaHref="#section2"
    >
      <CriadorSonhosClient />
    </TemplatePages>
  );
}
