'use client';

import Link from 'next/link';
import { Calendar, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

const navigation = {
  product: [
    { name: 'Recursos', href: '#features' },
    { name: 'Como Funciona', href: '#how-it-works' },
    { name: 'Preços', href: '/pricing' },
    { name: 'Integrações', href: '/integrations' },
    { name: 'API', href: '/api' },
  ],
  support: [
    { name: 'Central de Ajuda', href: '/help' },
    { name: 'Documentação', href: '/docs' },
    { name: 'Status do Sistema', href: '/status' },
    { name: 'Contato', href: '/contact' },
    { name: 'Suporte Técnico', href: '/support' },
  ],
  company: [
    { name: 'Sobre Nós', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Carreiras', href: '/careers' },
    { name: 'Imprensa', href: '/press' },
    { name: 'Parceiros', href: '/partners' },
  ],
  legal: [
    { name: 'Termos de Uso', href: '/terms' },
    { name: 'Política de Privacidade', href: '/privacy' },
    { name: 'Cookies', href: '/cookies' },
    { name: 'LGPD', href: '/lgpd' },
    { name: 'Segurança', href: '/security' },
  ],
};

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/studioflow',
    icon: Facebook,
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/studioflow',
    icon: Instagram,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/studioflow',
    icon: Twitter,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/studioflow',
    icon: Linkedin,
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/studioflow',
    icon: Youtube,
  },
];

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'contato@studioflow.com.br',
    href: 'mailto:contato@studioflow.com.br',
  },
  {
    icon: Phone,
    label: 'Telefone',
    value: '(11) 3000-0000',
    href: 'tel:+551130000000',
  },
  {
    icon: MapPin,
    label: 'Endereço',
    value: 'São Paulo, SP - Brasil',
    href: '#',
  },
];

export function Footer() {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Company info */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                StudioFlow
              </span>
            </Link>
            
            <p className="text-sm leading-6 text-gray-300">
              A plataforma completa para gestão de estúdios de música, podcast e gravação. 
              Automatize agendamentos, gerencie clientes e maximize sua receita.
            </p>
            
            {/* Contact info */}
            <div className="space-y-3">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center space-x-3">
                    <Icon className="h-4 w-4 text-gray-400" />
                    <div>
                      <span className="text-xs text-gray-500">{item.label}:</span>
                      <a
                        href={item.href}
                        className="block text-sm text-gray-300 hover:text-white transition-colors"
                      >
                        {item.value}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Social links */}
            <div className="flex space-x-6">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-gray-300 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>
          
          {/* Navigation links */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Produto
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.product.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Suporte
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Empresa
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Legal
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="mt-16 border-t border-gray-900/10 pt-8">
          <div className="max-w-md">
            <h3 className="text-sm font-semibold leading-6 text-white">
              Receba novidades e dicas
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              Assine nossa newsletter e receba dicas exclusivas para otimizar seu estúdio.
            </p>
            <form className="mt-6 sm:flex sm:max-w-md">
              <label htmlFor="email-address" className="sr-only">
                Endereço de email
              </label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                autoComplete="email"
                required
                className="w-full min-w-0 appearance-none rounded-md border-0 bg-white/5 px-3 py-1.5 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:w-64 sm:text-sm sm:leading-6 xl:w-full"
                placeholder="Seu email"
              />
              <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                >
                  Assinar
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs leading-5 text-gray-400">
              &copy; {new Date().getFullYear()} StudioFlow. Todos os direitos reservados.
            </p>
            
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span>Feito com ❤️ no Brasil</span>
              <span>•</span>
              <span>CNPJ: 00.000.000/0001-00</span>
            </div>
          </div>
          
          {/* Certifications */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-green-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">SSL</span>
              </div>
              <span className="text-xs text-gray-500">Conexão Segura</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">LGPD</span>
              </div>
              <span className="text-xs text-gray-500">Conforme LGPD</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-purple-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">ISO</span>
              </div>
              <span className="text-xs text-gray-500">ISO 27001</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}