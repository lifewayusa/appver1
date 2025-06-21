import TemplatePages from '../components/TemplatePages';

export default function RecursosUteisPage() {
  return (
    <TemplatePages title="Recursos Úteis" subtitle="Infográficos e materiais para download sobre imigração, cidades e planejamento nos EUA.">
      <div className="space-y-8">
        {/* Exemplo de infográfico */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center gap-6">
          <img src="/images/infografico-exemplo.png" alt="Infográfico Exemplo" className="w-40 h-40 object-contain" />
          <div>
            <h2 className="text-xl font-bold mb-2">Guia de Vistos Americanos</h2>
            <p className="mb-2">Baixe o infográfico completo com os principais tipos de visto, requisitos e dicas para brasileiros.</p>
            <a href="/pdfs/guia-vistos.pdf" download className="inline-block bg-azul-petroleo text-white px-4 py-2 rounded font-bold hover:bg-azul-petroleo/90 transition">Baixar PDF</a>
          </div>
        </div>
        {/* Adicione mais infográficos e PDFs conforme necessário */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center gap-6">
          <img src="/images/infografico-cidades.png" alt="Infográfico Cidades" className="w-40 h-40 object-contain" />
          <div>
            <h2 className="text-xl font-bold mb-2">Comparativo de Cidades</h2>
            <p className="mb-2">Veja dados comparativos de custo de vida, clima, oportunidades e mais.</p>
            <a href="/pdfs/comparativo-cidades.pdf" download className="inline-block bg-azul-petroleo text-white px-4 py-2 rounded font-bold hover:bg-azul-petroleo/90 transition">Baixar PDF</a>
          </div>
        </div>
      </div>
    </TemplatePages>
  );
}
