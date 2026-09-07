import { useEffect, useRef } from 'react'

import SkyDecorations from '@components/layout/SkyDecorations'

interface AuthBackgroundProps {
    /**
     * `fixed` (padrão) — cobre a viewport inteira, usado nas telas de auth.
     * `contained` — fica absoluto dentro do container pai (usado no hero da landing,
     * onde as seções brancas abaixo não devem cobrir as ondas). Nessa variante a
     * faixa azul é mais alta e as ondas ficam mais próximas da base.
     */
    variant?: 'fixed' | 'contained'
    /** Sol estático na faixa azul — usado só no hero da landing */
    sun?: boolean
}

const AuthBackground = ({ variant = 'fixed', sun = false }: AuthBackgroundProps) => {
    const w1Ref = useRef<HTMLDivElement>(null)
    const w2Ref = useRef<HTMLDivElement>(null)
    const w3Ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY
            const pageH = document.documentElement.scrollHeight - window.innerHeight
            if (pageH <= 0) return
            const pct = scrollY / pageH
            // O SVG escala com a largura da tela; o deslocamento precisa acompanhar,
            // senão no mobile ele move mais que a própria altura da onda e as separa.
            const scale = Math.min(1, window.innerWidth / 1280)
            if (w1Ref.current) w1Ref.current.style.transform = `translateY(${pct * -40 * scale}px)`
            if (w2Ref.current) w2Ref.current.style.transform = `translateY(${pct * -24 * scale}px)`
            if (w3Ref.current) w3Ref.current.style.transform = `translateY(${pct * -10 * scale}px)`
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const isContained = variant === 'contained'
    const positionClass = isContained ? 'absolute inset-0 z-0' : 'fixed inset-0 -z-10'

    return (
        <div className={`${positionClass} overflow-hidden`} aria-hidden="true">
            <div
                className="absolute inset-0"
                style={{
                    // Na variante `contained` a faixa é azul inteira: quem faz a
                    // transição para o branco é a própria onda da frente, que
                    // preenche até a base. Um corte fixo em % brigava com a altura
                    // do hero (bem maior no mobile) e a onda "descolava" do fundo.
                    background: isContained
                        ? '#F5F9FC'
                        : 'linear-gradient(to bottom, #F5F9FC 65%, #ffffff 35%)',
                }}
            />

            {/* Nuvens (e o sol, na landing) sobre a faixa azul */}
            <SkyDecorations sun={sun} />

            <div
                className="absolute pointer-events-none"
                style={{ bottom: isContained ? '0' : '25%', left: '-5%', width: '110%', height: '260px' }}
            >
                {/* Wave back */}
                <div ref={w1Ref} className="absolute bottom-[15px] sm:bottom-[32px] lg:bottom-[60px]" style={{ left: 0, right: 0 }}>
                    <div className="wave-auth-1">
                        <svg viewBox="0 0 1440 260" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0,130 C180,210 360,50 540,130 C720,210 900,40 1080,120 C1260,200 1380,80 1440,130 L1440,260 L0,260 Z" fill="#A7DAEB" fillOpacity="0.3" />
                        </svg>
                    </div>
                </div>

                {/* Wave mid */}
                <div ref={w2Ref} className="absolute bottom-[8px] sm:bottom-[16px] lg:bottom-[30px]" style={{ left: 0, right: 0 }}>
                    <div className="wave-auth-2">
                        <svg viewBox="0 0 1440 260" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0,160 C200,80 400,210 600,155 C800,100 1000,210 1200,150 C1320,115 1390,170 1440,160 L1440,260 L0,260 Z" fill="#E8F7FF" fillOpacity="0.75" />
                        </svg>
                    </div>
                </div>

                {/* Wave front */}
                <div ref={w3Ref} className="absolute" style={{ bottom: '0', left: 0, right: 0 }}>
                    <svg viewBox="0 0 1440 260" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,200 C120,155 280,230 480,195 C660,162 820,230 1020,198 C1180,172 1320,215 1440,200 L1440,260 L0,260 Z" fill="#ffffff" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default AuthBackground
