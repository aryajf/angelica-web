<?php

namespace Database\Seeders;

use App\Models\Documentation;
use App\Models\Feature;
use App\Models\Hero;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@angelica.test'],
            [
                'name' => 'admin',
                'password' => Hash::make('admin'),
                'email_verified_at' => now(),
            ],
        );

        Hero::query()->updateOrCreate(
            ['id' => 1],
            [
                'name' => ['en' => 'Angelica', 'id' => 'Angelica'],
                'profession' => [
                    'en' => 'Customer Service Officer & Brand Designer',
                    'id' => 'Petugas Pelayanan Pelanggan & Desainer Brand',
                ],
                'description' => [
                    'en' => 'Hi! I craft warm, golden visual stories that make small brands shine — from cozy cafés to playful start-ups.',
                    'id' => 'Halo! Aku merangkai cerita visual hangat bernuansa emas untuk membantu brand kecil bersinar — dari kafe nyaman sampai startup ceria.',
                ],
                'email' => 'hello@angelica.test',
                'instagram_url' => 'https://instagram.com/angelica',
                'avatar_url' => null,
                'cv_url' => null,
                'seo_title_en' => 'Angelica · Customer Service Officer',
                'seo_title_id' => 'Angelica · Petugas Pelayanan Pelanggan',
                'seo_description_en' => 'Personal portfolio of Angelica — bilingual brand storytelling, photography and design.',
                'seo_description_id' => 'Portofolio personal Angelica — penceritaan brand dwibahasa, fotografi, dan desain.',
            ],
        );

        if (Documentation::query()->count() === 0) {
            $samples = [
                [
                    'image_url' => 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=900&q=70',
                    'title' => ['en' => 'Sunlit Coffee Brand', 'id' => 'Brand Kopi Bermandi Cahaya'],
                    'description' => [
                        'en' => 'A photo set for a neighbourhood roastery, warmth-first.',
                        'id' => 'Sesi foto untuk roastery lokal, hangat dan jujur.',
                    ],
                    'started_at' => '2024-03-01',
                    'ended_at' => '2024-08-01',
                ],
                [
                    'image_url' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=70',
                    'title' => ['en' => 'Soft Fashion Lookbook', 'id' => 'Lookbook Fashion Lembut'],
                    'description' => [
                        'en' => 'Editorial styling that feels like a quiet morning.',
                        'id' => 'Penataan editorial yang terasa seperti pagi yang tenang.',
                    ],
                    'started_at' => '2024-09-01',
                    'ended_at' => '2025-02-01',
                ],
                [
                    'image_url' => 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=900&q=70',
                    'title' => ['en' => 'Wedding Day Diary', 'id' => 'Catatan Hari Pernikahan'],
                    'description' => [
                        'en' => 'Documentary film & photography for a golden afternoon.',
                        'id' => 'Film dokumenter & fotografi untuk sore keemasan.',
                    ],
                    'started_at' => '2025-05-01',
                    'ended_at' => '2025-06-01',
                ],
                [
                    'image_url' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=70',
                    'title' => ['en' => 'Boutique Identity', 'id' => 'Identitas Butik'],
                    'description' => [
                        'en' => 'Logo, packaging and tone for a slow-fashion label.',
                        'id' => 'Logo, kemasan, dan tone untuk label slow fashion.',
                    ],
                    'started_at' => '2025-11-01',
                    'ended_at' => null,
                ],
            ];
            foreach ($samples as $i => $sample) {
                Documentation::query()->create($sample + ['order' => $i]);
            }
        }

        if (Feature::query()->count() === 0) {
            $samples = [
                [
                    'icon' => 'Sparkle',
                    'title' => ['en' => 'Warm Visual Voice', 'id' => 'Suara Visual yang Hangat'],
                    'description' => [
                        'en' => 'Every frame is curated to feel kind, golden and human.',
                        'id' => 'Setiap frame dikurasi agar terasa hangat, emas, dan manusiawi.',
                    ],
                ],
                [
                    'icon' => 'PaintBrush',
                    'title' => ['en' => 'Bilingual Storytelling', 'id' => 'Cerita Dwibahasa'],
                    'description' => [
                        'en' => 'I write copy that breathes naturally in both EN & ID.',
                        'id' => 'Aku menulis copy yang mengalir alami di EN & ID.',
                    ],
                ],
                [
                    'icon' => 'HeartStraight',
                    'title' => ['en' => 'Tiny Details, Big Care', 'id' => 'Detail Kecil, Perhatian Besar'],
                    'description' => [
                        'en' => 'Layouts, kerning and timing — I sweat the soft stuff.',
                        'id' => 'Tata letak, kerning, dan timing — aku peduli hal-hal kecil.',
                    ],
                ],
            ];
            foreach ($samples as $i => $sample) {
                Feature::query()->create($sample + ['order' => $i]);
            }
        }

        if (Testimonial::query()->count() === 0) {
            $samples = [
                [
                    'client_name' => 'Maya R.',
                    'client_role' => 'Founder · Pagi Coffee',
                    'message' => [
                        'en' => 'Angelica understood our brand voice on day one. Pure magic.',
                        'id' => 'Angelica langsung paham suara brand kami sejak hari pertama. Ajaib.',
                    ],
                ],
                [
                    'client_name' => 'Rendy P.',
                    'client_role' => 'Creative Lead · Halo Studio',
                    'message' => [
                        'en' => 'Calm, fast, and incredibly thoughtful. A dream collaborator.',
                        'id' => 'Tenang, cepat, dan sangat penuh perhatian. Kolaborator impian.',
                    ],
                ],
                [
                    'client_name' => 'Sasha L.',
                    'client_role' => 'Bride · Golden Hour Wedding',
                    'message' => [
                        'en' => 'She turned the most precious day into a soft, golden film.',
                        'id' => 'Dia mengubah hari paling berharga jadi film lembut keemasan.',
                    ],
                ],
                [
                    'client_name' => 'Daffa S.',
                    'client_role' => 'Co-founder · Manis Studio',
                    'message' => [
                        'en' => 'Bilingual copy that actually feels native in both languages.',
                        'id' => 'Copy dwibahasa yang benar-benar terasa natural di kedua bahasa.',
                    ],
                ],
            ];
            foreach ($samples as $i => $sample) {
                Testimonial::query()->create($sample + ['order' => $i]);
            }
        }
    }
}
