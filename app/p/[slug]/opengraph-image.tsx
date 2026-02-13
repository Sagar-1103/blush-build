import { ImageResponse } from 'next/og';
import { getPageBySlug } from '@/app/create/actions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const contentType = 'image/png';

export async function generateImageMetadata({ params }: { params: { slug: string } }) {
    return [
        {
            id: 'og-image',
            alt: 'A special message for you',
            size: {
                width: 1200,
                height: 630,
            },
            contentType: 'image/png',
        },
    ];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    let crushName = 'Someone Special';
    let templateType = 'love';

    try {
        if (process.env.DATABASE_URL) {
            const page = await getPageBySlug(slug);
            if (page) {
                crushName = page.crushName;
                templateType = page.templateType;
            }
        }
    } catch (e) {
        console.error('OG Image Error:', e);
    }

    let bgGradient = 'linear-gradient(to bottom right, #ffe4e6, #fda4af)';
    let accentColor = '#e11d48';
    let emoji = '💕';

    if (templateType === 'valentine') {
        bgGradient = 'linear-gradient(to bottom right, #fae8ff, #f0abfc)';
        accentColor = '#c026d3';
        emoji = '💌';
    } else if (templateType === 'proposal') {
        bgGradient = 'linear-gradient(to bottom right, #fff1f2, #fecdd3)';
        accentColor = '#be123c';
        emoji = '💍';
    }

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: bgGradient,
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        padding: '40px 80px',
                        borderRadius: '40px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                        border: `6px solid ${accentColor}`,
                    }}
                >
                    <div style={{ fontSize: 100, marginBottom: 20 }}>{emoji}</div>
                    <div
                        style={{
                            fontSize: 70,
                            fontWeight: 800,
                            color: '#881337',
                            marginBottom: 10,
                            textAlign: 'center',
                            lineHeight: 1.1,
                        }}
                    >
                        Hey {crushName},
                    </div>
                    <div
                        style={{
                            fontSize: 40,
                            color: accentColor,
                            textAlign: 'center',
                            fontWeight: 600,
                        }}
                    >
                        Someone has a question for you...
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            marginTop: 40,
                            alignItems: 'center',
                        }}
                    >
                        <span style={{ fontSize: 30, color: '#4c0519', opacity: 0.6 }}>blush-build.xyz</span>
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
