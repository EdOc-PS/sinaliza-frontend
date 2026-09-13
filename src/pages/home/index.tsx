
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/config/query/queryKeys'
import { unwrap } from '@/config/query/unwrap'
import { GetRequest } from '@requests'
import { GLOSSARY } from '@routes/signs'
import useScrollReveal from '@lib/hooks/useScrollReveal'
import type { SignCardData } from '@components/feature/classroom-detail/SignCard'

import LandingHeader from '@components/feature/landing/LandingHeader'
import LandingHero from '@components/feature/landing/LandingHero'
import LandingAudience from '@components/feature/landing/LandingAudience'
import LandingRepositoryPreview from '@components/feature/landing/LandingRepositoryPreview'
import LandingHowItWorks from '@components/feature/landing/LandingHowItWorks'
import LandingFeatures from '@components/feature/landing/LandingFeatures'
import LandingAbout from '@components/feature/landing/LandingAbout'
import LandingFooter from '@components/feature/landing/LandingFooter'

function Home() {
    useScrollReveal()

    // Endpoint público — a landing não exige login. Compartilha a chave com o
    // repositório público: ir da landing para /public-glossary não refaz o fetch.
    const { data: signs = [] } = useQuery({
        queryKey: queryKeys.glossary.list({}),
        queryFn: () => unwrap(GetRequest<SignCardData[]>(GLOSSARY.LIST())),
        meta: { errorMessage: 'Falha ao carregar sinais' },
    })

    return (
        <div className="min-h-screen bg-white">
            {/* Header em bg-cloud-100 emenda sem costura com o topo do hero */}
            <LandingHeader showAnchors background="bg-cloud-100" />

            <main>
                <LandingHero />
                <LandingAudience />
                <LandingRepositoryPreview signs={signs} total={signs.length} />
                <LandingHowItWorks />
                <LandingFeatures />
                <LandingAbout />
            </main>

            <LandingFooter />
        </div>
    )
}

export default Home
