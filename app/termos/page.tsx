import Navbar from '../components/Navbar';
import { FileText, AlertTriangle, Shield, Scale, Users, Gavel } from 'lucide-react';

export default function TermosPage() {
  return (
    <main className="bg-cinza-claro min-h-screen font-figtree">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-azul-petroleo text-white py-16 mt-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FileText className="w-16 h-16 mx-auto mb-6" />
          <h1 className="font-baskerville text-3xl md:text-5xl mb-6 leading-tight">
            Termos de Uso
          </h1>
          <p className="text-lg md:text-xl font-figtree">
            Condições gerais para uso da plataforma LifeWayUSA
          </p>
          <p className="text-sm text-blue-200 mt-4">
            Última atualização: 15 de dezembro de 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Acceptance */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Scale className="w-8 h-8 text-azul-petroleo mr-3" />
              <h2 className="text-2xl font-baskerville text-gray-900">Aceitação dos Termos</h2>
            </div>
            <div className="bg-blue-50 border-l-4 border-azul-petroleo p-6 rounded-r-lg">
              <p className="text-gray-700 font-figtree leading-relaxed mb-4">
                Ao acessar e usar a plataforma LifeWayUSA, você aceita e concorda em ficar vinculado 
                a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, 
                não deve usar nossos serviços.
              </p>
              <p className="text-gray-700 font-figtree leading-relaxed">
                Estes termos se aplicam a todos os visitantes, usuários e outras pessoas que 
                acessam ou usam nossos serviços.
              </p>
            </div>
          </div>

          {/* Services Description */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Users className="w-8 h-8 text-azul-petroleo mr-3" />
              <h2 className="text-2xl font-baskerville text-gray-900">Descrição dos Serviços</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-baskerville text-lg mb-3 text-gray-900">Serviços Gratuitos</h3>
                <ul className="text-gray-700 font-figtree text-sm space-y-2">
                  <li>• Acesso a informações sobre destinos nos EUA</li>
                  <li>• Ferramentas básicas de qualificação</li>
                  <li>• Conteúdo educacional no blog</li>
                  <li>• 4 ferramentas de IA básicas</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-baskerville text-lg mb-3 text-gray-900">Serviços Premium</h3>
                <ul className="text-gray-700 font-figtree text-sm space-y-2">
                  <li>• Ferramentas avançadas de IA</li>
                  <li>• Análises personalizadas</li>
                  <li>• Suporte prioritário</li>
                  <li>• Consultoria especializada</li>
                </ul>
              </div>
            </div>
          </div>

          {/* User Responsibilities */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-azul-petroleo mr-3" />
              <h2 className="text-2xl font-baskerville text-gray-900">Responsabilidades do Usuário</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-baskerville text-lg mb-3 text-green-800">Você DEVE:</h3>
                <ul className="text-green-700 font-figtree space-y-2">
                  <li>• Fornecer informações verdadeiras e precisas</li>
                  <li>• Manter a confidencialidade da sua conta</li>
                  <li>• Usar os serviços apenas para fins legais</li>
                  <li>• Respeitar os direitos de propriedade intelectual</li>
                  <li>• Notificar sobre uso não autorizado da sua conta</li>
                  <li>• Cumprir todas as leis aplicáveis</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="font-baskerville text-lg mb-3 text-red-800">Você NÃO DEVE:</h3>
                <ul className="text-red-700 font-figtree space-y-2">
                  <li>• Usar os serviços para atividades ilegais</li>
                  <li>• Tentar acessar contas de outros usuários</li>
                  <li>• Interferir no funcionamento da plataforma</li>
                  <li>• Copiar ou distribuir nosso conteúdo sem autorização</li>
                  <li>• Usar bots ou sistemas automatizados não autorizados</li>
                  <li>• Enviar spam ou conteúdo malicioso</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="mb-12">
            <h2 className="text-2xl font-baskerville text-gray-900 mb-6">Propriedade Intelectual</h2>
            <div className="bg-azul-petroleo text-white rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-baskerville text-lg mb-3">Nossos Direitos</h3>
                  <ul className="text-blue-100 font-figtree text-sm space-y-2">
                    <li>• Marca LifeWayUSA</li>
                    <li>• Algoritmos de IA proprietários</li>
                    <li>• Design e interface do site</li>
                    <li>• Conteúdo original e dados</li>
                    <li>• Ferramentas e funcionalidades</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-baskerville text-lg mb-3">Seus Direitos</h3>
                  <ul className="text-blue-100 font-figtree text-sm space-y-2">
                    <li>• Uso pessoal dos serviços</li>
                    <li>• Propriedade dos seus dados</li>
                    <li>• Licença limitada de uso</li>
                    <li>• Acesso ao conteúdo contratado</li>
                    <li>• Exportação dos seus dados</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="mb-12">
            <h2 className="text-2xl font-baskerville text-gray-900 mb-6">Termos de Pagamento</h2>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-baskerville text-lg mb-4 text-gray-900">Assinaturas</h3>
                  <ul className="text-gray-700 font-figtree text-sm space-y-2">
                    <li>• Cobrança mensal ou anual</li>
                    <li>• Renovação automática</li>
                    <li>• Cancelamento a qualquer momento</li>
                    <li>• Sem reembolso proporcional</li>
                    <li>• Preços sujeitos a alteração</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-baskerville text-lg mb-4 text-gray-900">Política de Cancelamento</h3>
                  <ul className="text-gray-700 font-figtree text-sm space-y-2">
                    <li>• Acesso até o fim do período pago</li>
                    <li>• Dados mantidos por 90 dias</li>
                    <li>• Reativação dentro de 90 dias</li>
                    <li>• Exclusão após 90 dias</li>
                    <li>• Suporte limitado pós-cancelamento</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimers */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-8 h-8 text-azul-petroleo mr-3" />
              <h2 className="text-2xl font-baskerville text-gray-900">Limitações e Isenções</h2>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="font-baskerville text-lg mb-3 text-yellow-800">Importante - Leia Atentamente</h3>
              <div className="text-yellow-700 font-figtree space-y-3 text-sm">
                <p>
                  <strong>Não somos uma empresa de imigração:</strong> LifeWayUSA é uma plataforma de informação 
                  e ferramentas. Não oferecemos serviços legais de imigração nem garantimos aprovação de vistos.
                </p>
                <p>
                  <strong>Informações educacionais:</strong> Todo conteúdo é apenas para fins informativos e 
                  educacionais. Sempre consulte profissionais qualificados para decisões legais.
                </p>
                <p>
                  <strong>Resultados não garantidos:</strong> As ferramentas de IA fornecem estimativas baseadas 
                  em dados disponíveis, mas não garantem resultados reais em processos de imigração.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-baskerville text-lg mb-3 text-gray-900">Limitação de Responsabilidade</h3>
                <p className="text-gray-700 font-figtree text-sm">
                  Em nenhuma circunstância seremos responsáveis por danos indiretos, incidentais, 
                  especiais ou consequenciais resultantes do uso ou incapacidade de usar nossos serviços.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-baskerville text-lg mb-3 text-gray-900">Disponibilidade</h3>
                <p className="text-gray-700 font-figtree text-sm">
                  Nos esforçamos para manter os serviços disponíveis 24/7, mas podem ocorrer 
                  interrupções para manutenção ou por problemas técnicos.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy and Data */}
          <div className="mb-12">
            <h2 className="text-2xl font-baskerville text-gray-900 mb-6">Privacidade e Dados</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-gray-700 font-figtree mb-4">
                O uso dos nossos serviços também está sujeito à nossa 
                <a href="/privacidade" className="text-azul-petroleo font-semibold hover:underline ml-1">
                  Política de Privacidade
                </a>, que descreve como coletamos, usamos e protegemos suas informações pessoais.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded p-4 text-center">
                  <Shield className="w-8 h-8 text-azul-petroleo mx-auto mb-2" />
                  <p className="text-sm font-semibold">Dados Seguros</p>
                </div>
                <div className="bg-white rounded p-4 text-center">
                  <Users className="w-8 h-8 text-azul-petroleo mx-auto mb-2" />
                  <p className="text-sm font-semibold">Conformidade LGPD</p>
                </div>
                <div className="bg-white rounded p-4 text-center">
                  <FileText className="w-8 h-8 text-azul-petroleo mx-auto mb-2" />
                  <p className="text-sm font-semibold">Transparência Total</p>
                </div>
              </div>
            </div>
          </div>

          {/* Modifications */}
          <div className="mb-12">
            <h2 className="text-2xl font-baskerville text-gray-900 mb-6">Modificações dos Termos</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 font-figtree mb-4">
                Reservamos o direito de modificar estes termos a qualquer momento. Quando fizermos 
                alterações, notificaremos você:
              </p>
              <ul className="text-gray-700 font-figtree space-y-2">
                <li>• Atualizando a data no topo desta página</li>
                <li>• Enviando um email para usuários registrados</li>
                <li>• Exibindo um aviso proeminente no site</li>
                <li>• Para mudanças importantes, solicitando nova aceitação</li>
              </ul>
            </div>
          </div>

          {/* Governing Law */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Gavel className="w-8 h-8 text-azul-petroleo mr-3" />
              <h2 className="text-2xl font-baskerville text-gray-900">Lei Aplicável e Jurisdição</h2>
            </div>
            <div className="bg-azul-petroleo text-white rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-baskerville text-lg mb-3">Brasil</h3>
                  <p className="text-blue-100 font-figtree text-sm">
                    Para usuários brasileiros, estes termos são regidos pelas leis do Brasil, 
                    incluindo o Código de Defesa do Consumidor e LGPD.
                  </p>
                </div>
                <div>
                  <h3 className="font-baskerville text-lg mb-3">Estados Unidos</h3>
                  <p className="text-blue-100 font-figtree text-sm">
                    Para outros usuários, estes termos são regidos pelas leis do Estado da Flórida, 
                    Estados Unidos, onde nossa empresa está registrada.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-baskerville text-gray-900 mb-6">Entre em Contato</h2>
            <p className="text-gray-700 font-figtree mb-4">
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded p-4">
                <p><strong>Email:</strong></p>
                <p className="text-gray-600">legal@lifewayusa.com</p>
              </div>
              <div className="bg-white rounded p-4">
                <p><strong>Telefone:</strong></p>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
              <div className="bg-white rounded p-4">
                <p><strong>Endereço:</strong></p>
                <p className="text-gray-600">123 Main Street<br/>Miami, FL 33101</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
