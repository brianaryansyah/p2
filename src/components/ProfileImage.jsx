import { memo } from 'react';
import { UserRound } from 'lucide-react';

/**
 * Profile photo renderer driven by site settings. Falls back to an
 * anonymous placeholder when no photo has been uploaded via the admin.
 */
const ProfileImage = memo(function ProfileImage({ settings, className = '' }) {
  const photo = settings?.photo?.dataUrl;
  const name = settings?.profile?.name || 'Anonymous';

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        loading="lazy"
        decoding="async"
        width="800"
        height="1000"
        className={`${className} w-full h-full object-cover object-top`}
      />
    );
  }

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

  return (
    <div
      className={`${className} w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-300 text-black/50`}
      role="img"
      aria-label="Anonymous profile placeholder"
    >
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-black/15 bg-white/80 flex items-center justify-center shadow-inner">
        {initials ? (
          <span className="font-black text-xl md:text-2xl tracking-tight text-black/45">{initials}</span>
        ) : (
          <UserRound size={28} className="text-black/40" />
        )}
      </div>
      <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.22em] text-black/40">
        Anonymous
      </p>
    </div>
  );
});

export default ProfileImage;
