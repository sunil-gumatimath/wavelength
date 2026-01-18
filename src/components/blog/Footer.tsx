import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, ArrowUp, Code2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const socialLinks = [
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'https://github.com', icon: Github, label: 'GitHub' },
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
];

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
];

const categories = [
  { name: 'React', slug: 'react' },
  { name: 'TypeScript', slug: 'typescript' },
  { name: 'Web Dev', slug: 'web-development' },
  { name: 'Design', slug: 'design' },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t bg-gradient-to-b from-background to-muted/40">
      <div className="container mx-auto px-4 py-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <img
                src="/logo.svg"
                alt="Wavelength Logo"
                className="h-8 w-8 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Wavelength
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              A personal blog about web development, design patterns, and building
              modern applications with React and TypeScript.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-1.5 pt-2">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg text-muted-foreground hover:text-primary 
                    hover:bg-primary/10 transition-all duration-200"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <nav className="flex flex-col gap-2.5">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm text-muted-foreground hover:text-primary 
                    transition-colors w-fit hover:translate-x-1 duration-200"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Topics</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(({ name, slug }) => (
                <Link
                  key={slug}
                  to={`/blog?category=${slug}`}
                  className="px-3 py-1.5 text-xs font-medium rounded-full 
                    bg-muted hover:bg-primary/10 hover:text-primary 
                    text-muted-foreground transition-all duration-200"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Wavelength</p>
            <span className="hidden sm:inline text-border">•</span>
            <p className="flex items-center gap-1.5">
              <Code2 className="h-3.5 w-3.5" />
              Built with React & TypeScript
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToTop}
            className="gap-1.5 h-8 text-muted-foreground hover:text-primary group"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
