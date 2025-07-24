'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: 'Carlos Silva',
    role: 'Proprietário - Studio Beat',
    location: 'São Paulo, SP',
    content:
      'O StudioFlow revolucionou meu estúdio. Antes eu perdia 30% dos agendamentos por no-shows, agora com o pagamento antecipado isso praticamente zerou. A automação me deu tempo para focar no que realmente importa: a música.',
    rating: 5,
    avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20of%20a%20middle-aged%20Brazilian%20man%20with%20beard%2C%20music%20studio%20owner%2C%20confident%20smile%2C%20studio%20background&image_size=square',
    metrics: {
      improvement: '+150%',
      metric: 'Receita mensal',
    },
  },
  {
    id: 2,
    name: 'Ana Rodrigues',
    role: 'Produtora Musical - AR Studios',
    location: 'Rio de Janeiro, RJ',
    content:
      'A integração com WhatsApp é fantástica! Meus clientes adoram receber confirmações e lembretes automáticos. O sistema é muito intuitivo e o suporte é excepcional. Recomendo para qualquer estúdio.',
    rating: 5,
    avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20of%20a%20young%20Brazilian%20woman%2C%20music%20producer%2C%20creative%20professional%2C%20warm%20smile%2C%20modern%20studio%20background&image_size=square',
    metrics: {
      improvement: '90%',
      metric: 'Redução no-shows',
    },
  },
  {
    id: 3,
    name: 'Roberto Santos',
    role: 'Diretor - Podcast Central',
    location: 'Belo Horizonte, MG',
    content:
      'Gerencio 3 estúdios de podcast e o StudioFlow me permite controlar tudo de um lugar só. Os relatórios são muito detalhados e me ajudam a tomar decisões estratégicas. Melhor investimento que fiz.',
    rating: 5,
    avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20of%20a%20mature%20Brazilian%20man%2C%20podcast%20studio%20director%2C%20business%20professional%2C%20confident%20expression&image_size=square',
    metrics: {
      improvement: '3x',
      metric: 'Eficiência operacional',
    },
  },
  {
    id: 4,
    name: 'Mariana Costa',
    role: 'Fundadora - Harmony Records',
    location: 'Porto Alegre, RS',
    content:
      'Como mulher empreendedora na música, preciso de ferramentas que me deem credibilidade e profissionalismo. O StudioFlow fez isso e muito mais. Meus clientes ficam impressionados com a experiência.',
    rating: 5,
    avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20of%20a%20young%20Brazilian%20woman%2C%20music%20entrepreneur%2C%20recording%20studio%20founder%2C%20professional%20smile&image_size=square',
    metrics: {
      improvement: '+200%',
      metric: 'Novos clientes',
    },
  },
  {
    id: 5,
    name: 'Felipe Oliveira',
    role: 'Engenheiro de Som - FO Audio',
    location: 'Brasília, DF',
    content:
      'A facilidade de uso é impressionante. Configurei tudo em uma tarde e já estava recebendo agendamentos no mesmo dia. O app mobile me permite gerenciar tudo mesmo quando estou fora do estúdio.',
    rating: 5,
    avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20of%20a%20young%20Brazilian%20man%2C%20audio%20engineer%2C%20technical%20professional%2C%20friendly%20smile%2C%20recording%20equipment%20background&image_size=square',
    metrics: {
      improvement: '80%',
      metric: 'Tempo economizado',
    },
  },
  {
    id: 6,
    name: 'Juliana Ferreira',
    role: 'Proprietária - JF Studios',
    location: 'Recife, PE',
    content:
      'O que mais me impressiona são os insights que o sistema fornece. Agora sei exatamente quais horários são mais procurados, quais clientes são mais fiéis e como otimizar minha agenda para maximizar a receita.',
    rating: 5,
    avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20of%20a%20middle-aged%20Brazilian%20woman%2C%20studio%20owner%2C%20business%20professional%2C%20confident%20smile%2C%20modern%20office%20background&image_size=square',
    metrics: {
      improvement: '+120%',
      metric: 'ROI mensal',
    },
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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export function Testimonials() {
  return (
    <div id="testimonials" className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">
            Depoimentos
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            O que nossos clientes dizem
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Mais de 500 estúdios já transformaram sua gestão com o StudioFlow. 
            Veja os resultados reais que nossos clientes alcançaram.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              className="group relative"
            >
              <div className="h-full rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 transition-all duration-300 group-hover:shadow-lg group-hover:ring-blue-200 dark:group-hover:ring-blue-800">
                {/* Quote icon */}
                <div className="absolute -top-4 left-8">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 shadow-lg">
                    <Quote className="h-4 w-4 text-white" />
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-gray-900 dark:text-gray-100 mb-6">
                  <p className="text-sm leading-6">"{testimonial.content}"</p>
                </blockquote>

                {/* Metrics */}
                <div className="mb-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {testimonial.metrics.improvement}
                  </div>
                  <div className="text-sm text-blue-600/80 dark:text-blue-400/80">
                    {testimonial.metrics.metric}
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4"
        >
          {[
            { label: 'Satisfação', value: '98%' },
            { label: 'Estúdios Ativos', value: '500+' },
            { label: 'Agendamentos/Mês', value: '10k+' },
            { label: 'Suporte 24/7', value: '100%' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}