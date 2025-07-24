'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Check, Zap, Shield, Headphones } from 'lucide-react';

const benefits = [
  'Teste gratuito por 14 dias',
  'Configuração em menos de 10 minutos',
  'Suporte especializado incluído',
  'Sem taxa de setup ou cancelamento',
  'Integração com WhatsApp Business',
  'Relatórios avançados incluídos',
];

const features = [
  {
    icon: Zap,
    title: 'Setup Rápido',
    description: 'Configure seu estúdio em minutos, não em dias',
  },
  {
    icon: Shield,
    title: 'Dados Seguros',
    description: 'Criptografia de ponta e backup automático',
  },
  {
    icon: Headphones,
    title: 'Suporte 24/7',
    description: 'Equipe especializada sempre disponível',
  },
];

export function CTA() {
  return (
    <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
      {/* Background pattern */}
      <div className="absolute -top-80 left-[max(6rem,33%)] -z-10 transform-gpu blur-3xl sm:left-1/2 sm:top-[-30rem] sm:-ml-80 lg:left-[max(14rem,33%)] lg:ml-0 lg:top-[-32rem] xl:left-[max(23rem,33%)] xl:top-[-60rem]">
        <div
          className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-blue-600 to-purple-600 opacity-30"
          style={{
            clipPath:
              'polygon(63.1% 29.6%, 100% 17.2%, 76.7% 3.1%, 48.4% 0.1%, 44.6% 4.8%, 54.5% 25.4%, 59.8% 49.1%, 55.3% 57.9%, 44.5% 57.3%, 27.8% 48%, 35.1% 81.6%, 0% 97.8%, 39.3% 100%, 35.3% 81.5%, 97.2% 52.8%, 63.1% 29.6%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Pronto para revolucionar seu estúdio?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Junte-se a centenas de estúdios que já automatizaram sua gestão e 
            aumentaram sua receita com o StudioFlow.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-16">
          {/* Left side - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white mb-8">
              O que você ganha:
            </h3>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-300">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            {/* Features grid */}
            <div className="mt-12 grid grid-cols-1 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{feature.title}</h4>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right side - CTA Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-white p-8 shadow-2xl"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Comece seu teste gratuito
              </h3>
              <p className="text-gray-600">
                14 dias grátis • Sem cartão de crédito • Cancelamento a qualquer momento
              </p>
            </div>

            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email profissional
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="studio" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do estúdio
                </label>
                <input
                  type="text"
                  id="studio"
                  name="studio"
                  className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Nome do seu estúdio"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <Link
                href="/register"
                className="group flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all transform hover:scale-105"
              >
                Começar Teste Gratuito
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Ao se cadastrar, você concorda com nossos{' '}
                <a href="/terms" className="text-blue-600 hover:text-blue-500">
                  Termos de Uso
                </a>{' '}
                e{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-500">
                  Política de Privacidade
                </a>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-2xl text-center"
        >
          <blockquote className="text-xl font-medium text-white">
            "O StudioFlow pagou por si mesmo no primeiro mês. 
            A redução de no-shows e o aumento na eficiência foram impressionantes."
          </blockquote>
          <figcaption className="mt-4 text-gray-400">
            <strong>Carlos Silva</strong> - Proprietário do Studio Beat, São Paulo
          </figcaption>
        </motion.div>
      </div>
    </div>
  );
}