import { useEffect, useState } from 'react'

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
import LandingCTA from '@components/feature/landing/LandingCTA'
import LandingFooter from '@components/feature/landing/LandingFooter'

function Home() {
    useScrollReveal()

    const [signs, setSigns] = useState<SignCardData[]>([])

    // Endpoint público — a landing não exige login
    const loadPublicSigns = async () => {
        const res = await GetRequest<SignCardData[]>(GLOSSARY.LIST())
        if (res.success && res.object) setSigns(res.object)
    }

    useEffect(() => {
        loadPublicSigns()
    }, [])

    const categoryCount = new Set(signs.map((s) => s.category?.value).filter(Boolean)).size

    return (
        <div className="min-h-screen bg-white">
            <LandingHeader showAnchors />

            <main>
                <LandingHero signCount={signs.length} categoryCount={categoryCount} />
                <LandingAudience />
                <LandingRepositoryPreview signs={signs} total={signs.length} />
                <LandingHowItWorks />
                <LandingFeatures />
                <LandingAbout />
                <LandingCTA />
            </main>

            <LandingFooter />
        </div>
    )
}

export default Home
