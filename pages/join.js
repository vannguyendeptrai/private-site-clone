import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import Script from 'next/script'

export default function Join() {
    const router = useRouter()

    const { data: session, status } = useSession()

    const loading = status === 'loading'

    if(loading){
        return null
    }

    if(!session) {
        router.oush('/')
        return
    }

    if(session.user.isSubcriber){
        router.push('/members')
        return
    }

    return (
        <>
            <Script src='https://js.stripe.com/v3/' />
            <Head>
                <title>Private Area</title>
                <meta name='description' content='Private Area'/>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="text-center">
                <h1 className="mt-20 font-extrabold text-2xl"> Private Area</h1>
                <p className="mt-10">Join for just HUF 10</p>
                <button 
                 className="mt-10 bg-black text-white px-5 py-2"
                 onClick={async () => {
                    const res = await fetch('/api/stripe/session', {
                        method: 'POST',
                    })
                    const data = await res.json()

                    if(data.status === 'error') {
                        alert(data.message)
                        return
                    }

                    const sessionId = data.sessionId
                    const stripePublicKey = data.stripePublicKey

                    const stripe = Stripe(stripePublicKey)
                    stripe.redirectToCheckout({
                        sessionId,
                    })
                 }}>
                    Create a subscription
                </button>
            </div>
        </>
    )
}