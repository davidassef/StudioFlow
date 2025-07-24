'use client';

import { motion } from 'framer-motion';
import { UserPlus, Calendar, CreditCard, BarChart3, ArrowRight } from 'lucide-react';

const steps = [
  {
    id: 1,
    name: 'Cadastre seu Estúdio',
    description:
      'Configure seu perfil, adicione salas, equipamentos e defina seus horários de funcionamento.',
    icon: UserPlus,
    color: 'from-blue-500 to-blue-600',
    details: [
      'Informações básicas do estúdio',
      'Cadastro de salas e equipamentos',
      'Definição de horários e preços',
      'Upload de fotos e descrições',
    ],
  },
  {
    id: 2,
    name: 'Receba Agendamentos',
    description:
      'Clientes agendam online através do seu link personalizado ou você agenda manualmente.',
    icon: Calendar,
    color: 'from-green-500 to-green-600',
    details: [
      'Link de agendamento personalizado',
      'Calendário em tempo real',
      'Confirmação automática por WhatsApp',
      'Lembretes automáticos',
    ],
  },
  {
    id: 3,
    name: 'Processe Pagamentos',
    description:
      'Receba pagamentos antecipados online e reduza drasticamente os no-shows.',
    icon: CreditCard,
    color: 'from-purple-500 to-purple-600',
    details: [
      'Pagamento via PIX, cartão ou boleto',
      'Cobrança automática de taxas',
      'Política de cancelamento flexível',
      'Relatórios financeiros detalhados',
    ],
  },
  {
    id: 4,
    name: 'Analise Resultados',
    description:
      'Acompanhe métricas importantes e tome decisões baseadas em dados reais.',
    icon: BarChart3,
    color: 'from-orange-500 to-orange-600',
    details: [
      'Dashboard com métricas em tempo real',
      'Relatórios de ocupação e receita',
      'Análise de clientes frequentes',
      'Insights para otimização',
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export function HowItWorks() {
  return (
    <div id="how-it-works" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">
            Como Funciona
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            4 passos simples para automatizar seu estúdio
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Configure uma vez e deixe o sistema trabalhar para você. 
            Em poucos minutos você terá um estúdio completamente automatizado.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <div className="space-y-8">
            {steps.map((step, stepIdx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  variants={stepVariants}
                  className="relative"
                >
                  {/* Connector line */}
                  {stepIdx !== steps.length - 1 && (
                    <div className="absolute left-8 top-16 h-16 w-0.5 bg-gray-200 dark:bg-gray-700 lg:left-12" />
                  )}
                  
                  <div className="group relative flex items-start space-x-6 lg:space-x-8">
                    {/* Step number and icon */}
                    <div className="flex flex-col items-center">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r ${step.color} shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="mt-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                        Passo {step.id}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 group-hover:shadow-md transition-shadow duration-200">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {step.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {step.description}
                        </p>
                        
                        {/* Details list */}
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {step.details.map((detail, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {/* Arrow for larger screens */}
                    {stepIdx !== steps.length - 1 && (
                      <div className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors duration-200">
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-xl">
            <div className="text-left">
              <h3 className="text-xl font-bold mb-2">
                Pronto para começar?
              </h3>
              <p className="text-blue-100">
                Configure seu estúdio em menos de 10 minutos
              </p>
            </div>
            <button className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-sm hover:bg-gray-50 transition-colors whitespace-nowrap">
              Começar Agora
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}