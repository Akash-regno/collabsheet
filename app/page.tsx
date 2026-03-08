'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Particles } from '@/components/ui/particles';
import { ArrowRight, Calculator, Users, Zap, Shield, Globe, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      <Particles />
      
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent animate-gradient"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent animate-gradient"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              CollabSheet
            </span>
          </div>
          <Button 
            onClick={() => router.push('/auth')}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
            <span className="text-sm text-purple-300 font-medium">Real-time Collaboration Made Simple</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
              Spreadsheets
            </span>
            <br />
            <span className="text-slate-100">That Work Together</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Create, collaborate, and compute in real-time. The modern spreadsheet experience with powerful formulas and seamless team collaboration.
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button 
              onClick={() => router.push('/auth')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg px-8 py-6 group"
            >
              Start Creating Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              onClick={() => router.push('/auth')}
              size="lg"
              variant="outline"
              className="border-slate-700/50 bg-slate-900/50 backdrop-blur-sm text-slate-300 hover:bg-purple-500/10 hover:border-purple-500/50 transition-all duration-300 text-lg px-8 py-6"
            >
              View Demo
            </Button>
          </div>
        </div>

        {/* Feature Preview */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
          <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-xl p-2 shadow-2xl hover-glow animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="aspect-video rounded-lg bg-gradient-to-br from-purple-900/20 to-indigo-900/20 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
              <div className="relative z-10 text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center animate-float">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                </div>
                <p className="text-slate-400 text-lg">Interactive spreadsheet preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-100 mb-4">
            Everything you need to <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">collaborate</span>
          </h2>
          <p className="text-slate-400 text-lg">Powerful features designed for modern teams</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="w-6 h-6" />,
              title: 'Real-time Sync',
              description: 'See changes instantly as your team collaborates. No refresh needed.',
              color: 'from-yellow-600 to-orange-600'
            },
            {
              icon: <Users className="w-6 h-6" />,
              title: 'Live Presence',
              description: 'Know who\'s online and what they\'re editing in real-time.',
              color: 'from-blue-600 to-cyan-600'
            },
            {
              icon: <Calculator className="w-6 h-6" />,
              title: '20+ Functions',
              description: 'Powerful formula engine with SUM, AVERAGE, IF, and more.',
              color: 'from-purple-600 to-pink-600'
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: 'Secure & Private',
              description: 'Your data is encrypted and secure with Firebase.',
              color: 'from-green-600 to-emerald-600'
            },
            {
              icon: <Globe className="w-6 h-6" />,
              title: 'Share Anywhere',
              description: 'One-click sharing with anyone, anywhere in the world.',
              color: 'from-indigo-600 to-purple-600'
            },
            {
              icon: <CheckCircle2 className="w-6 h-6" />,
              title: 'Auto-save',
              description: 'Never lose your work. Everything saves automatically.',
              color: 'from-teal-600 to-cyan-600'
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-2xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/70 hover:border-purple-500/30 transition-all duration-300 hover-glow animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2 group-hover:text-purple-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <div className="rounded-3xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-xl p-12 text-center space-y-6 hover-glow relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-glow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }}></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-slate-100 mb-4">
              Ready to start collaborating?
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Join thousands of teams already using CollabSheet
            </p>
            <Button 
              onClick={() => router.push('/auth')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg px-12 py-6 group"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <span className="text-sm text-slate-400">© 2026 CollabSheet.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-purple-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
