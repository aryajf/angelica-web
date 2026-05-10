import { router, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Message { role: 'user' | 'mimi'; text: string }

const STORE_MSGS = 'mimi_messages';
const STORE_NAME = 'mimi_user_name';
const STORE_OPEN = 'mimi_open';
const STORE_MATH = 'mimi_math';

interface MathState { answer: number; active: boolean }

function loadMessages(): Message[] { try { return JSON.parse(localStorage.getItem(STORE_MSGS) || '[]'); } catch { return []; } }
function saveMessages(msgs: Message[]) { localStorage.setItem(STORE_MSGS, JSON.stringify(msgs.slice(-60))); }
function loadName(): string { return localStorage.getItem(STORE_NAME) || ''; }
function saveName(n: string) { localStorage.setItem(STORE_NAME, n); }
function loadMath(): MathState { try { return JSON.parse(localStorage.getItem(STORE_MATH) || '{"answer":0,"active":false}'); } catch { return { answer: 0, active: false }; } }
function saveMath(s: MathState) { localStorage.setItem(STORE_MATH, JSON.stringify(s)); }

function generateMathQuestion(): { question: string; answer: number } {
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a: number, b: number, answer: number;
    if (op === '+') { a = Math.floor(Math.random() * 50) + 1; b = Math.floor(Math.random() * 50) + 1; answer = a + b; }
    else if (op === '-') { a = Math.floor(Math.random() * 50) + 10; b = Math.floor(Math.random() * a); answer = a - b; }
    else { a = Math.floor(Math.random() * 12) + 1; b = Math.floor(Math.random() * 12) + 1; answer = a * b; }
    return { question: `${a} ${op} ${b} = ?`, answer };
}

// ─── Matching Helpers ────────────────────────────────────────────────────────
function has(q: string, words: string[]): boolean {
    return words.some(w => q.includes(w));
}

function levenshtein(a: string, b: string): number {
    const m = a.length, n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            dp[i][j] = Math.min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
    return dp[m][n];
}

function fuzzyNav(input: string, targets: string[]): string | null {
    const words = input.toLowerCase().split(/\s+/);
    for (const t of targets) { if (input.includes(t)) return t; }
    for (const t of targets) {
        for (const w of words) {
            if (w.length >= 4 && t.length >= 4 && levenshtein(w, t) <= 2) return t;
        }
    }
    return null;
}

// ─── Typewriter ──────────────────────────────────────────────────────────────
function useTypewriter(speed = 45) {
    const [displayed, setDisplayed] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const stop = useCallback(() => { if (timer.current) clearTimeout(timer.current); timer.current = null; setIsTyping(false); }, []);
    const type = useCallback((fullText: string) => {
        stop(); const words = fullText.split(' '); setDisplayed(''); setIsTyping(true);
        let idx = 0;
        const tick = () => { if (idx >= words.length) { setIsTyping(false); return; } setDisplayed(p => (p ? `${p} ${words[idx]}` : words[idx])); idx++; timer.current = setTimeout(tick, speed); };
        tick();
    }, [speed, stop]);
    useEffect(() => stop, [stop]);
    return { displayed, isTyping, type, stop };
}

// ─── Nav Map ─────────────────────────────────────────────────────────────────
const NAV_MAP: Record<string, { route: string; label: string }> = {
    dashboard: { route: 'admin.dashboard', label: 'admin.dashboard' },
    hero: { route: 'admin.hero.edit', label: 'admin.hero' },
    documentations: { route: 'admin.documentations.index', label: 'admin.documentations' },
    features: { route: 'admin.features.index', label: 'admin.features' },
    testimonials: { route: 'admin.testimonials.index', label: 'admin.testimonials' },
    profile: { route: 'admin.profile.edit', label: 'admin.profile' },
};

const NAV_ALIASES: Record<string, string> = {
    dasbor: 'dashboard', home: 'dashboard', beranda: 'dashboard',
    dokumentasi: 'documentations', docs: 'documentations', doc: 'documentations',
    testimoni: 'testimonials', testi: 'testimonials', testimony: 'testimonials',
    fitur: 'features', feature: 'features',
    profil: 'profile',
};

function findNavKey(input: string): string | null {
    const allKeys = [...Object.keys(NAV_MAP), ...Object.keys(NAV_ALIASES)];
    const match = fuzzyNav(input, allKeys);
    if (!match) return null;
    return NAV_ALIASES[match] || match;
}

// ─── API ─────────────────────────────────────────────────────────────────────
async function fetchStats() { const r = await fetch('/admin/mimi/stats'); return r.json(); }
async function fetchQuery(type: string, search = '') { const r = await fetch(`/admin/mimi/query?type=${type}&search=${encodeURIComponent(search)}`); return r.json(); }

// ─── Intent Resolver ─────────────────────────────────────────────────────────
type TFn = (k: string, opts?: Record<string, string>) => string;

async function resolveIntent(
    input: string, t: TFn, userName: string,
    setName: (n: string) => void,
    mathState: MathState, setMathState: (s: MathState) => void,
) {
    const q = input.toLowerCase().trim();
    const name = userName;

    // 0. Check if user is answering a math question
    if (mathState.active) {
        const numMatch = q.match(/^-?\d+$/);
        if (numMatch) {
            const userAnswer = parseInt(numMatch[0], 10);
            setMathState({ answer: 0, active: false });
            if (userAnswer === mathState.answer) {
                return { reply: t('mimi.mathCorrect', { name: name || 'kak', answer: String(mathState.answer) }) };
            } else {
                return { reply: t('mimi.mathWrong', { answer: String(mathState.answer) }) };
            }
        }
        // If not a number, deactivate math and continue normal processing
        setMathState({ answer: 0, active: false });
    }

    // 1. Name introduction
    const nameMatch = q.match(/(?:nama\s*(?:saya|aku|ku|gue?|gw)\s+(?:adalah\s+)?|(?:my\s+name\s+is|i'?m|call\s+me)\s+|panggil\s+(?:aku|saya)\s+)(\w[\w\s]{0,20})/i);
    if (nameMatch) {
        const n = nameMatch[1].trim().replace(/^(adalah|is)\s+/i, '');
        if (n.length > 0) { setName(n); return { reply: t('mimi.nameSet', { name: n }) }; }
    }

    // 2. Change name
    const changeMatch = q.match(/(?:ganti\s+nama|ubah\s+nama|change\s+name|rename)\s+(?:jadi|ke|to)\s+(\w[\w\s]{0,20})/i);
    if (changeMatch) { const n = changeMatch[1].trim(); setName(n); return { reply: t('mimi.nameChanged', { name: n }) }; }

    // 3. What's my name
    if (/nama\s*(saya|aku|ku|gue?|gw)\s*siapa|what.*my\s*name/.test(q))
        return { reply: name ? `Nama kamu ${name} dong~ 😊` : t('mimi.nameAsk') };

    // 4. Navigation — check BEFORE casual intents
    const navPrefixMatch = q.match(/(?:go\s*to|navigate|open|buka|ke\s+halaman|ke|pergi\s*ke|pindah\s*ke|arahkan\s*ke|menuju|tolong\s+buka|mau\s+ke)\s+(.+)/i);
    if (navPrefixMatch) {
        const key = findNavKey(navPrefixMatch[1].trim());
        if (key && NAV_MAP[key]) {
            const { route: r, label } = NAV_MAP[key];
            return { reply: t('mimi.navigating', { menu: t(label) }), action: () => router.visit(route(r)) };
        }
    }

    // 5. Quick create
    if (has(q, ['buat', 'create', 'tambah', 'add'])) {
        if (has(q, ['testimoni', 'testimonial'])) return { reply: t('mimi.quickCreate', { item: t('admin.testimonials') }), action: () => router.visit(route('admin.testimonials.index')) };
        if (has(q, ['dokumentasi', 'documentation', 'doc'])) return { reply: t('mimi.quickCreate', { item: t('admin.documentations') }), action: () => router.visit(route('admin.documentations.index')) };
        if (has(q, ['fitur', 'feature'])) return { reply: t('mimi.quickCreate', { item: t('admin.features') }), action: () => router.visit(route('admin.features.index')) };
    }

    // 6. Who are you
    if (/siapa\s*(kamu|lo|lu|elu)|who\s*are\s*you|kamu\s*siapa|kamu\s*itu\s*siapa/.test(q) || has(q, ['siapa kamu', 'kamu siapa']))
        return { reply: t('mimi.creator') };

    // 7. How are you
    if (/how are you|apa kabar|kabarmu|gimana kabar/.test(q) || has(q, ['kabar']))
        return { reply: t('mimi.howAreYou') };

    // 8. Greetings
    if (/^(hi|hello|hey|halo|hai|hei|p|woi|kak|yo)\b/.test(q))
        return { reply: name ? t('mimi.greetName', { name }) : t('mimi.greetReply') };

    // 9. Thanks
    if (has(q, ['makasih', 'terima kasih', 'thanks', 'thank you', 'thx', 'tq', 'nuhun']))
        return { reply: t('mimi.thanks', { name: name || 'kak' }) };

    // 10. Goodbye
    if (has(q, ['bye', 'dadah', 'sampai jumpa', 'goodbye', 'dah']))
        return { reply: t('mimi.goodbye', { name: name || 'kak' }) };

    // 11. Hobby
    if (has(q, ['hobi', 'hobby', 'hobbies', 'kesukaan mu', 'hobimu', 'hobi kamu', 'hobby kamu']))
        return { reply: t('mimi.hobby') };

    // 12. Age
    if (has(q, ['umur', 'usia', 'age', 'berapa tahun', 'umurmu', 'umur kamu', 'tahun kamu', 'tua']))
        return { reply: t('mimi.age') };

    // 12b. Address / where do you live
    if (has(q, ['tinggal', 'rumah', 'alamat', 'address', 'where do you live', 'dimana', 'di mana', 'rumahmu', 'tinggal dimana', 'live']))
        return { reply: t('mimi.address') };

    // 12c. Favorite color
    if (has(q, ['warna favorit', 'warna kesukaan', 'favorite color', 'warna kesukaan mu', 'warnamu']))
        return { reply: t('mimi.favColor') };

    // 12d. Favorite food
    if (has(q, ['makanan favorit', 'makanan kesukaan', 'favorite food', 'makanan kesukaan mu', 'suka makan']))
        return { reply: t('mimi.favFood') };

    // 12e. Birthday
    if (has(q, ['ulang tahun', 'birthday', 'ultah', 'lahir kapan', 'kapan lahir', 'tanggal lahir']))
        return { reply: t('mimi.birthday') };

    // 12f. Mood
    if (has(q, ['mood', 'perasaan', 'feel', 'feeling', 'lagi gimana', 'perasaanmu']))
        return { reply: t('mimi.mood') };

    // 12g. Dream
    if (has(q, ['impian', 'cita-cita', 'cita cita', 'dream', 'mimpi', 'harapan']))
        return { reply: t('mimi.dream') };

    // 12h. Compliments
    if (has(q, ['sayang', 'love you', 'cinta', 'i love', 'suka kamu', 'love u']))
        return { reply: t('mimi.love', { name: name || 'kak' }) };
    if (has(q, ['pinter', 'pintar', 'smart', 'clever', 'hebat', 'keren']))
        return { reply: t('mimi.smart') };
    if (has(q, ['cantik', 'cute', 'lucu kamu', 'imut', 'gemes', 'beautiful', 'pretty']))
        return { reply: t('mimi.cantik') };

    // 12i. Bored
    if (has(q, ['bosan', 'bosen', 'boring', 'bored', 'gabut', 'ga ada kerjaan']))
        return { reply: t('mimi.bored') };

    // 12j. Time-based greetings
    if (has(q, ['selamat pagi', 'good morning', 'pagi']))
        return { reply: t('mimi.morning', { name: name || 'kak' }) };
    if (has(q, ['selamat siang', 'good afternoon', 'siang']))
        return { reply: t('mimi.afternoon', { name: name || 'kak' }) };
    if (has(q, ['selamat malam', 'good evening', 'good night', 'malam']))
        return { reply: t('mimi.evening', { name: name || 'kak' }) };

    // 13. Joke
    if (has(q, ['joke', 'lelucon', 'lucu', 'humor', 'bercanda', 'jokes']))
        return { reply: t('mimi.joke') };

    // 13b. Math game
    if (has(q, ['main matematika', 'math game', 'play math', 'main math', 'main lagi', 'play again', 'main game', 'quiz', 'kuis', 'hitung'])) {
        const { question, answer } = generateMathQuestion();
        setMathState({ answer, active: true });
        return { reply: t('mimi.mathStart', { question }) };
    }

    // 14. Stats/counts
    if (has(q, ['berapa', 'jumlah', 'total', 'count', 'how many', 'statistik', 'stats', 'stat'])) {
        try {
            const s = await fetchStats();
            return { reply: t('mimi.statsResult', { docs: String(s.documentations), features: String(s.features), testimonials: String(s.testimonials) }) };
        } catch { return { reply: 'Waduh, gagal ambil data 😅 Coba lagi ya~' }; }
    }

    // 15. List/show data
    if (has(q, ['tampilkan', 'lihat', 'list', 'daftar', 'show', 'semua'])) {
        try {
            if (has(q, ['testimoni', 'testimonial', 'testi'])) {
                const d = await fetchQuery('testimonials');
                if (!d.testimonials?.length) return { reply: t('mimi.noData', { type: 'testimoni' }) };
                const list = d.testimonials.map((x: any, i: number) => `${i+1}. ${x.name} (${x.role}) — "${x.message}"`).join('\n');
                return { reply: t('mimi.listTestimonials', { list }) };
            }
            if (has(q, ['dokumentasi', 'documentation', 'doc'])) {
                const d = await fetchQuery('documentations');
                if (!d.documentations?.length) return { reply: t('mimi.noData', { type: 'dokumentasi' }) };
                const list = d.documentations.map((x: any, i: number) => `${i+1}. ${x.title}`).join('\n');
                return { reply: t('mimi.listDocs', { list }) };
            }
            if (has(q, ['fitur', 'feature', 'features'])) {
                const d = await fetchQuery('features');
                if (!d.features?.length) return { reply: t('mimi.noData', { type: 'fitur' }) };
                const list = d.features.map((x: any, i: number) => `${i+1}. ${x.title} — ${x.description}`).join('\n');
                return { reply: t('mimi.listFeatures', { list }) };
            }
            if (has(q, ['hero', 'profil', 'profile', 'info'])) {
                const d = await fetchQuery('hero');
                if (!d.hero) return { reply: 'Data hero belum ada.' };
                return { reply: t('mimi.heroInfo', { name: d.hero.name, profession: d.hero.profession, email: d.hero.email || '-' }) };
            }
        } catch { return { reply: 'Gagal ambil data 😅 Coba lagi ya~' }; }
    }

    // 16. Search
    if (has(q, ['cari', 'search', 'temukan', 'find'])) {
        const searchTerm = q.replace(/\b(cari|search|temukan|find|di|dalam|data|database)\b/gi, '').trim();
        if (searchTerm) {
            try {
                const d = await fetchQuery('all', searchTerm);
                const results: string[] = [];
                if (d.testimonials?.length) results.push(`Testimoni: ${d.testimonials.map((x:any) => x.name).join(', ')}`);
                if (d.documentations?.length) results.push(`Dokumentasi: ${d.documentations.map((x:any) => x.title).join(', ')}`);
                if (d.features?.length) results.push(`Fitur: ${d.features.map((x:any) => x.title).join(', ')}`);
                if (!results.length) return { reply: `Hmm, gak nemu "${searchTerm}" di database 🤔` };
                return { reply: `🔍 Hasil pencarian "${searchTerm}":\n${results.join('\n')}` };
            } catch { return { reply: 'Gagal cari data 😅' }; }
        }
    }

    // 17. Dashboard info
    if (has(q, ['dashboard', 'dasbor']))
        return { reply: t('mimi.dashboardInfo') };

    // 18. Help
    if (has(q, ['help', 'bantuan', 'bantu', 'tolong', 'bisa apa']))
        return { reply: t('mimi.help') };

    // 19. Direct nav match (single word like "testimonials")
    const directKey = findNavKey(q);
    if (directKey && NAV_MAP[directKey] && q.split(/\s+/).length <= 2) {
        const { route: r, label } = NAV_MAP[directKey];
        return { reply: t('mimi.navigating', { menu: t(label) }), action: () => router.visit(route(r)) };
    }

    // 20. Fallback
    return { reply: t('mimi.fallback') };
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function MimiAssistant() {
    const { t } = useTranslation();
    const { url } = usePage();
    const [open, setOpen] = useState(() => localStorage.getItem(STORE_OPEN) === 'true');
    const [messages, setMessages] = useState<Message[]>(loadMessages);
    const [input, setInput] = useState('');
    const [userName, setUserName] = useState(loadName);
    const [loading, setLoading] = useState(false);
    const [mathState, setMathStateRaw] = useState<MathState>(loadMath);
    const { displayed, isTyping, type } = useTypewriter(50);
    const bottomRef = useRef<HTMLDivElement>(null);
    const prevUrl = useRef(url);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { saveMessages(messages); }, [messages]);
    useEffect(() => { localStorage.setItem(STORE_OPEN, String(open)); }, [open]);

    const updateName = useCallback((n: string) => { setUserName(n); saveName(n); }, []);
    const updateMath = useCallback((s: MathState) => { setMathStateRaw(s); saveMath(s); }, []);

    // Follow-up on navigation
    useEffect(() => {
        if (prevUrl.current !== url && messages.length > 0) {
            const segment = url.split('/').filter(Boolean).pop() ?? '';
            const allKeys = [...Object.keys(NAV_MAP), ...Object.keys(NAV_ALIASES)];
            const navKey = allKeys.includes(segment) ? (NAV_ALIASES[segment] || segment) : null;
            if (navKey && NAV_MAP[navKey]) {
                const followUp = t('mimi.followUp', { menu: t(NAV_MAP[navKey].label) });
                setMessages(m => [...m, { role: 'mimi', text: followUp }]);
                type(followUp);
            }
        }
        prevUrl.current = url;
    }, [url]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [displayed, messages]);

    // Welcome on first open
    useEffect(() => {
        if (open && messages.length === 0) {
            const welcome = userName ? t('mimi.welcomeBack', { name: userName }) : t('mimi.welcome');
            setMessages([{ role: 'mimi', text: welcome }]);
            type(welcome);
        }
        if (open) inputRef.current?.focus();
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const send = useCallback(async (overrideInput?: string) => {
        const trimmed = (overrideInput ?? input).trim();
        if (!trimmed || loading) return;
        setInput('');
        setLoading(true);

        setMessages(m => [...m, { role: 'user', text: trimmed }]);

        try {
            const result = await resolveIntent(trimmed, t, userName, updateName, mathState, updateMath);
            setMessages(m => [...m, { role: 'mimi', text: result.reply }]);
            type(result.reply);
            if (result.action) setTimeout(result.action, 600);
        } catch {
            const err = 'Oops, ada error nih 😅 Coba lagi ya~';
            setMessages(m => [...m, { role: 'mimi', text: err }]);
            type(err);
        } finally {
            setLoading(false);
        }
    }, [input, loading, t, userName, updateName, type]);

    const clearChat = useCallback(() => {
        const welcome = userName ? t('mimi.welcomeBack', { name: userName }) : t('mimi.welcome');
        setMessages([{ role: 'mimi', text: welcome }]);
        type(welcome);
    }, [userName, t, type]);

    const avatar = isTyping || loading ? '/images/mimi-open.png' : '/images/mimi-closed.png';

    return (
        <>
            <button
                id="mimi-toggle"
                onClick={() => setOpen(true)}
                className={`fixed z-[60] transition-all duration-300 hover:scale-110 active:scale-95 ${
                    open ? 'pointer-events-none translate-y-10 scale-50 opacity-0' : 'translate-y-0 scale-100 opacity-100'
                } bottom-[52px] right-1 h-20 w-20 drop-shadow-[0_6px_15px_rgba(212,175,55,0.35)] md:bottom-6 md:right-6 md:h-36 md:w-36`}
                aria-label={t('mimi.toggle')}
            >
                <img src={avatar} alt="Mimi" className="h-full w-full object-contain" />
            </button>

            <div
                id="mimi-chat"
                className={`fixed z-[60] flex flex-col rounded-2xl md:rounded-3xl bg-white shadow-2xl ring-1 ring-gold-100 transition-all duration-300 origin-bottom-right ${
                    open ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-90 opacity-0'
                } bottom-[52px] left-2 right-2 max-h-[calc(100vh-60px)] md:bottom-8 md:left-auto md:right-8 md:w-[380px] md:max-h-[calc(100vh-80px)]`}
            >
                {/* Header */}
                <div className="relative flex items-center gap-2 rounded-t-2xl md:rounded-t-3xl bg-gradient-to-r from-gold-50 to-gold-100 px-3 py-3 md:px-5 md:py-4">
                    <div className="absolute -top-8 left-3 h-16 w-16 drop-shadow-lg md:-top-12 md:left-4 md:h-24 md:w-24 md:drop-shadow-xl">
                        <img src={avatar} alt="Mimi" className="h-full w-full object-contain transition-transform duration-200" />
                    </div>
                    <div className="ml-16 md:ml-24 flex-1">
                        <p className="font-display text-base md:text-lg font-bold text-gold-900">Mimi</p>
                        <p className="text-[10px] md:text-xs font-semibold text-gold-600/80">
                            {loading ? '🔍 mencari...' : isTyping ? t('mimi.typing') : t('mimi.online')}
                        </p>
                    </div>
                    <button onClick={clearChat} className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-gold-200/50 text-gold-700 transition hover:bg-gold-200 hover:text-gold-900 mr-0.5 text-xs md:text-sm" aria-label="Clear chat" title="Clear chat">🗑</button>
                    <button onClick={() => setOpen(false)} className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-gold-200/50 text-gold-700 transition hover:bg-gold-200 hover:text-gold-900 text-xs md:text-sm" aria-label={t('modal.close')}>✕</button>
                </div>

                {/* Messages */}
                <div className="flex max-h-[45vh] md:max-h-80 flex-1 flex-col gap-2 md:gap-3 overflow-y-auto bg-stone-50/50 px-3 py-3 md:px-5 md:py-4 text-xs md:text-sm scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gold-200">
                    {messages.map((m, i) => {
                        const isMimi = m.role === 'mimi';
                        const isLast = isMimi && i === messages.length - 1;
                        return (
                            <div key={i} className={`w-fit max-w-[85%] rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-2.5 leading-relaxed shadow-sm whitespace-pre-line ${
                                isMimi ? 'self-start rounded-tl-sm bg-white text-stone-700 ring-1 ring-stone-100' : 'self-end rounded-tr-sm bg-gold-500 text-white shadow-gold-200'
                            }`}>
                                {isLast && isTyping ? displayed : m.text}
                            </div>
                        );
                    })}
                    {loading && (
                        <div className="self-start rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 text-stone-400 ring-1 ring-stone-100 shadow-sm">
                            <span className="animate-pulse">⏳ Mikir bentar...</span>
                        </div>
                    )}
                    <div ref={bottomRef} className="h-1" />
                </div>

                {/* Quick Actions */}
                <div className="flex gap-1.5 md:gap-2 overflow-x-auto border-t border-stone-100 bg-white px-3 py-2 md:px-4 md:py-3 scrollbar-none">
                    {(['dashboard', 'documentations', 'testimonials'] as const).map((key) => (
                        <button key={key} onClick={() => send(`buka ${key}`)} className="flex-shrink-0 rounded-full border border-gold-200 bg-gold-50 px-2.5 py-1 md:px-3.5 md:py-1.5 text-[10px] md:text-xs font-semibold text-gold-700 transition hover:bg-gold-100 hover:text-gold-800">
                            {t(NAV_MAP[key].label)}
                        </button>
                    ))}
                    <button onClick={() => send('berapa jumlah data')} className="flex-shrink-0 rounded-full border border-gold-200 bg-gold-50 px-2.5 py-1 md:px-3.5 md:py-1.5 text-[10px] md:text-xs font-semibold text-gold-700 transition hover:bg-gold-100 hover:text-gold-800">
                        📊 Stats
                    </button>
                    <button onClick={() => send('play math game')} className="flex-shrink-0 rounded-full border border-gold-200 bg-gold-50 px-2.5 py-1 md:px-3.5 md:py-1.5 text-[10px] md:text-xs font-semibold text-gold-700 transition hover:bg-gold-100 hover:text-gold-800">
                        🎮 Game
                    </button>
                </div>

                {/* Input */}
                <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-center gap-1.5 md:gap-2 rounded-b-2xl md:rounded-b-3xl border-t border-stone-100 bg-white px-3 py-2 md:px-4 md:py-3">
                    <input ref={inputRef} id="mimi-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('mimi.placeholder')} disabled={loading}
                        className="flex-1 rounded-full border border-stone-200 bg-stone-50 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-gold-300 focus:bg-white focus:ring-4 focus:ring-gold-100 disabled:opacity-50" />
                    <button type="submit" disabled={!input.trim() || loading} className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full bg-gold-500 text-white shadow-md shadow-gold-200 transition hover:bg-gold-600 disabled:opacity-50 disabled:shadow-none">
                        <svg className="ml-0.5 h-3.5 w-3.5 md:h-4 md:w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 22v-20l18 10-18 10z" /></svg>
                    </button>
                </form>
            </div>
        </>
    );
}
