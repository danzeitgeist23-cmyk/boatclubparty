import { useEffect, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase, type PostRow } from '../../lib/supabase'
import { useSettings } from '../../hooks/useSettings'
import Nav from '../../components/home/Nav'
import Footer from '../../components/home/Footer'
import WhatsAppFloat from '../../components/home/WhatsAppFloat'
import ShareButtons from '../../components/ShareButtons'
import Img from '../../components/Img'
import { waLink } from '../../lib/whatsapp'
import { useT } from '../../i18n'

// Markdown ligero sin dependencias: ## títulos, **negrita**, párrafos
function renderContent(md: string): ReactNode[] {
  const bold = (s: string) =>
    s.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))
  return md.split(/\n{2,}/).map((block, i) => {
    const b = block.trim()
    if (!b) return null
    if (b.startsWith('## ')) return <h2 key={i} className="bebas" style={{ fontSize: '1.6rem', margin: '28px 0 10px' }}>{b.slice(3)}</h2>
    return <p key={i} className="text-muted-c" style={{ lineHeight: 1.75, margin: '0 0 16px' }}>{bold(b)}</p>
  })
}

export default function PostPage() {
  const { slug } = useParams()
  const settings = useSettings()
  const { t } = useT()
  const [post, setPost] = useState<PostRow | null | undefined>(undefined)

  useEffect(() => {
    if (!slug) return
    supabase.from('posts').select('*').eq('slug', slug).single()
      .then(({ data }) => setPost((data as PostRow) ?? null))
  }, [slug])

  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '36px 20px 70px' }}>
        <Link to="/blog" className="nav-link" style={{ fontSize: '.85rem' }}>{t('blog.back')}</Link>
        {post === undefined && <p className="text-muted-c" style={{ marginTop: 30 }}>{t('blog.loading')}</p>}
        {post === null && (
          <div style={{ marginTop: 30 }}>
            <h1 className="bebas" style={{ fontSize: '2rem' }}>{t('blog.notFound')}</h1>
            <Link className="btn-gold" to="/blog">{t('blog.backBtn')}</Link>
          </div>
        )}
        {post && (
          <article style={{ marginTop: 22 }}>
            <span style={{ color: 'var(--gold)', fontSize: '.72rem', letterSpacing: '.22em' }}>
              {post.category.toUpperCase()} · {post.created_at.slice(0, 10)}
            </span>
            <h1 className="bebas" style={{ fontSize: 'clamp(2.2rem, 6vw, 3.4rem)', margin: '10px 0 18px', lineHeight: 1 }}>{post.title}</h1>
            {post.cover_image && (
              <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
                <Img src={post.cover_image} alt={post.title} ratio="16/9" />
              </div>
            )}
            {post.content && renderContent(post.content)}

            {/* CTA de reserva al final de cada artículo */}
            <div className="blog-cta">
              <p className="bebas" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', margin: 0, letterSpacing: '.05em', color: '#0A0A0F' }}>
                {t('blog.ctaTitle')}
              </p>
              <p style={{ margin: '8px 0 18px', color: '#0A0A0F', opacity: .85, fontSize: '.95rem' }}>
                {t('blog.ctaText')}
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/" className="blog-cta-btn">{t('blog.ctaBook')}</Link>
                <a className="blog-cta-btn blog-cta-btn-outline" target="_blank" rel="noreferrer"
                  href={waLink(settings.whatsapp_number, `Hola! ${post.title} 🚤`)}>
                  {t('blog.ctaWa')}
                </a>
              </div>
            </div>

            <div style={{ marginTop: 30 }}>
              <ShareButtons title={`${post.title} · Boat Club Party`} />
            </div>
          </article>
        )}
      </main>
      <Footer />
      <WhatsAppFloat whatsapp={settings.whatsapp_number} />
    </div>
  )
}
