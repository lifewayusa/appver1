import TemplatePages from '../../components/TemplatePages'

export default function GuiaCompletoEB5() {
  return (
    <TemplatePages
      title="Guia Completo: Investimento EB-5"
      subtitle="Tudo que você precisa saber sobre o programa de investimento EB-5 para obter o Green Card"
      ctaText="Falar com Especialista"
      ctaHref="/contato"
    >
      <article className="max-w-4xl mx-auto">
        <div className="prose prose-lg mx-auto">
          <img 
            src="/images/blog/eb5-investment.jpg" 
            alt="Investimento EB-5" 
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
          
          <p className="lead text-xl text-gray-600 mb-8">
            O programa EB-5 é uma das formas mais diretas de obter o Green Card americano através de investimento. 
            Neste guia completo, você entenderá todos os aspectos deste programa.
          </p>

          <h2>O que é o programa EB-5?</h2>
          <p>
            O programa EB-5 (Employment-Based Fifth Preference) foi criado pelo Congresso americano em 1990 para 
            estimular a economia dos EUA através de investimentos de capital e criação de empregos por investidores 
            estrangeiros.
          </p>

          <h2>Requisitos de Investimento</h2>
          <ul>
            <li><strong>Investimento mínimo:</strong> $800.000 em áreas rurais ou de alto desemprego (TEA)</li>
            <li><strong>Investimento padrão:</strong> $1.050.000 em outras áreas</li>
            <li><strong>Criação de empregos:</strong> Mínimo de 10 empregos diretos ou indiretos para trabalhadores americanos</li>
          </ul>

          <h2>Processo Passo a Passo</h2>
          <ol>
            <li><strong>Escolha do projeto:</strong> Seleção de projeto EB-5 aprovado</li>
            <li><strong>Formulário I-526:</strong> Petição de investidor imigrante</li>
            <li><strong>Green Card condicional:</strong> Válido por 2 anos</li>
            <li><strong>Formulário I-829:</strong> Remoção das condições</li>
            <li><strong>Green Card permanente:</strong> Status de residente permanente</li>
          </ol>

          <h2>Vantagens do EB-5</h2>
          <ul>
            <li>Green Card para toda a família (cônjuge e filhos solteiros menores de 21 anos)</li>
            <li>Não requer experiência empresarial ou conhecimento de inglês</li>
            <li>Liberdade para viver e trabalhar em qualquer lugar dos EUA</li>
            <li>Possibilidade de cidadania americana após 5 anos</li>
          </ul>

          <h2>Considerações Importantes</h2>
          <p>
            O programa EB-5 requer investimento de capital significativo e carrega riscos financeiros. 
            É essencial trabalhar com advogados especializados e fazer due diligence completa dos projetos.
          </p>

          <div className="bg-blue-50 p-6 rounded-lg mt-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Precisa de orientação especializada?</h3>
            <p className="text-blue-700 mb-4">
              Nossa equipe de especialistas está pronta para avaliar seu caso e orientar sobre as melhores opções de investimento EB-5.
            </p>
            <a href="/contato" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">
              Agendar Consultoria Gratuita
            </a>
          </div>
        </div>
      </article>
    </TemplatePages>
  )
}
