
'use client';

import UpdateAvatarForm from './_components/UpdateAvatarForm';
import UpdateProfileForm from './_components/UpdateProfileForm';

export default function SettingsPage() {
    return (
        <div className="grid gap-6">
            <UpdateAvatarForm />
            <UpdateProfileForm />
        </div>
    );
}
