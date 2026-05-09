import { useForm, usePage } from '@inertiajs/react';
import { type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';

interface PageProps {
    user: { id: number; name: string; email: string };
}

export default function Profile() {
    const { props } = usePage<PageProps & Record<string, unknown>>();
    const { t } = useTranslation();
    const form = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.put(route('admin.profile.password'), {
            onSuccess: () => form.reset(),
        });
    };

    return (
        <AdminLayout title={t('admin.profile')}>
            <h1 className="text-2xl font-bold text-stone-800">{t('admin.profile')}</h1>
            <p className="text-sm text-stone-500">
                {props.user.name} · {props.user.email}
            </p>

            <form className="mt-6 max-w-md space-y-4 card" onSubmit={submit}>
                <div>
                    <label className="label" htmlFor="current_password">
                        {t('admin.currentPassword')}
                    </label>
                    <input
                        id="current_password"
                        type="password"
                        className="input mt-1"
                        value={form.data.current_password}
                        onChange={(e) => form.setData('current_password', e.target.value)}
                        autoComplete="current-password"
                    />
                    {form.errors.current_password && (
                        <p className="mt-1 text-xs text-rose-500">{form.errors.current_password}</p>
                    )}
                </div>

                <div>
                    <label className="label" htmlFor="password">
                        {t('admin.newPassword')}
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="input mt-1"
                        value={form.data.password}
                        onChange={(e) => form.setData('password', e.target.value)}
                        autoComplete="new-password"
                    />
                    {form.errors.password && (
                        <p className="mt-1 text-xs text-rose-500">{form.errors.password}</p>
                    )}
                </div>

                <div>
                    <label className="label" htmlFor="password_confirmation">
                        {t('admin.confirmPassword')}
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        className="input mt-1"
                        value={form.data.password_confirmation}
                        onChange={(e) => form.setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                    />
                </div>

                <button className="btn-primary" disabled={form.processing}>
                    {t('admin.updatePassword')}
                </button>
            </form>
        </AdminLayout>
    );
}
