'use client';

import TemplatePages from '../components/TemplatePages'
import { Check, Star, Crown } from 'lucide-react'

export default function PlanosPage() {
  return (
    <TemplatePages title="Planos" subtitle="Escolha o plano ideal para você e tenha acesso a ferramentas exclusivas para sua jornada nos EUA.">
      <div className="pt-[30px] pb-12 flex flex-col items-center">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-8 border-2 border-azul-petroleo">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-baskerville text-azul-petroleo mb-4">
              Escolha o plano ideal para você
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Acelere sua jornada para os EUA com nossas ferramentas e orientações especializadas
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <div className="text-center">
                <h3 className="text-2xl font-baskerville mb-4 text-azul-petroleo">Free</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-azul-petroleo">R$ 0</span>
                  <span className="text-gray-600">/mês</span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="text-green-500 w-5 h-5 mr-3" />
                    <span className="text-gray-800">4 ferramentas gratuitas com IA</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 w-5 h-5 mr-3" />
                    <span className="text-gray-800">Questionário de qualificação</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 w-5 h-5 mr-3" />
                    <span className="text-gray-800">Acesso ao blog e conteúdos</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 w-5 h-5 mr-3" />
                    <span className="text-gray-800">Informações sobre destinos</span>
                  </li>
                </ul>
                <button className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                  Começar Grátis
                </button>
              </div>
            </div>
            {/* Pro Plan */}
            <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-lilac-400 relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-lilac-400 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Mais Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-baskerville mb-4 text-lilac-400">Pro</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-lilac-400">R$ 47</span>
                  <span className="text-gray-600">/mês</span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="text-green-500 w-5 h-5 mr-3" />
                    <span className="text-gray-800">Tudo do plano Free</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 w-5 h-5 mr-3" />
                    <span className="text-gray-800">ProjectUSA - Planejamento completo</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 w-5 h-5 mr-3" />
                    <span className="text-gray-800">Simulador de Entrevista com IA</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 w-5 h-5 mr-3" />
                    <span className="text-gray-800">Análises avançadas e relatórios</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 w-5 h-5 mr-3" />
                    <span className="text-gray-800">Suporte prioritário</span>
                  </li>
                </ul>
                <button className="w-full bg-lilac-400 text-white py-3 rounded-lg font-medium hover:bg-lilac-500 transition-colors">
                  Assinar Pro
                </button>
              </div>
            </div>
            {/* Premium Plan */}
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <div className="text-center">
                <h3 className="text-2xl font-baskerville mb-4 flex items-center justify-center text-yellow-600">
                  <Crown className="w-6 h-6 mr-2 text-yellow-500" />
                  Premium
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-yellow-600">R$ 97</span>
                  <span className="text-gray-600">/mês</span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="text-green-500 w-5 h-5 mr-3" />
                    <span className="text-gray-800">Tudo do Pro</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 w-5 h-5 mr-3" />
                    <span className="text-gray-800">FamilyPlanner - Roteiro personalizado</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 w-5 h-5 mr-3" />
                    <span className="text-gray-800">Webinars e eventos exclusivos</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="text-green-500 w-5 h-5 mr-3" />
                    <span className="text-gray-800">Consultoria individual</span>
                  </li>
                </ul>
                <button className="w-full bg-yellow-500 text-white py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors">
                  Assinar Premium
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TemplatePages>
  );
}
