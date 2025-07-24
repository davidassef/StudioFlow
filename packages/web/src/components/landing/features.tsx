'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  CreditCard,
  BarChart3,
  MessageSquare,
  Shield,
  Clock,
  Smartphone,
  Zap,
  HeadphonesIcon,
  Settings,
  Globe,
} from 'lucide-react';

const features = [
  {
    name: 'Agendamento Inteligente',
    description:
      'Sistema automatizado de agendamentos com confirmação por WhatsApp e lembretes automáticos.',
    icon: Calendar,
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'Gestão de Clientes',
    description:
      'Cadastro completo de clientes com histórico de sessões, preferências e dados de contato.',
    icon: Users,
    color: 'from-green-500 to-green-600',
  },
  {
    name: 'Pagamentos Online',
    description:
      'Integração com gateways de pagamento para receber antecipadamente e reduzir no-shows.',
    icon: CreditCard,
    color: 'from-purple-500 to-purple-600',
  },
  {
    name: 'Relatórios e Analytics',
    description:
      'Dashboards completos com métricas de ocupação, receita e performance do estúdio.',
    icon: BarChart3,
    color: 'from-orange-500 to-orange-600',
  },
  {
    name: 'Comunicação Integrada',
    description:
      'WhatsApp Business API integrado para comunicação automática com clientes.',
    icon: MessageSquare,
    color: 'from-teal-500 to-teal-600',
  },
  {
    name: 'Segurança Avançada',
    description:
      'Proteção de dados com criptografia e backup automático na nuvem.',
    icon: Shield,
    color: 'from-red-500 to-red-600',
  },
  {
    name: 'Gestão de Horários',
    description:
      'Controle flexível de horários de funcionamento, bloqueios e disponibilidade.',
    icon: Clock,
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    name: 'App Mobile',
    description:
      'Aplicativo móvel para gestão em tempo real, mesmo quando você não está no estúdio.',
    icon: Smartphone,
    color: 'from-pink-500 to-pink-600',
  },
  {
    name: 'Automação Completa',
    description:
      'Workflows automatizados para confirmações, lembretes e follow-ups pós-sessão.',
    icon: Zap,
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    name: 'Equipamentos',
    description:
      'Cadastro e controle de equipamentos disponíveis em cada sala do estúdio.',
    icon: HeadphonesIcon,
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    name: 'Configurações Flexíveis',
    description:
      'Personalize completamente o sistema de acordo com as necessidades do seu estúdio.',
    icon: Settings,
    color: 'from-gray-500 to-gray-600',
  },
  {
    name: 'Multi-idiomas',
    description:
      'Interface disponível em português, inglês e espanhol para atender clientes internacionais.',
    icon: Globe,
    color: 'from-emerald-500 to-emerald-600',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function Features() {
  return (
    <div id="features" className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">
            Recursos Completos
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Tudo que você precisa para gerenciar seu estúdio
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Uma plataforma completa com todas as ferramentas necessárias para automatizar 
            e otimizar a gestão do seu estúdio de música, podcast ou gravação.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
        >
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.name}
                  variants={itemVariants}
                  className="flex flex-col group"
                >
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r ${feature.color} group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </motion.div>
              );
            })}
          </dl>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Pronto para revolucionar seu estúdio?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Junte-se a centenas de estúdios que já automatizaram sua gestão com o StudioFlow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all transform hover:scale-105">
                Começar Teste Gratuito
              </button>
              <button className="rounded-md border border-gray-300 dark:border-gray-600 px-6 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Agendar Demonstração
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}