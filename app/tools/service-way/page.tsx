import TemplatePages from '../../components/TemplatePages';

export default function ServiceWayPage() {
  return (
    <TemplatePages
      title="Service Way"
      subtitle="Central de serviços para imigrantes. Encontre prestadores, solicite orçamentos e avalie profissionais."
      ctaText="Buscar serviços"
      ctaHref="/tools/service-way/start"
      heroImages={['/images/tools/service-way.png']}
    >
      <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
        <li>Encontre prestadores de serviços.</li>
        <li>Solicite orçamentos.</li>
        <li>Avalie profissionais.</li>
      </ul>
    </TemplatePages>
  );
}
