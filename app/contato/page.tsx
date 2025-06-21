'use client';

import Navbar from '../components/Navbar';
import { getRandomImage } from '../lib/utils';
import { siteConfig } from '../lib/config';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ContatoPage() {
  const [heroImage, setHeroImage] = useState('/images/hero/home-hero-mobile.webp'); // Default SSR image
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHeroImage(getRandomImage('hero', 'contato-hero'));
  }, []);

  return (
    <main className="bg-cinza-claro min-h-screen font-figtree">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="relative h-[300px] flex flex-col justify-center items-center text-white mt-10"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-azul-petroleo opacity-95"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="font-baskerville text-3xl md:text-5xl mb-6 leading-tight">
            Entre em Contato
          </h1>
          <p className="text-lg md:text-xl font-figtree">
            Estamos aqui para ajudar você a realizar seu sonho americano
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="bg-gray-50 rounded-xl p-8">
              <h2 className="text-2xl font-baskerville mb-6 text-gray-900">
                Envie sua Mensagem
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg font-figtree focus:ring-2 focus:ring-azul-petroleo focus:border-transparent"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Sobrenome *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg font-figtree focus:ring-2 focus:ring-azul-petroleo focus:border-transparent"
                      placeholder="Seu sobrenome"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg font-figtree focus:ring-2 focus:ring-azul-petroleo focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone/WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full p-3 border border-gray-300 rounded-lg font-figtree focus:ring-2 focus:ring-azul-petroleo focus:border-transparent"
                    placeholder="+55 (11) 99999-9999"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    Assunto *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg font-figtree focus:ring-2 focus:ring-azul-petroleo focus:border-transparent"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="informacoes-gerais">Informações Gerais</option>
                    <option value="planos-assinatura">Planos e Assinatura</option>
                    <option value="suporte-tecnico">Suporte Técnico</option>
                    <option value="consultoria">Consultoria Personalizada</option>
                    <option value="parcerias">Parcerias</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg font-figtree focus:ring-2 focus:ring-azul-petroleo focus:border-transparent resize-none"
                    placeholder="Descreva como podemos ajudá-lo..."
                  ></textarea>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                    required
                    className="mt-1 mr-3"
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-600">
                    Eu concordo com a <a href="/privacidade" className="text-azul-petroleo hover:underline">Política de Privacidade</a> e 
                    autorizo o uso dos meus dados para responder a esta solicitação. *
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-azul-petroleo text-white py-3 rounded-lg font-figtree font-semibold hover:bg-opacity-90 transition-colors flex items-center justify-center"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Enviar Mensagem
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-baskerville mb-6 text-gray-900">
                  Informações de Contato
                </h2>
                <p className="text-gray-600 font-figtree mb-8">
                  Nossa equipe está pronta para ajudá-lo em sua jornada para os Estados Unidos. 
                  Entre em contato conosco através dos canais abaixo ou envie uma mensagem.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-6">
                {/* Email */}
                <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-azul-petroleo">
                  <div className="flex items-start">
                    <div className="bg-azul-petroleo rounded-full p-3 mr-4">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-baskerville text-lg text-gray-900 mb-2">Email</h3>
                      <p className="text-gray-600 font-figtree mb-1">{siteConfig.contact.email}</p>
                      <p className="text-sm text-gray-500">Resposta em até 24 horas</p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
                  <div className="flex items-start">
                    <div className="bg-green-500 rounded-full p-3 mr-4">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-baskerville text-lg text-gray-900 mb-2">Telefone</h3>
                      <p className="text-gray-600 font-figtree mb-1">{siteConfig.contact.phone}</p>
                      <p className="text-sm text-gray-500">Segunda a Sexta, 9h às 18h (EST)</p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-600">
                  <div className="flex items-start">
                    <div className="bg-green-600 rounded-full p-3 mr-4">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-baskerville text-lg text-gray-900 mb-2">WhatsApp</h3>
                      <p className="text-gray-600 font-figtree mb-1">{siteConfig.contact.whatsapp}</p>
                      <p className="text-sm text-gray-500">Disponível 24/7 para clientes Premium</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-500">
                  <div className="flex items-start">
                    <div className="bg-purple-500 rounded-full p-3 mr-4">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-baskerville text-lg text-gray-900 mb-2">Endereço</h3>
                      <p className="text-gray-600 font-figtree">
                        {siteConfig.contact.address}<br/>
                        {siteConfig.contact.city}, {siteConfig.contact.state} {siteConfig.contact.zipcode}<br/>
                        {siteConfig.contact.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-azul-petroleo rounded-lg p-6 text-white">
                <div className="flex items-start">
                  <Clock className="w-6 h-6 mr-4 mt-1" />
                  <div>
                    <h3 className="font-baskerville text-lg mb-4">Horário de Atendimento</h3>
                    <div className="space-y-2 font-figtree text-sm">
                      <div className="flex justify-between">
                        <span>Segunda a Sexta:</span>
                        <span>9:00 - 18:00 (EST)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sábado:</span>
                        <span>10:00 - 14:00 (EST)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Domingo:</span>
                        <span>Fechado</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-blue-400">
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          <span className="text-xs">Suporte 24/7 para emergências (Premium)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-baskerville text-center mb-12 text-gray-900">
            Perguntas Frequentes
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-baskerville text-lg mb-3 text-gray-900">
                Quanto tempo leva para receber uma resposta?
              </h3>
              <p className="text-gray-600 font-figtree">
                Respondemos todos os emails em até 24 horas durante dias úteis. Para urgências, 
                clientes Premium podem usar o WhatsApp 24/7.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-baskerville text-lg mb-3 text-gray-900">
                Vocês oferecem consultoria gratuita?
              </h3>
              <p className="text-gray-600 font-figtree">
                Oferecemos uma consulta inicial gratuita de 15 minutos para conhecer suas necessidades. 
                Consultorias completas estão disponíveis nos planos Pro e Premium.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-baskerville text-lg mb-3 text-gray-900">
                Posso agendar uma reunião presencial?
              </h3>
              <p className="text-gray-600 font-figtree">
                Sim! Temos escritório em Miami e oferecemos reuniões presenciais para clientes Premium. 
                Entre em contato para agendar.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
