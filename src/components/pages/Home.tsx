// src/components/pages/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { PageLayout, ContentCard } from '../common/PageLayout';
import { 
  FileText, 
  CheckSquare, 
  Users, 
  Building, 
  BarChart3, 
  Clock, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  Star,
  Target,
  Lightbulb
} from 'lucide-react';
import Logo from '../../assets/image/logo.png';

export const Home = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: t('documents'),
      description: t('documentManagement'),
      icon: FileText,
      color: 'blue',
      path: '/documents',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      hoverColor: 'hover:bg-blue-100 dark:hover:bg-blue-900/30'
    },
    {
      title: t('tasks'),
      description: t('taskManagement'),
      icon: CheckSquare,
      color: 'green',
      path: '/tasks',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      hoverColor: 'hover:bg-green-100 dark:hover:bg-green-900/30'
    },
    {
      title: t('users'),
      description: t('userManagement'),
      icon: Users,
      color: 'purple',
      path: '/companies/user',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      hoverColor: 'hover:bg-purple-100 dark:hover:bg-purple-900/30'
    },
    {
      title: t('dashboard'),
      description: 'Visão geral do sistema',
      icon: BarChart3,
      color: 'orange',
      path: '/dashboard',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
      hoverColor: 'hover:bg-orange-100 dark:hover:bg-orange-900/30'
    }
  ];

  const features = [
    {
      title: 'Gestão de Documentos',
      description: 'Organize, edite e colabore em documentos com versionamento avançado.',
      icon: FileText,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Controle de Tarefas',
      description: 'Gerencie projetos e tarefas com quadros Kanban e dashboards analíticos.',
      icon: Target,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Colaboração em Equipe',
      description: 'Trabalhe em equipe com ferramentas de comunicação e compartilhamento.',
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Análises e Relatórios',
      description: 'Obtenha insights com relatórios detalhados e métricas de performance.',
      icon: TrendingUp,
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];

  const handleQuickAction = (path: string) => {
    navigate(path);
  };

  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return 'Bom dia';
    if (currentHour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <img src={Logo} className="h-24 w-24" alt="Documentin Logo" />
          </div>
          
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {getGreeting()}, {user?.name}!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Bem-vindo ao <span className="font-semibold text-blue-600 dark:text-blue-400">Documentin</span>
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Sua plataforma completa para gestão de documentos e colaboração
            </p>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <ContentCard title="Acesso Rápido">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={() => handleQuickAction(action.path)}
                className={`${action.bgColor} ${action.hoverColor} p-6 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 border border-gray-200 dark:border-gray-600`}
              >
                <div className="flex items-center justify-between mb-4">
                  <action.icon className={`h-8 w-8 ${action.iconColor}`} />
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {action.description}
                </p>
              </div>
            ))}
          </div>
        </ContentCard>

        {/* Features Section */}
        <ContentCard title="Recursos Principais">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600"
              >
                <div className="flex-shrink-0">
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ContentCard>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ContentCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Atividade Hoje
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  --
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </ContentCard>

          <ContentCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Tarefas Pendentes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  --
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </ContentCard>

          <ContentCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Documentos Recentes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  --
                </p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </ContentCard>
        </div>

        {/* Tips Section */}
        <ContentCard>
          <div className="flex items-start space-x-4">
            <Lightbulb className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Dica do Dia
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Use atalhos de teclado para navegar mais rapidamente pelo sistema. 
                Pressione <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl + K</kbd> para busca rápida!
              </p>
            </div>
          </div>
        </ContentCard>

        {/* Footer Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600 pt-6">
          <p>
            © 202 Documentin
          </p>
        </div>
      </div>
    </PageLayout>
  );
};