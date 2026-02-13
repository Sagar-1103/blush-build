import Link from "next/link";
import { getPages } from "@/app/create/actions";

import {
    Heart,
    Plus,
    Eye,
    Calendar,
    Sparkles,
    TrendingUp,
    ExternalLink,
    Pencil,
} from "lucide-react";
import { PageActionsMenu, AutoOpenShare, ShareAppButton } from "@/components/client-actions";

export const dynamic = "force-dynamic";

// Template configurations for better visual distinction
const TEMPLATE_CONFIG: Record<
    string,
    {
        emoji: string;
        label: string;
        gradient: string;
        textColor: string;
        iconColor: string;
        accentColor: string;
    }
> = {
    confession: {
        emoji: "💖",
        label: "Confession",
        gradient: "from-rose-50 to-pink-50 border-rose-100",
        textColor: "text-rose-900",
        iconColor: "text-rose-400",
        accentColor: "bg-rose-100 text-rose-600",
    },
    valentine: {
        emoji: "💌",
        label: "Valentine",
        gradient: "from-red-50 to-rose-50 border-red-100",
        textColor: "text-red-900",
        iconColor: "text-red-400",
        accentColor: "bg-red-100 text-red-600",
    },

    proposal: {
        emoji: "💍",
        label: "Proposal",
        gradient: "from-purple-50 to-indigo-50 border-purple-100",
        textColor: "text-purple-900",
        iconColor: "text-purple-400",
        accentColor: "bg-purple-100 text-purple-600",
    },

};

const DEFAULT_CONFIG = TEMPLATE_CONFIG.confession;

