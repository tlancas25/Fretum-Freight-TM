"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Truck, 
  MapPin, 
  BarChart3, 
  Shield, 
  Clock, 
  Users, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  ChevronDown,
  Menu,
  X,
  Star,
  Play,
  FileText,
  DollarSign,
  Route,
  Bell,
  Fuel,
  Wrench,
  Building2,
  Package,
  HardHat,
  Landmark
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const features = [
    {
      icon: MapPin,
      title: "Real-time Tracking",
      description: "Monitor your fleet 24/7 with GPS precision and live status updates.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: FileText,
      title: "Load Management",
      description: "AI-powered document extraction and automated load creation.",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: DollarSign,
      title: "Invoicing & Settlements",
      description: "Automated billing, driver settlements, and payment tracking.",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    },
    {
      icon: Route,
      title: "Dispatch & Routing",
      description: "Optimize routes and dispatch with intelligent scheduling.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Fuel,
      title: "IFTA Reporting",
      description: "Automated fuel tax calculations and compliance reports.",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    {
      icon: Wrench,
      title: "Fleet Maintenance",
      description: "Preventive maintenance schedules and service tracking.",
      color: "text-red-500",
      bgColor: "bg-red-500/10"
    }
  ]

  const stats = [
    { value: "99.9%", label: "Uptime", icon: Zap },
    { value: "<200ms", label: "Updates", icon: Clock },
    { value: "500+", label: "Fleets", icon: Truck },
    { value: "SOC2", label: "Compliant", icon: Shield }
  ]

  const outcomes = [
    {
      role: "Operations",
      metrics: [
        { value: "-22%", label: "Downtime" },
        { value: "+18%", label: "On-time arrivals" },
        { value: "2x", label: "Faster dispatch" }
      ]
    },
    {
      role: "Safety",
      metrics: [
        { value: "-30%", label: "Incidents" },
        { value: "+95%", label: "Inspection compliance" },
        { value: "-24%", label: "Harsh events" }
      ]
    },
    {
      role: "Finance",
      metrics: [
        { value: "-28%", label: "Operating costs" },
        { value: "-20%", label: "Fuel spend" },
        { value: "+15%", label: "Asset utilization" }
      ]
    }
  ]

  const industries = [
    {
      icon: Truck,
      title: "Trucking & Logistics",
      description: "Full truckload, LTL, and intermodal operations with ELD integration."
    },
    {
      icon: Package,
      title: "Delivery & Courier",
      description: "Last-mile delivery optimization with proof of delivery."
    },
    {
      icon: HardHat,
      title: "Construction",
      description: "Heavy equipment tracking and job site logistics."
    },
    {
      icon: Landmark,
      title: "Government & Municipal",
      description: "Audit-ready compliance and fleet accountability."
    }
  ]

  const testimonials = [
    {
      quote: "We reduced delivery delays by 28% in the first month with real-time tracking.",
      author: "Marcus J.",
      role: "Fleet Manager",
      company: "Regional Logistics Co.",
      metric: "28% reduction"
    },
    {
      quote: "The automated invoicing saves us 10+ hours every week. Game changer.",
      author: "Sarah T.",
      role: "Operations Director",
      company: "Express Freight Inc.",
      metric: "10hrs saved/week"
    },
    {
      quote: "Setup was incredibly fast. We were live in under 2 hours.",
      author: "David R.",
      role: "Owner-Operator",
      company: "D&R Transport",
      metric: "2hr setup"
    }
  ]

  const faqs = [
    {
      question: "How quickly can I get started?",
      answer: "You can be managing your first load in under 10 minutes! Simply create an account, add your vehicles, and start dispatching. For larger fleets, our onboarding team can have you fully migrated within 24-48 hours."
    },
    {
      question: "Do I need ELD hardware?",
      answer: "Fretum-Freight integrates with major ELD providers like Samsara, Motive, and Geotab. You can also use our mobile app for basic tracking without hardware. We support BYOD (bring your own device) setups."
    },
    {
      question: "Is there a long-term contract?",
      answer: "No long-term contracts required. We offer flexible month-to-month billing so you can scale up or down as your business needs change. We believe in earning your business every month."
    },
    {
      question: "Can I import my existing data?",
      answer: "Yes! You can import customers, drivers, vehicles, and historical loads via CSV upload or through our API. Our team provides free migration assistance to help you transition smoothly."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We offer 24/7 email support, live chat during business hours, phone support for urgent issues, and comprehensive documentation. Every customer gets access to onboarding specialists and training resources."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use bank-grade encryption, SOC2 compliant infrastructure on Google Cloud Platform, and regular security audits. Your data is backed up across multiple regions for disaster recovery."
    }
  ]

  const howItWorks = [
    {
      step: "01",
      title: "Connect & Setup",
      description: "Get your fleet connected in minutes with flexible onboarding options.",
      points: [
        "Import vehicles via CSV or API",
        "Connect ELD devices and integrations",
        "Set up driver profiles and permissions",
        "Configure basic fleet settings"
      ]
    },
    {
      step: "02",
      title: "Configure & Customize",
      description: "Tailor Fretum-Freight to match your specific operations.",
      points: [
        "Set up customer and lane preferences",
        "Configure rate confirmations and invoicing",
        "Create automated alert rules",
        "Customize dashboards and reports"
      ]
    },
    {
      step: "03",
      title: "Monitor & Optimize",
      description: "Take action on real-time insights to improve performance.",
      points: [
        "Monitor live fleet status",
        "Dispatch loads with optimal routing",
        "Track revenue and expenses",
        "Generate compliance reports"
      ]
    },
    {
      step: "04",
      title: "Scale & Grow",
      description: "Leverage analytics and automation to drive results.",
      points: [
        "Use AI insights for better decisions",
        "Automate repetitive workflows",
        "Scale operations with advanced analytics",
        "Integrate with accounting systems"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900">Fretum-Freight</span>
                <span className="hidden sm:inline text-xs text-slate-500 ml-2">TMS</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                How It Works
              </Link>
              <Link href="#industries" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Industries
              </Link>
              <Link href="#faq" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                FAQ
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-600">Sign In</Button>
              </Link>
              <Link href="/login">
                <Button className="bg-brand-600 hover:bg-brand-700 text-white">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-4">
            <Link href="#features" className="block text-sm font-medium text-slate-600">Features</Link>
            <Link href="#how-it-works" className="block text-sm font-medium text-slate-600">How It Works</Link>
            <Link href="#industries" className="block text-sm font-medium text-slate-600">Industries</Link>
            <Link href="#faq" className="block text-sm font-medium text-slate-600">FAQ</Link>
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <Link href="/login" className="block">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link href="/login" className="block">
                <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white">Start Free Trial</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-green-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm mb-6">
                <Zap className="h-4 w-4 text-green-400" />
                AI-Powered Fleet Intelligence
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                One Platform<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                  Total Fleet Control
                </span>
              </h1>
              
              <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto lg:mx-0">
                Transform your freight operations with real-time tracking, intelligent dispatch, 
                and automated invoicing. Reduce costs, enhance safety, and optimize performance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Link href="/login">
                  <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2 text-white/60">
                    <stat.icon className="h-4 w-4 text-green-400" />
                    <span className="font-semibold text-white">{stat.value}</span>
                    <span className="text-sm">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Dashboard Preview */}
            <div className="relative hidden lg:block">
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 shadow-2xl">
                <div className="bg-slate-900 rounded-xl overflow-hidden">
                  {/* Mock Dashboard Header */}
                  <div className="bg-slate-800 px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-xs text-slate-400 ml-2">Fretum-Freight Dashboard</span>
                  </div>
                  
                  {/* Mock Dashboard Content */}
                  <div className="p-4 space-y-4">
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-800 rounded-lg p-3">
                        <p className="text-xs text-slate-400">Active Loads</p>
                        <p className="text-xl font-bold text-white">24</p>
                        <p className="text-xs text-green-400">+12% ↗</p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3">
                        <p className="text-xs text-slate-400">Revenue</p>
                        <p className="text-xl font-bold text-white">$48.2K</p>
                        <p className="text-xs text-green-400">+18% ↗</p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3">
                        <p className="text-xs text-slate-400">On-Time</p>
                        <p className="text-xl font-bold text-white">94%</p>
                        <p className="text-xs text-green-400">+5% ↗</p>
                      </div>
                    </div>
                    
                    {/* Map Placeholder */}
                    <div className="bg-slate-800 rounded-lg h-40 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-8 w-8 text-brand-500 mx-auto mb-2" />
                        <p className="text-xs text-slate-400">Live Fleet Map</p>
                      </div>
                    </div>
                    
                    {/* Recent Loads */}
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-slate-800 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-brand-500/20 flex items-center justify-center">
                              <Truck className="h-4 w-4 text-brand-400" />
                            </div>
                            <div>
                              <p className="text-sm text-white">Load #{1000 + i}</p>
                              <p className="text-xs text-slate-400">Chicago → Dallas</p>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                            In Transit
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Load Delivered</p>
                  <p className="text-xs text-slate-500">2 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500 mb-8">
            Trusted by fleet managers and logistics companies worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-50">
            {["TransCo Logistics", "Swift Freight", "Atlas Trucking", "Prime Carriers", "Eagle Transport"].map((company) => (
              <div key={company} className="text-xl font-bold text-slate-400">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Run Your Fleet
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive tools designed for modern freight operations, from dispatch to delivery and everything in between.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="border-slate-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`h-12 w-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/login">
              <Button size="lg" className="bg-brand-600 hover:bg-brand-700 text-white">
                Explore All Features
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="py-20 lg:py-32 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Outcomes by Role
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              See how different teams benefit from Fretum-Freight
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {outcomes.map((outcome) => (
              <div key={outcome.role} className="bg-slate-800 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-white mb-6">{outcome.role}</h3>
                <div className="space-y-4">
                  {outcome.metrics.map((metric) => (
                    <div key={metric.label} className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-green-400">{metric.value}</span>
                      <span className="text-slate-400">{metric.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              How Fretum-Freight Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From initial setup to scaling your operations, we guide you every step of the way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-slate-200 -translate-x-1/2" />
                )}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 relative z-10">
                  <div className="text-4xl font-bold text-brand-600/20 mb-4">{step.step}</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 mb-4">{step.description}</p>
                  <ul className="space-y-2">
                    {step.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-20 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              For Every Fleet, No Matter the Job
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From small owner-operators to large enterprise fleets, Fretum-Freight adapts to your industry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry) => (
              <Card key={industry.title} className="border-slate-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4">
                    <industry.icon className="h-8 w-8 text-brand-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{industry.title}</h3>
                  <p className="text-sm text-slate-600">{industry.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Hear from Fleet Managers Like You
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Real results from real customers who transformed their operations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.author} className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <blockquote className="text-slate-700 mb-6">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{testimonial.author}</p>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                      <p className="text-sm text-slate-500">{testimonial.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">{testimonial.metric}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-400 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Fleet Operations?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of fleet managers who have streamlined their operations with Fretum-Freight. 
            Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-white text-brand-700 hover:bg-slate-100 px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Schedule Demo
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-white/60 text-sm">
            <span>✓ No credit card required</span>
            <span>✓ 14-day free trial</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 lg:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600">
              Get quick answers to common questions about Fretum-Freight
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-slate-900">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-slate-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Fretum-Freight</span>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Enterprise transportation management for modern logistics companies.
              </p>
              <p className="text-slate-500 text-xs">
                © 2026 Terrell A Lancaster. All rights reserved.
              </p>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="text-slate-400 hover:text-white">Features</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white">Pricing</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white">Integrations</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white">API</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-slate-400 hover:text-white">Documentation</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white">Blog</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white">Support</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-slate-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white">Terms of Service</Link></li>
                <li><Link href="#" className="text-slate-400 hover:text-white">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              Built with ❤️ for the freight industry
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-slate-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
              <Link href="https://github.com/tlancas25" className="text-slate-400 hover:text-white">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
