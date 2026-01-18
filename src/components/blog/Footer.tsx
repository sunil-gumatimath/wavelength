import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Rss,
  ArrowUp,
  Send,
  Heart,
  Sparkles
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const socialLinks = [
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter', color: 'hover:bg-sky-500' },
  { href: 'https://github.com', icon: Github, label: 'GitHub', color: 'hover:bg-slate-700' },
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn', color: 'hover:bg-blue-600' },
  { href: 'mailto:hello@wavelength.dev', icon: Mail, label: 'Email', color: 'hover:bg-rose-500' },
];

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
];

const categories = [
  { name: 'Web Development', slug: 'web-development' },
  { name: 'React', slug: 'react' },
  { name: 'TypeScript', slug: 'typescript' },
  { name: 'Design', slug: 'design' },
  { name: 'Tutorials', slug: 'tutorials' },
];

const internalLinks = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
];

const externalLinks = [
  { label: 'RSS Feed', href: '/rss.xml', icon: Rss },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubscribed(true);
    setIsLoading(false);
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t bg-gradient-to-b from-muted/30 to-muted/60 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <img
                src="/logo.svg"
                alt="Wavelength Logo"
                className="h-9 w-9 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Wavelength
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Personal blog exploring the art and science of modern web development.
              Sharing insights, tutorials, and thoughts on building better digital experiences.
            </p>

            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map(({ href, icon: Icon, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl bg-background/80 border border-border/50 
                    hover:border-transparent hover:text-white transition-all duration-300 
                    hover:scale-110 hover:shadow-lg ${color}`}
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors 
                      duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
              {internalLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors 
                      duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
              {externalLinks.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors 
                      duration-200 inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-200" />
                    {label}
                    {Icon && <Icon className="h-3 w-3 text-orange-500" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Categories
            </h3>
            <ul className="space-y-3">
              {categories.map(({ name, slug }) => (
                <li key={slug}>
                  <Link
                    to={`/blog?category=${slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors 
                      duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-200" />
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Stay Updated
            </h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Subscribe to get the latest posts delivered straight to your inbox.
              No spam, unsubscribe anytime.
            </p>

            {isSubscribed ? (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-sm text-primary font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Thanks for subscribing!
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  You'll receive updates on new posts.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pr-12 bg-background/80 border-border/50 focus:border-primary/50
                      placeholder:text-muted-foreground/50"
                    required
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isLoading}
                    className="absolute right-1 top-1 h-7 w-7 p-0 rounded-md"
                  >
                    <Send className={`h-3.5 w-3.5 ${isLoading ? 'animate-pulse' : ''}`} />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground/70">
                  By subscribing, you agree to our privacy policy.
                </p>
              </form>
            )}
          </div>
        </div>

        <Separator className="my-10 bg-border/50" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap justify-center">
            <span>&copy; {new Date().getFullYear()} Wavelength.</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 animate-pulse" />
              using React & TypeScript
            </span>
          </p>

          {/* Back to top button */}
          <Button
            variant="outline"
            size="sm"
            onClick={scrollToTop}
            className="group gap-2 bg-background/80 hover:bg-primary hover:text-primary-foreground 
              hover:border-primary transition-all duration-300"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
