import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import articles from '../../data/articles.json';

interface ArticleFaq { q: string; a: string }
interface ArticleDef {
    slug: string;
    path: string;
    lang?: string;
    direction?: string;
    title: string;
    description: string;
    datePublished: string;
    hero: { src: string; alt: string };
    sections: Array<{ heading: string; paras: string[] }>;
    faqs: ArticleFaq[];
    related: Array<{ path: string; label: string }>;
}

const ArticlePage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const location = useLocation();
    // Arabic routes share the English slug; match the full path first so /ar/insights/:slug resolves the -ar article
    const article = (articles as ArticleDef[]).find(a => a.path === location.pathname)
        ?? (articles as ArticleDef[]).find(a => a.slug === slug);

    if (!article) {
        return (
            <AnimatedPage>
                <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 px-6 text-center">
                    <SEO title="Article not found" description="This guide does not exist." noindex />
                    <h1 className="text-3xl font-serif text-white mb-4">Article not found</h1>
                    <Link to="/insights" className="text-fann-gold underline">Back to guides</Link>
                </div>
            </AnimatedPage>
        );
    }

    const schema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Article',
                headline: article.title,
                description: article.description,
                datePublished: article.datePublished,
                dateModified: article.datePublished,
                author: { '@type': 'Organization', name: 'FANN', url: 'https://fann.ae/' },
                publisher: { '@type': 'Organization', name: 'FANN', url: 'https://fann.ae/', logo: { '@type': 'ImageObject', url: 'https://fann.ae/logo.png' } },
                mainEntityOfPage: `https://fann.ae${article.path}`,
                image: `https://fann.ae${article.hero.src}`
            },
            {
                '@type': 'FAQPage',
                mainEntity: article.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
            }
        ]
    };

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-fann-charcoal pt-28 pb-20">
                <SEO title={article.title} description={article.description} schema={schema} />
                <article className="max-w-3xl mx-auto px-6" dir={article.direction === 'rtl' ? 'rtl' : 'ltr'} lang={article.lang || 'en'}>
                    <Link to="/insights" className="inline-flex items-center gap-2 text-fann-gold text-sm mb-8 hover:underline"><ArrowLeft size={15} aria-hidden="true" /> All guides</Link>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-fann-gold mb-4 leading-tight">{article.title}</h1>
                    <p className="text-sm text-gray-400 mb-8">FANN guides · Updated {new Date(article.datePublished + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <img src={article.hero.src} alt={article.hero.alt} loading="eager" decoding="async" className="w-full rounded-lg mb-10" />
                    {article.sections.map(section => (
                        <section key={section.heading} className="mb-10">
                            <h2 className="text-2xl font-serif font-bold text-white mb-4">{section.heading}</h2>
                            {section.paras.map((para, i) => <p key={i} className="text-gray-300 leading-relaxed mb-4">{para}</p>)}
                        </section>
                    ))}
                    <section className="mb-10">
                        <h2 className="text-2xl font-serif font-bold text-white mb-4">Common questions</h2>
                        {article.faqs.map(f => (
                            <div key={f.q} className="mb-5">
                                <h3 className="text-lg font-bold text-fann-gold mb-2">{f.q}</h3>
                                <p className="text-gray-300 leading-relaxed">{f.a}</p>
                            </div>
                        ))}
                    </section>
                    <nav className="border-t border-white/10 pt-8" aria-label="Related">
                        <h2 className="text-xl font-serif font-bold text-white mb-4">Next steps</h2>
                        <div className="flex flex-col gap-3">
                            {article.related.map(r => (
                                <Link key={r.path} to={r.path} className="inline-flex items-center gap-2 text-fann-gold hover:underline">{r.label} <ArrowRight size={15} aria-hidden="true" /></Link>
                            ))}
                        </div>
                    </nav>
                </article>
            </div>
        </AnimatedPage>
    );
};

export default ArticlePage;
