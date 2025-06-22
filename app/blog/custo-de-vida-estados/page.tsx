import TemplatePages from '../../components/TemplatePages'

export default function CustoDeVidaEstados() {
  return (
    <TemplatePages
      title="Custo de Vida por Estado nos EUA"
      subtitle="Compare o custo de vida nos principais estados americanos e encontre o melhor destino para sua família"
      ctaText="Ver Comparativo de Cidades"
      ctaHref="/comparativo-cidades"
    >
      <article className="max-w-4xl mx-auto">
        <div className="prose prose-lg mx-auto">
          <img 
            src="/images/blog/tech-market-usa.jpg" 
            alt="Custo de vida nos EUA" 
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
          
          <p className="lead text-xl text-gray-600 mb-8">
            Entender o custo de vida é fundamental para planejar sua mudança para os EUA. 
            Cada estado tem características econômicas únicas que podem impactar significativamente seu orçamento.
          </p>

          <h2>Estados com Menor Custo de Vida</h2>
          
          <h3>🥇 Texas</h3>
          <ul>
            <li><strong>Moradia:</strong> $1.200-2.500/mês (casa 3 quartos)</li>
            <li><strong>Impostos:</strong> Sem imposto estadual de renda</li>
            <li><strong>Alimentação:</strong> $300-500/mês para família de 4</li>
            <li><strong>Gasolina:</strong> Abaixo da média nacional</li>
          </ul>

          <h3>🥈 Florida</h3>
          <ul>
            <li><strong>Moradia:</strong> $1.500-3.000/mês (varia por região)</li>
            <li><strong>Impostos:</strong> Sem imposto estadual de renda</li>
            <li><strong>Alimentação:</strong> $350-600/mês para família de 4</li>
            <li><strong>Clima:</strong> Economia em aquecimento</li>
          </ul>

          <h3>🥉 Tennessee</h3>
          <ul>
            <li><strong>Moradia:</strong> $1.000-2.200/mês</li>
            <li><strong>Impostos:</strong> Apenas sobre investimentos</li>
            <li><strong>Alimentação:</strong> $280-450/mês para família de 4</li>
          </ul>

          <h2>Estados com Maior Custo de Vida</h2>
          
          <h3>California</h3>
          <ul>
            <li><strong>Moradia:</strong> $3.000-8.000+/mês</li>
            <li><strong>Impostos:</strong> Até 13.3% estadual</li>
            <li><strong>Alimentação:</strong> $500-800/mês para família de 4</li>
            <li><strong>Benefícios:</strong> Salários mais altos, clima, oportunidades</li>
          </ul>

          <h3>New York</h3>
          <ul>
            <li><strong>Moradia:</strong> $2.500-6.000+/mês</li>
            <li><strong>Impostos:</strong> Até 8.82% estadual + municipal</li>
            <li><strong>Transporte:</strong> $121/mês (MetroCard)</li>
            <li><strong>Benefícios:</strong> Oportunidades profissionais, cultura</li>
          </ul>

          <h2>Fatores que Influenciam o Custo</h2>
          
          <h3>🏠 Moradia (30-40% da renda)</h3>
          <p>O maior componente do custo de vida. Varia drasticamente entre cidades metropolitanas e áreas rurais.</p>

          <h3>💰 Impostos</h3>
          <p>
            Alguns estados não cobram imposto de renda (TX, FL, NV, WA, TN, SD, WY, AK, NH). 
            Outros podem chegar a mais de 13%.
          </p>

          <h3>🚗 Transporte</h3>
          <p>Inclui combustível, seguro de carro, manutenção ou transporte público.</p>

          <h3>🏥 Saúde</h3>
          <p>Seguro de saúde varia de $300-1.500+/mês dependendo da cobertura e família.</p>

          <h2>Dicas para Economizar</h2>
          <ul>
            <li>Considere cidades menores dentro de estados favoráveis</li>
            <li>Avalie o custo total: impostos + moradia + transporte</li>
            <li>Pesquise oportunidades de trabalho na área</li>
            <li>Consider o clima para custos de energia</li>
          </ul>

          <div className="bg-green-50 p-6 rounded-lg mt-8">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Planeje sua mudança com inteligência</h3>
            <p className="text-green-700 mb-4">
              Use nossas ferramentas para comparar custos de vida e encontrar o estado ideal para seu perfil e orçamento.
            </p>
            <a href="/comparativo-cidades" className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700">
              Comparar Estados Agora
            </a>
          </div>
        </div>
      </article>
    </TemplatePages>
  )
}
