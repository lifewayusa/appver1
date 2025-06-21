import TemplatePages from '../../components/TemplatePages';

export default function InterviewSimPage() {
  return (
    <TemplatePages
      title="Interview Sim"
      subtitle="Simulador de entrevistas para imigrantes. Pratique, receba feedback e simule entrevistas em inglês."
      ctaText="Simular entrevista"
      ctaHref="/tools/interview-sim/start"
      heroImages={['/images/tools/interview-sim.png']}
    >
      <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
        <li>Pratique entrevistas de emprego.</li>
        <li>Receba feedback automático.</li>
        <li>Simule entrevistas em inglês.</li>
      </ul>
    </TemplatePages>
  );
}