export default async function DashboardPage(props: { searchParams: Promise<{ created?: string }> }) {
    const searchParams = await props.searchParams;
    const { created } = searchParams;
    const pages = await getPages();

    const createdPage = created ? pages.find((p) => p.slug === created) : null;

    // Calculate aggregated stats
    const totalViews = pages.reduce((sum, page) => sum + (page.viewCount || 0), 0);
    const totalPages = pages.length;

    return (
        <div className="min-h-screen bg-[#fff0f3] relative font-sans">


            {/* Auto Open Share Modal */}
            {createdPage && (
                <div className="fixed inset-0 z-50 pointer-events-none">
                    <div className="pointer-events-auto">
                        <AutoOpenShare slug={createdPage.slug} crushName={createdPage.crushName} />
                    </div>
                </div>
            )}

            {/* Top Navigation */}
            <nav className="relative z-50 bg-white/70 backdrop-blur-md border-b border-rose-100/50 sticky top-0">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-rose-100 p-2 rounded-xl group-hover:bg-rose-200 transition-colors">
                            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                        </div>
                        <span className="font-display font-bold text-rose-900 text-xl tracking-tight">
                            BlushBuild
                        </span>
                    </Link>
                    <ShareAppButton />
                    <Link
                        href="/create"
                        className="hidden sm:flex items-center gap-2 text-sm bg-rose-500 text-white px-5 py-2.5 rounded-lg hover:bg-rose-600 transition-all hover:shadow-lg hover:shadow-rose-200/50 font-medium active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> Create New
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 pb-20">
                {/* Header Section */}
                <header className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-4xl font-display font-bold text-rose-950 mb-3">
                                Welcome back! 👋
                            </h1>
                            <p className="text-rose-600/80 text-lg">
                                Here&apos;s how your creations are doing.
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    {pages.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-100 shadow-md shadow-rose-200/40 flex items-center gap-3 sm:gap-4 transition-all hover:shadow-lg hover:shadow-rose-200/60 hover:-translate-y-0.5">
                                <div className="p-2 sm:p-3 bg-rose-50 rounded-xl text-rose-500 border border-rose-100 shrink-0">
                                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="min-w-0">
                                    <span className="text-xs sm:text-sm font-bold text-rose-900/60 block mb-0.5 sm:mb-1 uppercase tracking-wide">Total Pages</span>
                                    <p className="text-2xl sm:text-3xl font-display font-bold text-rose-900 leading-none truncate">{totalPages}</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-100 shadow-md shadow-rose-200/40 flex items-center gap-3 sm:gap-4 transition-all hover:shadow-lg hover:shadow-rose-200/60 hover:-translate-y-0.5">
                                <div className="p-2 sm:p-3 bg-rose-50 rounded-xl text-rose-500 border border-rose-100 shrink-0">
                                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="min-w-0">
                                    <span className="text-xs sm:text-sm font-bold text-rose-900/60 block mb-0.5 sm:mb-1 uppercase tracking-wide">Total Views</span>
                                    <p className="text-2xl sm:text-3xl font-display font-bold text-rose-900 leading-none truncate">{totalViews}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                {/* Content Grid */}
                {pages.length === 0 ? (
                    /* Empty State */
                    <div className="glass-card rounded-3xl p-16 text-center max-w-xl mx-auto border-2 border-dashed border-rose-200 bg-white shadow-xl shadow-rose-100/50">
                        <div className="text-7xl mb-6 animate-bounce-gentle">💌</div>
                        <h3 className="text-2xl font-bold text-rose-900 mb-3">No pages created yet</h3>
                        <p className="text-rose-600/70 mb-8 text-lg leading-relaxed">
                            Ready to make someone&apos;s day special? <br />
                            Create your first Blush page in seconds.
                        </p>
                        <Link
                            href="/create"
                            className="inline-flex items-center gap-2 bg-rose-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-rose-600 transition-all shadow-xl shadow-rose-200 hover:-translate-y-1"
                        >
                            <Plus className="w-5 h-5" /> Create Your First Page
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* New Page CTA Card */}
                        <Link
                            href="/create"
                            className="min-h-[280px] rounded-3xl border-2 border-dashed border-rose-200 hover:border-rose-400 bg-white hover:bg-rose-50/50 transition-all flex flex-col items-center justify-center text-center group cursor-pointer relative overflow-hidden shadow-sm hover:shadow-md"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-rose-100/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-16 h-16 rounded-2xl bg-rose-50 shadow-inner flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 z-10 border border-rose-100">
                                <Plus className="w-8 h-8 text-rose-500" />
                            </div>
                            <span className="font-bold text-rose-900 text-lg z-10">Create New Page</span>
                            <p className="text-sm text-rose-500/70 mt-2 max-w-[200px] z-10 px-4 font-medium">
                                Craft a new beautiful page for someone special
                            </p>
                        </Link>

                        {/* Page Cards */}
                        {pages.map((page) => {
                            const config = TEMPLATE_CONFIG[page.templateType] || DEFAULT_CONFIG;
                            return (
                                <div
                                    key={page.id}
                                    className={`group relative bg-white rounded-3xl border border-rose-100/60 shadow-lg shadow-rose-200/40 transition-all hover:shadow-xl hover:shadow-rose-300/30 flex flex-col overflow-hidden ring-1 ring-black/5`}
                                >
                                    {/* Card Header: Type Badge */}
                                    <div className="p-6 pb-2 flex items-start justify-between">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${config.accentColor}`}>
                                            <span>{config.emoji}</span>
                                            <span>{config.label}</span>
                                        </div>

                                        {/* Actions Row (visible on hover/mobile) */}
                                        <div className="flex items-center gap-1">
                                            <PageActionsMenu pageId={page.id} slug={page.slug} crushName={page.crushName} />
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="px-6 py-2 flex-1">
                                        <h3 className={`text-2xl font-bold mb-2 truncate ${config.textColor}`}>
                                            For {page.crushName}
                                        </h3>
                                        <div className="relative">
                                            <p className={`text-sm leading-relaxed line-clamp-3 min-h-[60px] ${config.iconColor} font-medium`}>
                                                &quot;{page.mainMessage}&quot;
                                            </p>
                                        </div>
                                    </div>

                                    {/* Card Footer: Metadata */}
                                    <div className="px-6 py-5 mt-2 border-t border-black/5 flex items-center justify-between text-xs font-semibold bg-white/40 backdrop-blur-sm">
                                        <div className="flex items-center gap-4">
                                            <div className={`flex items-center gap-1.5 ${config.textColor} opacity-70`}>
                                                <Eye className="w-4 h-4" />
                                                <span>{page.viewCount || 0}</span>
                                            </div>
                                            <div className={`flex items-center gap-1.5 ${config.textColor} opacity-70`}>
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(page.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/p/${page.slug}`}
                                            target="_blank"
                                            className="flex items-center gap-1 text-rose-600 hover:text-rose-800 transition-colors hover:underline decoration-rose-300 decoration-2 underline-offset-2"
                                        >
                                            View Page <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
