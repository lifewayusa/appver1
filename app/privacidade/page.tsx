import Navbar from '../components/Navbar';
import { Shield, Eye, Lock, Database, UserCheck, AlertCircle } from 'lucide-react';

export default function PrivacidadePage() {
  return (
    <main className="bg-cinza-claro min-h-screen font-figtree">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-azul-petroleo text-white py-16 mt-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6" />
          <h1 className="font-baskerville text-3xl md:text-5xl mb-6 leading-tight">
            Política de Privacidade
          </h1>
          <p className="text-lg md:text-xl font-figtree">
            Sua privacidade e segurança são nossas prioridades
          </p>
          <p className="text-sm text-blue-200 mt-4">
            Última atualização: 15 de dezembro de 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Introduction */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Eye className="w-8 h-8 text-azul-petroleo mr-3" />
              <h2 className="text-2xl font-baskerville text-gray-900">Introdução</h2>
            </div>
            <div className="bg-blue-50 border-l-4 border-azul-petroleo p-6 rounded-r-lg">
              <p className="text-gray-700 font-figtree leading-relaxed">
                A LifeWayUSA ("nós", "nosso" ou "empresa") está comprometida em proteger sua privacidade. 
                Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas 
                informações quando você usa nosso website e serviços.
              </p>
            </div>
          </div>

          {/* Information We Collect */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Database className="w-8 h-8 text-azul-petroleo mr-3" />
              <h2 className="text-2xl font-baskerville text-gray-900">Informações que Coletamos</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-baskerville text-lg mb-3 text-gray-900">1. Informações Pessoais</h3>
                <ul className="text-gray-700 font-figtree space-y-2">
                  <li>• Nome completo e informações de contato (email, telefone)</li>
                  <li>• Dados demográficos (idade, localização, estado civil)</li>
                  <li>• Informações educacionais e profissionais</li>
                  <li>• Objetivos de imigração e preferências de destino</li>
                  <li>• Informações financeiras (apenas para qualificação)</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-baskerville text-lg mb-3 text-gray-900">2. Informações Técnicas</h3>
                <ul className="text-gray-700 font-figtree space-y-2">
                  <li>• Endereço IP e localização geográfica</li>
                  <li>• Tipo de navegador e sistema operacional</li>
                  <li>• Páginas visitadas e tempo de permanência</li>
                  <li>• Cookies e tecnologias similares</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-baskerville text-lg mb-3 text-gray-900">3. Informações de Uso</h3>
                <ul className="text-gray-700 font-figtree space-y-2">
                  <li>• Interações com nossas ferramentas de IA</li>
                  <li>• Resultados de questionários e avaliações</li>
                  <li>• Preferências e configurações da conta</li>
                  <li>• Histórico de assinatura e pagamentos</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <UserCheck className="w-8 h-8 text-azul-petroleo mr-3" />
              <h2 className="text-2xl font-baskerville text-gray-900">Como Usamos suas Informações</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-baskerville text-lg mb-3 text-azul-petroleo">Serviços Principais</h3>
                <ul className="text-gray-700 font-figtree text-sm space-y-2">
                  <li>• Fornecer acesso às ferramentas de IA</li>
                  <li>• Calcular sua qualificação para imigração</li>
                  <li>• Personalizar recomendações de destinos</li>
                  <li>• Gerar relatórios e análises personalizadas</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-baskerville text-lg mb-3 text-green-700">Comunicação</h3>
                <ul className="text-gray-700 font-figtree text-sm space-y-2">
                  <li>• Responder suas dúvidas e solicitações</li>
                  <li>• Enviar atualizações sobre novos recursos</li>
                  <li>• Notificar sobre mudanças nos serviços</li>
                  <li>• Oferecer suporte técnico</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="font-baskerville text-lg mb-3 text-purple-700">Melhoria dos Serviços</h3>
                <ul className="text-gray-700 font-figtree text-sm space-y-2">
                  <li>• Analisar padrões de uso da plataforma</li>
                  <li>• Desenvolver novos recursos e ferramentas</li>
                  <li>• Melhorar a precisão da IA</li>
                  <li>• Otimizar a experiência do usuário</li>
                </ul>
              </div>

              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="font-baskerville text-lg mb-3 text-yellow-700">Conformidade Legal</h3>
                <ul className="text-gray-700 font-figtree text-sm space-y-2">
                  <li>• Cumprir obrigações legais</li>
                  <li>• Proteger direitos e propriedades</li>
                  <li>• Prevenir fraudes e atividades ilegais</li>
                  <li>• Cooperar com autoridades quando necessário</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Lock className="w-8 h-8 text-azul-petroleo mr-3" />
              <h2 className="text-2xl font-baskerville text-gray-900">Proteção dos Dados</h2>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-baskerville text-lg mb-3 text-gray-900">Medidas Técnicas</h3>
                  <ul className="text-gray-700 font-figtree text-sm space-y-2">
                    <li>• Criptografia SSL/TLS para transmissão</li>
                    <li>• Criptografia AES-256 para armazenamento</li>
                    <li>• Autenticação de dois fatores</li>
                    <li>• Monitoramento contínuo de segurança</li>
                    <li>• Backups seguros e regulares</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-baskerville text-lg mb-3 text-gray-900">Medidas Organizacionais</h3>
                  <ul className="text-gray-700 font-figtree text-sm space-y-2">
                    <li>• Acesso restrito aos dados pessoais</li>
                    <li>• Treinamento regular da equipe</li>
                    <li>• Políticas internas de segurança</li>
                    <li>• Auditoria de segurança periódica</li>
                    <li>• Plano de resposta a incidentes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-azul-petroleo mr-3" />
              <h2 className="text-2xl font-baskerville text-gray-900">Seus Direitos</h2>
            </div>
            
            <div className="bg-azul-petroleo text-white rounded-lg p-8">
              <p className="font-figtree mb-6">
                De acordo com a LGPD e outras leis de proteção de dados, você tem os seguintes direitos:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-white bg-opacity-20 rounded-full p-1 mr-3 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <strong>Acesso:</strong> Solicitar cópia dos seus dados
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-white bg-opacity-20 rounded-full p-1 mr-3 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <strong>Correção:</strong> Atualizar dados incorretos
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-white bg-opacity-20 rounded-full p-1 mr-3 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <strong>Exclusão:</strong> Solicitar remoção dos dados
                    </div>
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-white bg-opacity-20 rounded-full p-1 mr-3 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <strong>Portabilidade:</strong> Transferir dados para outro serviço
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-white bg-opacity-20 rounded-full p-1 mr-3 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <strong>Oposição:</strong> Recusar processamento de dados
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-white bg-opacity-20 rounded-full p-1 mr-3 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <strong>Limitação:</strong> Restringir uso dos dados
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cookies */}
          <div className="mb-12">
            <h2 className="text-2xl font-baskerville text-gray-900 mb-6">Cookies e Tecnologias Similares</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 font-figtree mb-4">
                Utilizamos cookies e tecnologias similares para melhorar sua experiência em nosso site:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded p-4">
                  <h4 className="font-semibold mb-2">Cookies Essenciais</h4>
                  <p className="text-gray-600">Necessários para o funcionamento básico do site</p>
                </div>
                <div className="bg-white rounded p-4">
                  <h4 className="font-semibold mb-2">Cookies de Performance</h4>
                  <p className="text-gray-600">Ajudam a melhorar a performance e funcionalidade</p>
                </div>
                <div className="bg-white rounded p-4">
                  <h4 className="font-semibold mb-2">Cookies de Marketing</h4>
                  <p className="text-gray-600">Personalizam anúncios e conteúdo relevante</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact and Updates */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <AlertCircle className="w-8 h-8 text-azul-petroleo mr-3" />
              <h2 className="text-2xl font-baskerville text-gray-900">Contato e Atualizações</h2>
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-baskerville text-lg mb-4 text-gray-900">Entre em Contato</h3>
                  <p className="text-gray-700 font-figtree mb-4">
                    Para exercer seus direitos ou esclarecer dúvidas sobre esta política:
                  </p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Email:</strong> privacidade@lifewayusa.com</p>
                    <p><strong>Telefone:</strong> +1 (555) 123-4567</p>
                    <p><strong>Endereço:</strong> 123 Main Street, Miami, FL 33101</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-baskerville text-lg mb-4 text-gray-900">Atualizações</h3>
                  <p className="text-gray-700 font-figtree mb-4">
                    Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Por email (para mudanças importantes)</li>
                    <li>• Através de aviso no site</li>
                    <li>• Atualização da data no topo desta página</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Basis */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-baskerville text-lg mb-3 text-yellow-800">Base Legal para Processamento</h3>
            <p className="text-yellow-700 font-figtree text-sm">
              Processamos seus dados pessoais com base no seu consentimento, execução de contrato, 
              cumprimento de obrigações legais, e/ou nossos interesses legítimos em fornecer e 
              melhorar nossos serviços, sempre respeitando seus direitos e liberdades fundamentais.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
