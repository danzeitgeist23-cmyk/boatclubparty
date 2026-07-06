import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, type PostRow } from '../../lib/supabase'
import { useSettings } from '../../hooks/useSettings'
import Nav from '../../components/home/Nav'
import Footer from '../../components/home/Footer'
import WhatsAppFloat from '../../components/home/WhatsAppFloat'
import Img from '../../components/Img'
import { useT } from '../../i18n'

// Estructura espejo de boatclubparty.com/blog.html
const CATEGORIES = [
  { key: 'todos', tKey: 'blog.all' },
  { key: 'destino', tKey: 'blog.dest' },
  { key: 'musica', tKey: 'blog.mus' },
  { key: 'guias', tKey: 'blog.guide' },
] as const

export default function BlogPage() {
  const [posts, setPosts] = useState<PostRow[] | null>(null)
  const [cat, setCat] = useState<string>('todos')
  const settings = useSettings()
  const { t } = useT()

  useEffect(() => {
    supabase.from('posts').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setPosts((data as PostRow[]) ?? []))
  }, [])

  const visible = (posts ?? []).filter(p => cat === 'todos' || p.category === cat)

  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 20px 70px' }}>
        <p style={{ color: 'var(--gold)', letterSpacing: '.25em', fontSize: '.78rem', margin: 0 }}>{t('blog.kicker')}</p>
        <h1 className="bebas" style={{ fontSize: 'clamp(2.6rem, 8vw, 4.5rem)', margin: '10px 0 8px', lineHeight: .95 }}>{t('blog.title')}</h1>
        <p className="text-muted-c" style={{ maxWidth: 520, margin: '0 0 30px' }}>
          {t('blog.sub')}
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 34 }}>
          {CATEGORIES.map(c => (
            <button key={c.key} onClick={() => setCat(c.key)}
              className={c.key === cat ? 'chip chip-active' : 'chip'}>
              {t(c.tKey)}
            </button>
          ))}
        </div>

        {posts === null ? (
          <p className="text-muted-c">{t('blog.loading')}</p>
        ) : visible.length === 0 ? (
          <div className="event-card" style={{ padding: 32, cursor: 'default', maxWidth: 520 }}>
            <p className="bebas" style={{ fontSize: '1.3rem', margin: '0 0 6px' }}>{t('blog.empty')}</p>
            <p className="text-muted-c" style={{ margin: 0, fontSize: '.9rem' }}>
              {t('blog.emptySub')}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {visible.map(p => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="event-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Img src={p.cover_image} alt={p.title} ratio="16/10" />
                <div style={{ padding: '16px 18px 20px' }}>
                  <span style={{ color: 'var(--gold)', fontSize: '.7rem', letterSpacing: '.2em' }}>
                    {t(CATEGORIES.find(c => c.key === p.category)?.tKey ?? 'blog.all').toUpperCase()}
                  </span>
                  <h2 className="bebas" style={{ fontSize: '1.4rem', margin: '6px 0' }}>{p.title}</h2>
                  {p.excerpt && <p className="text-muted-c" style={{ margin: 0, fontSize: '.88rem', lineHeight: 1.55 }}>{p.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppFloat whatsapp={settings.whatsapp_number} />
    </div>
  )
}
