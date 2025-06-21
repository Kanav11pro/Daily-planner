
import { TrendingUp, Target, Calendar, Clock, Award, BookOpen, Zap, Sparkles, Brain, BarChart3, Star, Trophy, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";

interface Task {
  id: string;
  title: string;
  subject: string;
  completed: boolean;
  priority: string;
  created_at: string;
  scheduled_date: string;
  duration?: number;
}

interface TaskAnalyticsProps {
  tasks: Task[];
  onOpenWeeklyAnalytics: () => void;
}

export const TaskAnalytics = ({
  tasks,
  onOpenWeeklyAnalytics
}: TaskAnalyticsProps) => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  // Get today's date in YYYY-MM-DD format to match scheduled_date format
  const today = new Date().toISOString().split('T')[0];

  // Filter tasks for today using scheduled_date
  const todayTasks = tasks.filter(task => task.scheduled_date === today);
  console.log('Today:', today);
  console.log('All tasks:', tasks);
  console.log('Today tasks:', todayTasks);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  const weeklyCompletion = last7Days.map(date => {
    const dayTasks = tasks.filter(task => task.scheduled_date === date);
    const completed = dayTasks.filter(task => task.completed).length;
    const total = dayTasks.length;
    return {
      date,
      completed,
      total,
      percentage: total > 0 ? completed / total * 100 : 0
    };
  }).reverse();

  const completedToday = todayTasks.filter(task => task.completed).length;
  const totalToday = todayTasks.length;
  const progressPercentage = totalToday > 0 ? completedToday / totalToday * 100 : 0;

  const subjectStats = tasks.reduce((acc, task) => {
    if (!acc[task.subject]) {
      acc[task.subject] = {
        completed: 0,
        total: 0,
        timeSpent: 0
      };
    }
    acc[task.subject].total++;
    if (task.completed) {
      acc[task.subject].completed++;
      acc[task.subject].timeSpent += task.duration || 0;
    }
    return acc;
  }, {} as Record<string, { completed: number; total: number; timeSpent: number; }>);

  const totalTimeSpent = Object.values(subjectStats).reduce((sum, stat) => sum + stat.timeSpent, 0);
  const averageCompletion = weeklyCompletion.reduce((sum, day) => sum + day.percentage, 0) / 7;
  const highPriorityCompleted = tasks.filter(task => task.priority === 'high' && task.completed).length;
  const totalHighPriority = tasks.filter(task => task.priority === 'high').length;

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'mathematics':
      case 'maths':
        return '📐';
      case 'physics':
        return '⚛️';
      case 'chemistry':
        return '🧪';
      case 'biology':
        return '🧬';
      case 'mock test':
        return '📝';
      default:
        return '📚';
    }
  };

  return (
    <div className="space-y-4">
      {/* Enhanced Subject Mastery Card */}
      <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg hover:shadow-xl transition-all duration-300`}>
        <CardHeader className="pb-3">
          <CardTitle className={`flex items-center space-x-2 ${themeColors.text}`}>
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span>Subject Mastery</span>
            <div className="ml-auto">
              <Trophy className="h-4 w-4 text-yellow-500" />
            </div>
          </CardTitle>
          <CardDescription className={`${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-300' : 'text-gray-600'}`}>
            Track your progress across all subjects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(subjectStats).length > 0 ? (
              Object.entries(subjectStats).map(([subject, stats]) => (
                <div key={subject} className={`p-3 rounded-xl border transition-all duration-200 hover:shadow-md ${
                  theme === 'midnight' || theme === 'obsidian' 
                    ? 'bg-slate-700/30 border-gray-600 hover:bg-slate-700/50' 
                    : 'bg-gradient-to-r from-gray-50 to-white border-gray-200 hover:from-gray-100 hover:to-gray-50'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getSubjectIcon(subject)}</span>
                      <span className={`font-semibold ${themeColors.text}`}>{subject}</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${themeColors.text}`}>
                        {stats.completed}/{stats.total}
                      </div>
                      <div className={`text-xs ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {Math.floor(stats.timeSpent / 60)}h {stats.timeSpent % 60}m
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Progress 
                      value={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs">
                      <span className={`${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% Complete
                      </span>
                      {stats.completed === stats.total && stats.total > 0 && (
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center p-6 rounded-lg ${
                theme === 'midnight' || theme === 'obsidian' 
                  ? 'bg-slate-700/30' 
                  : 'bg-gray-50'
              }`}>
                <BookOpen className={`h-8 w-8 mx-auto mb-2 ${
                  theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <p className={`text-sm ${themeColors.text}`}>No subjects yet</p>
                <p className={`text-xs ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Add some tasks to see your progress!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Daily Consistency Card */}
      <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg hover:shadow-xl transition-all duration-300`}>
        <CardHeader className="pb-3">
          <CardTitle className={`flex items-center space-x-2 ${themeColors.text}`}>
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <span>Weekly Streak</span>
            <div className="ml-auto">
              <Sparkles className="h-4 w-4 text-purple-500" />
            </div>
          </CardTitle>
          <CardDescription className={`${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-300' : 'text-gray-600'}`}>
            Your consistency over the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {weeklyCompletion.map((day, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className={`text-xs font-medium ${theme === 'midnight' || theme === 'obsidian' ? ' # src/app/components/Header.jsx
'use client'
import Link from 'next/link'
import { FaCoffee } from 'react-icons/fa'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <FaCoffee className="text-brown-600 text-2xl" />
            <span className="font-bold text-xl text-brown-800">MoMo Café</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-brown-600 transition-colors">
              Inicio
            </Link>
            <Link href="/menu" className="text-gray-700 hover:text-brown-600 transition-colors">
              Menú
            </Link>
            <Link href="/sobre-nosotros" className="text-gray-700 hover:text-brown-600 transition-colors">
              Sobre Nosotros
            </Link>
            <Link href="/contacto" className="text-gray-700 hover:text-brown-600 transition-colors">
              Contacto
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-gray-700"></div>
              <div className="w-full h-0.5 bg-gray-700"></div>
              <div className="w-full h-0.5 bg-gray-700"></div>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-brown-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                href="/menu" 
                className="text-gray-700 hover:text-brown-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Menú
              </Link>
              <Link 
                href="/sobre-nosotros" 
                className="text-gray-700 hover:text-brown-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre Nosotros
              </Link>
              <Link 
                href="/contacto" 
                className="text-gray-700 hover:text-brown-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}End File# diegorobert13/momo-cafe
import Image from 'next/image'

const menuCategories = [
  {
    title: "Cafés Especiales",
    items: [
      {
        name: "Espresso",
        description: "Café intenso y aromático",
        price: "$2.50",
        image: "/images/espresso.jpg"
      },
      {
        name: "Cappuccino",
        description: "Espresso con leche espumada",
        price: "$3.50",
        image: "/images/cappuccino.jpg"
      },
      {
        name: "Latte",
        description: "Café suave con leche cremosa",
        price: "$4.00",
        image: "/images/latte.jpg"
      },
      {
        name: "Mocha",
        description: "Café con chocolate y crema",
        price: "$4.50",
        image: "/images/mocha.jpg"
      }
    ]
  },
  {
    title: "Postres Artesanales",
    items: [
      {
        name: "Cheesecake",
        description: "Tarta de queso con frutos rojos",
        price: "$5.00",
        image: "/images/cheesecake.jpg"
      },
      {
        name: "Tiramisú",
        description: "Postre italiano con café",
        price: "$4.50",
        image: "/images/tiramisu.jpg"
      },
      {
        name: "Brownie",
        description: "Chocolate intenso con nueces",
        price: "$3.50",
        image: "/images/brownie.jpg"
      },
      {
        name: "Croissant",
        description: "Recién horneado con mantequilla",
        price: "$2.50",
        image: "/images/croissant.jpg"
      }
    ]
  },
  {
    title: "Bebidas Frías",
    items: [
      {
        name: "Café Helado",
        description: "Café frío con hielo",
        price: "$3.00",
        image: "/images/iced-coffee.jpg"
      },
      {
        name: "Frappé",
        description: "Café batido con crema",
        price: "$4.00",
        image: "/images/frappe.jpg"
      },
      {
        name: "Smoothie de Frutas",
        description: "Batido natural de temporada",
        price: "$3.50",
        image: "/images/smoothie.jpg"
      },
      {
        name: "Limonada",
        description: "Refrescante y natural",
        price: "$2.50",
        image: "/images/lemonade.jpg"
      }
    ]
  }
]

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/menu-hero.jpg')"
        }}
      >
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestro Menú</h1>
          <p className="text-xl">Descubre nuestras deliciosas opciones</p>
        </div>
      </div>

      {/* Menu Content */}
      <div className="container mx-auto px-4 py-12">
        {menuCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-brown-800">
              {category.title}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
                >
                  <div className="relative h-48">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-brown-800">
                        {item.name}
                      </h3>
                      <span className="text-lg font-bold text-brown-600">
                        {item.price}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-brown-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Te antoja algo?</h2>
          <p className="text-xl mb-6">Ven a visitarnos y disfruta de nuestras especialidades</p>
          <button className="bg-brown-600 hover:bg-brown-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
            Ver Ubicación
          </button>
        </div>
      </div>
    </div>
  )
}End File# diegorobert13/momo-cafe
# src/app/sobre-nosotros/page.js
import Image from 'next/image'
import { FaCoffee, FaHeart, FaUsers, FaLeaf } from 'react-icons/fa'

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/about-hero.jpg')"
        }}
      >
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre Nosotros</h1>
          <p className="text-xl">Conoce nuestra historia y pasión por el café</p>
        </div>
      </div>

      {/* Nuestra Historia */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-brown-800">Nuestra Historia</h2>
            <p className="text-gray-700 mb-4 text-lg leading-relaxed">
              MoMo Café nació en 2020 con un sueño simple: crear un espacio donde las personas pudieran 
              disfrutar del mejor café en un ambiente acogedor y familiar.
            </p>
            <p className="text-gray-700 mb-4 text-lg leading-relaxed">
              Comenzamos como un pequeño emprendimiento familiar, y gracias al apoyo de nuestra comunidad, 
              hemos crecido hasta convertirnos en un punto de encuentro favorito para los amantes del café.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Cada taza que servimos lleva nuestro amor por la calidad y el servicio excepcional. 
              Creemos que el café es más que una bebida; es una experiencia que une a las personas.
            </p>
          </div>
          <div className="relative h-96">
            <Image
              src="/images/our-story.jpg"
              alt="Nuestra historia"
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Nuestros Valores */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-brown-800">Nuestros Valores</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-brown-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCoffee className="text-brown-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brown-800">Calidad</h3>
              <p className="text-gray-600">
                Seleccionamos los mejores granos de café para garantizar una experiencia excepcional
              </p>
            </div>
            <div className="text-center">
              <div className="bg-brown-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-brown-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brown-800">Pasión</h3>
              <p className="text-gray-600">
                Cada preparación está hecha con amor y dedicación por nuestro equipo
              </p>
            </div>
            <div className="text-center">
              <div className="bg-brown-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-brown-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brown-800">Comunidad</h3>
              <p className="text-gray-600">
                Somos parte de la comunidad y nos enorgullecemos de servir a nuestros vecinos
              </p>
            </div>
            <div className="text-center">
              <div className="bg-brown-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLeaf className="text-brown-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brown-800">Sostenibilidad</h3>
              <p className="text-gray-600">
                Comprometidos con prácticas responsables y el cuidado del medio ambiente
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Nuestro Equipo */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-brown-800">Nuestro Equipo</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4">
              <Image
                src="/images/team-maria.jpg"
                alt="María González - Fundadora"
                fill
                className="object-cover rounded-full shadow-lg"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-brown-800">María González</h3>
            <p className="text-brown-600 mb-2">Fundadora & CEO</p>
            <p className="text-gray-600 text-sm">
              Con más de 15 años de experiencia en la industria del café, María fundó MoMo Café 
              con la visión de crear un espacio único para la comunidad.
            </p>
          </div>
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4">
              <Image
                src="/images/team-carlos.jpg"
                alt="Carlos Rodríguez - Barista Principal"
                fill
                className="object-cover rounded-full shadow-lg"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-brown-800">Carlos Rodríguez</h3>
            <p className="text-brown-600 mb-2">Barista Principal</p>
            <p className="text-gray-600 text-sm">
              Maestro en el arte del café, Carlos se encarga de entrenar a nuestro equipo y 
              crear nuevas recetas que deleitan a nuestros clientes.
            </p>
          </div>
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4">
              <Image
                src="/images/team-ana.jpg"
                alt="Ana Morales - Chef Pastelera"
                fill
                className="object-cover rounded-full shadow-lg"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-brown-800">Ana Morales</h3>
            <p className="text-brown-600 mb-2">Chef Pastelera</p>
            <p className="text-gray-600 text-sm">
              Ana crea todos nuestros postres artesanales con ingredientes frescos y 
              recetas tradicionales que complementan perfectamente nuestros cafés.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-brown-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¡Ven a Conocernos!</h2>
          <p className="text-xl mb-6">Te invitamos a formar parte de nuestra familia cafetera</p>
          <button className="bg-brown-600 hover:bg-brown-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
            Visítanos Hoy
          </button>
        </div>
      </div>
    </div>
  )
}End File# diegorobert13/momo-cafe
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa'

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/contact-hero.jpg')"
        }}
      >
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contacto</h1>
          <p className="text-xl">Estamos aquí para servirte</p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-brown-800">Información de Contacto</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-brown-100 p-3 rounded-full">
                  <FaMapMarkerAlt className="text-brown-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-brown-800">Dirección</h3>
                  <p className="text-gray-700">
                    Av. Principal 123<br />
                    Centro, Ciudad<br />
                    CP 12345
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-brown-100 p-3 rounded-full">
                  <FaPhone className="text-brown-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-brown-800">Teléfono</h3>
                  <p className="text-gray-700">
                    +52 (555) 123-4567<br />
                    +52 (555) 123-4568
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-brown-100 p-3 rounded-full">
                  <FaEnvelope className="text-brown-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-brown-800">Email</h3>
                  <p className="text-gray-700">
                    info@momocafe.com<br />
                    pedidos@momocafe.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-brown-100 p-3 rounded-full">
                  <FaClock className="text-brown-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-brown-800">Horarios</h3>
                  <div className="text-gray-700">
                    <p><strong>Lunes - Viernes:</strong> 7:00 AM - 9:00 PM</p>
                    <p><strong>Sábados:</strong> 8:00 AM - 10:00 PM</p>
                    <p><strong>Domingos:</strong> 8:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-brown-800">Envíanos un Mensaje</h2>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-600 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido
                  </label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-600 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-600 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto
                </label>
                <select
                  id="asunto"
                  name="asunto"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-600 focus:border-transparent"
                  required
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="consulta">Consulta General</option>
                  <option value="reserva">Reserva de Mesa</option>
                  <option value="evento">Evento Privado</option>
                  <option value="sugerencia">Sugerencia</option>
                  <option value="reclamo">Reclamo</option>
                </select>
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-600 focus:border-transparent"
                  placeholder="Escribe tu mensaje aquí..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-brown-600 hover:bg-brown-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-brown-800">Nuestra Ubicación</h2>
          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
            {/* Aquí iría un mapa real, por ejemplo Google Maps */}
            <div className="text-center text-gray-600">
              <FaMapMarkerAlt className="text-4xl mb-4 mx-auto text-brown-600" />
              <p className="text-lg">Mapa de ubicación</p>
              <p className="text-sm">Av. Principal 123, Centro, Ciudad</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}End Fileimport Image from 'next/image'
import Link from 'next/link'
import { FaCoffee, FaHeart, FaStar, FaMapMarkerAlt } from 'react-icons/fa'

const featuredProducts = [
  {
    name: "Cappuccino Especial",
    description: "Nuestra receta secreta con espuma perfecta",
    price: "$3.50",
    image: "/images/cappuccino-featured.jpg"
  },
  {
    name: "Cheesecake de Temporada",
    description: "Hecho con ingredientes frescos locales",
    price: "$5.00",
    image: "/images/cheesecake-featured.jpg"
  },
  {
    name: "Café Helado Premium",
    description: "Perfecto para días calurosos",
    price: "$4.00",
    image: "/images/iced-coffee-featured.jpg"
  }
]

const testimonials = [
  {
    name: "María Elena",
    text: "El mejor café de la ciudad. El ambiente es acogedor y el servicio excepcional.",
    rating: 5
  },
  {
    name: "Carlos Mendoza",
    text: "Los postres son increíbles y el café siempre está perfecto. Mi lugar favorito.",
    rating: 5
  },
  {
    name: "Ana Sofía",
    text: "Un lugar perfecto para trabajar o relajarse. Muy recomendado.",
    rating: 5
  }
]

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen bg-cover bg-center flex items-center justify-center" 
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/images/hero-bg.jpg')"
        }}>
        <div className="text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Bienvenido a <span className="text-yellow-400">MoMo Café</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Donde cada taza cuenta una historia y cada momento se vuelve especial
          </p>
          <div className="space-x-4">
            <Link href="/menu" className="inline-block bg-brown-600 hover:bg-brown-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
              Ver Menú
            </Link>
            <Link href="/contacto" className="inline-block border-2 border-white hover:bg-white hover:text-brown-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
              Contáctanos
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-brown-800">¿Por qué elegir MoMo Café?</h2>
            <p className="text-gray-600 text-lg">Tres razones que nos hacen únicos</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-brown-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCoffee className="text-brown-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-brown-800">Café Premium</h3>
              <p className="text-gray-600">
                Seleccionamos los mejores granos de café de origen para ofrec
erte una experiencia única en cada sorbo.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-brown-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-brown-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-brown-800">Hecho con Amor</h3>
              <p className="text-gray-600">
                Cada preparación es elaborada con pasión y dedicación por nuestro equipo de baristas expertos.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-brown-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMapMarkerAlt className="text-brown-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-brown-800">Ambiente Acogedor</h3>
              <p className="text-gray-600">
                Un espacio diseñado para que te sientas como en casa, perfecto para relajarte o trabajar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-brown-800">Nuestras Especialidades</h2>
            <p className="text-gray-600 text-lg">Productos destacados que no puedes perderte</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <div className="relative h-64">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-brown-800">{product.name}</h3>
                    <span className="text-lg font-bold text-brown-600">{product.price}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <button className="w-full bg-brown-600 hover:bg-brown-700 text-white py-2 px-4 rounded-lg transition-colors duration-300">
                    Ordenar Ahora
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-brown-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-brown-200 text-lg">Testimonios reales de personas que aman MoMo Café</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-brown-700 p-6 rounded-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-lg" />
                  ))}
                </div>
                <p className="text-brown-100 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-brown-800">¿Listo para una experiencia única?</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Ven a visitarnos y descubre por qué MoMo Café se ha convertido en el lugar favorito de la comunidad
          </p>
          <div className="space-x-4">
            <Link href="/menu" className="inline-block bg-brown-600 hover:bg-brown-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
              Explorar Menú
            </Link>
            <Link href="/sobre-nosotros" className="inline-block border-2 border-brown-600 hover:bg-brown-600 hover:text-white text-brown-600 px-8 py-3 rounded-lg font-semibold transition-all duration-300">
              Conocer Más
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}End File# src/app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MoMo Café - El mejor café de la ciudad',
  description: 'Descubre el mejor café artesanal, postres deliciosos y un ambiente acogedor en MoMo Café. Tu lugar favorito para disfrutar momentos especiales.',
  keywords: 'café, coffee shop, postres, desayunos, meriendas, café artesanal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Header />
        <main>
          {children}
        </main>
        <footer className="bg-brown-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">MoMo Café</h3>
                <p className="text-brown-200 text-sm">
                  Tu lugar favorito para disfrutar del mejor café y postres artesanales en un ambiente acogedor.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
                <ul className="space-y-2 text-brown-200 text-sm">
                  <li><a href="/" className="hover:text-white transition-colors">Inicio</a></li>
                  <li><a href="/menu" className="hover:text-white transition-colors">Menú</a></li>
                  <li><a href="/sobre-nosotros" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
                  <li><a href="/contacto" className="hover:text-white transition-colors">Contacto</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Horarios</h3>
                <div className="text-brown-200 text-sm space-y-1">
                  <p>Lun - Vie: 7:00 AM - 9:00 PM</p>
                  <p>Sábados: 8:00 AM - 10:00 PM</p>
                  <p>Domingos: 8:00 AM - 8:00 PM</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contacto</h3>
                <div className="text-brown-200 text-sm space-y-1">
                  <p>Av. Principal 123</p>
                  <p>Centro, Ciudad</p>
                  <p>Tel: (555) 123-4567</p>
                  <p>info@momocafe.com</p>
                </div>
              </div>
            </div>
            <div className="border-t border-brown-700 mt-8 pt-8 text-center text-brown-200 text-sm">
              <p>&copy; 2024 MoMo Café. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}End File'
            : 'text-gray-500'}`}>
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'narrow' })}
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold mx-auto transition-all duration-300 ${
                    day.percentage >= 80 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg animate-pulse' 
                      : day.percentage >= 50 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md' 
                        : day.percentage > 0 
                          ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-sm' 
                          : theme === 'midnight' || theme === 'obsidian'
                            ? 'bg-gray-700 text-gray-400 border border-gray-600'
                            : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}>
                    {day.total > 0 ? `${Math.round(day.percentage)}%` : '-'}
                  </div>
                  <div className={`text-xs mt-1 ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {day.total > 0 && (
                      <span>{day.completed}/{day.total}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`mt-6 p-4 rounded-lg ${
              theme === 'midnight' || theme === 'obsidian' 
                ? 'bg-slate-700/30 border border-gray-600' 
                : 'bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${themeColors.text}`}>Weekly Average</p>
                  <p className={`text-xs ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Your consistency score
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${themeColors.text}`}>
                    {Math.round(averageCompletion)}%
                  </div>
                  <div className="flex items-center space-x-1">
                    {averageCompletion >= 80 && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                    <span className={`text-xs ${
                      averageCompletion >= 80 ? 'text-green-600' : 
                      averageCompletion >= 60 ? 'text-yellow-600' : 'text-gray-500'
                    }`}>
                      {averageCompletion >= 80 ? 'Excellent!' : averageCompletion >= 60 ? 'Good!' : 'Keep going!'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Weekly Analytics Button */}
      <Card className={`${themeColors.card} ${themeColors.glow} shadow-lg hover:shadow-xl transition-all duration-300 group`}>
        <CardContent className="p-0">
          <Button 
            onClick={onOpenWeeklyAnalytics} 
            className={`w-full h-auto p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 group-hover:scale-105 border-0`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">Weekly Analytics</div>
                  <div className="text-sm opacity-90">Detailed insights & performance charts</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
