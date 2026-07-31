import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings, SITE_SETTINGS_STORAGE_KEY } from '../hooks/useSiteSettings';
import {
  ArrowLeft,
  Upload,
  Trash2,
  Save,
  Download,
  UploadCloud,
  RotateCcw,
  Lock,
  KeyRound,
  Image as ImageIcon,
  Database,
  UserRound,
  AlertTriangle,
} from 'lucide-react';

const PASS_KEY = 'site_admin_pass';
const DEFAULT_PASS = 'admin123';

const TABS = [
  { id: 'photo', label: 'Photo', icon: ImageIcon },
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'data', label: 'Data', icon: Database },
];

async function compressImage(file, maxDim = 1200, quality = 0.82) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Invalid image'));
    el.src = dataUrl;
  });

  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  try {
    return canvas.toDataURL('image/webp', quality);
  } catch {
    return canvas.toDataURL('image/jpeg', quality);
  }
}

const Field = ({ label, children }) => (
  <label className="flex flex-col gap-1.5">
    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">{label}</span>
    {children}
  </label>
);

const inputClass =
  'w-full bg-white border border-black/15 rounded-md px-3 py-2.5 text-sm text-black focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 transition';

const btnBase =
  'inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed';

const Admin = () => {
  const { settings, update, reset } = useSiteSettings();
  const [unlocked, setUnlocked] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [passError, setPassError] = useState(false);
  const [tab, setTab] = useState('photo');
  const [saved, setSaved] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);

  const photo = settings?.photo?.dataUrl;
  const profile = settings?.profile;

  const unlock = (e) => {
    e.preventDefault();
    const stored = window.localStorage.getItem(PASS_KEY) || DEFAULT_PASS;
    if (passInput === stored) {
      setUnlocked(true);
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  const flash = (msg) => {
    setSaved(msg);
    window.setTimeout(() => setSaved(''), 2200);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImage(file);
      setPhotoPreview(dataUrl);
      flash('Photo loaded — press Save to apply');
    } catch {
      flash('Could not read that image');
    }
  };

  const savePhoto = () => {
    if (!photoPreview) return;
    update({ photo: { dataUrl: photoPreview, updatedAt: new Date().toISOString() } });
    setPhotoPreview(null);
    flash('Photo saved');
  };

  const removePhoto = () => {
    update({ photo: { dataUrl: null, updatedAt: null } });
    setPhotoPreview(null);
    flash('Photo removed — anonymous placeholder restored');
  };

  const updateProfileField = (key, value) => {
    const patch = { profile: { ...profile, [key]: value } };
    if (key === 'github') patch.profile.socials = { ...profile.socials, github: value };
    if (key === 'linkedin') patch.profile.socials = { ...profile.socials, linkedin: value };
    update(patch);
  };

  const saveProfile = () => flash('Profile saved');

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-config.json';
    a.click();
    URL.revokeObjectURL(url);
    flash('Config exported');
  };

  const importJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        update(parsed);
        flash('Config imported');
      } catch {
        flash('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const inputClassMemo = useMemo(() => inputClass, []);

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-black flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8">
            <Link to="/" className="w-9 h-9 flex items-center justify-center rounded-full border border-black/15 hover:bg-black hover:text-white transition-all">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="font-black uppercase tracking-tight text-xl leading-none">Admin</h1>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mt-1">Site Manager</p>
            </div>
          </div>

          <form onSubmit={unlock} className="bg-white border border-black/10 rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-black text-lime-400 flex items-center justify-center mb-4">
              <Lock size={20} />
            </div>
            <h2 className="font-bold text-lg mb-1">Restricted area</h2>
            <p className="text-sm text-black/50 mb-5">
              Enter your passcode to manage the site. Default: <code className="font-mono bg-black/5 px-1.5 py-0.5 rounded">admin123</code>
            </p>
            <Field label="Passcode">
              <input
                type="password"
                value={passInput}
                onChange={(e) => { setPassInput(e.target.value); setPassError(false); }}
                className={`${inputClassMemo} ${passError ? 'border-red-500' : ''}`}
                placeholder="••••••••"
                autoFocus
              />
            </Field>
            {passError && (
              <p className="mt-2 text-xs text-red-600 flex items-center gap-1.5">
                <AlertTriangle size={12} /> Wrong passcode, try again.
              </p>
            )}
            <button type="submit" className={`${btnBase} w-full justify-center bg-black text-white hover:bg-lime-500 hover:text-black mt-5`}>
              <KeyRound size={14} /> Unlock
            </button>
          </form>

          <p className="mt-6 text-[11px] text-black/35 leading-5">
            Client-side demo admin — credentials and changes live in this browser's localStorage.
            Export your config regularly from the Data tab.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-black font-sans">
      <div className="max-w-3xl mx-auto px-5 py-10 md:py-14">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-9 h-9 flex items-center justify-center rounded-full border border-black/15 hover:bg-black hover:text-white transition-all">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="font-black uppercase tracking-tight text-xl leading-none">Admin</h1>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mt-1">Site Manager</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-lime-600 bg-lime-400/15 border border-lime-500/30 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" /> Live
          </span>
        </div>

        {saved && (
          <div className="mb-6 bg-lime-400/15 border border-lime-500/40 text-lime-800 rounded-md px-4 py-3 text-sm font-medium">
            {saved}
          </div>
        )}

        <div className="flex items-center gap-1 border-b border-black/10 mb-8 pb-px">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] transition-all border-b-2 -mb-px ${tab === t.id ? 'border-lime-500 text-black' : 'border-transparent text-black/40 hover:text-black/70'}`}
              >
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* ── Photo tab ── */}
        {tab === 'photo' && (
          <div className="space-y-6">
            <div className="bg-white border border-black/10 rounded-lg p-6 shadow-sm">
              <h2 className="font-bold text-lg mb-1">Profile photo</h2>
              <p className="text-sm text-black/50 mb-5">
                Upload a new photo to replace the anonymous placeholder. Images are compressed to 1200px WebP and stored locally.
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
                {/* Preview */}
                <div className="w-40 h-48 shrink-0 rounded-md overflow-hidden border border-black/10 bg-neutral-100">
                  {(photoPreview || photo) ? (
                    <img src={photoPreview || photo} alt="Preview" className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-black/35">
                      <ImageIcon size={26} />
                      <span className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em]">Anonymous</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col gap-3 justify-center">
                  <label className={`${btnBase} justify-center bg-black text-white hover:bg-lime-500 hover:text-black cursor-pointer`}>
                    <Upload size={14} /> Choose image
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>

                  {photoPreview && (
                    <button onClick={savePhoto} className={`${btnBase} justify-center bg-lime-500 text-black hover:bg-black hover:text-white`}>
                      <Save size={14} /> Save photo
                    </button>
                  )}

                  {photo && (
                    <button onClick={removePhoto} className={`${btnBase} justify-center bg-red-50 text-red-700 border border-red-300 hover:bg-red-600 hover:text-white`}>
                      <Trash2 size={14} /> Remove photo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Profile tab ── */}
        {tab === 'profile' && (
          <div className="bg-white border border-black/10 rounded-lg p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-1">Identity & bio</h2>
            <p className="text-sm text-black/50 mb-6">
              These values feed the site and the AI assistant context.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Full name">
                <input className={inputClassMemo} value={profile?.name || ''} onChange={(e) => updateProfileField('name', e.target.value)} />
              </Field>
              <Field label="Role">
                <input className={inputClassMemo} value={profile?.role || ''} onChange={(e) => updateProfileField('role', e.target.value)} />
              </Field>
              <Field label="Location">
                <input className={inputClassMemo} value={profile?.location || ''} onChange={(e) => updateProfileField('location', e.target.value)} />
              </Field>
              <Field label="Email">
                <input className={inputClassMemo} type="email" value={profile?.email || ''} onChange={(e) => updateProfileField('email', e.target.value)} />
              </Field>
              <Field label="GitHub URL">
                <input className={inputClassMemo} value={profile?.socials?.github || ''} onChange={(e) => updateProfileField('github', e.target.value)} />
              </Field>
              <Field label="LinkedIn URL">
                <input className={inputClassMemo} value={profile?.socials?.linkedin || ''} onChange={(e) => updateProfileField('linkedin', e.target.value)} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Short bio">
                  <textarea
                    className={`${inputClassMemo} resize-y min-h-[110px]`}
                    value={profile?.bio || ''}
                    onChange={(e) => updateProfileField('bio', e.target.value)}
                  />
                </Field>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={saveProfile} className={`${btnBase} bg-black text-white hover:bg-lime-500 hover:text-black`}>
                <Save size={14} /> Save profile
              </button>
            </div>
          </div>
        )}

        {/* ── Data tab ── */}
        {tab === 'data' && (
          <div className="space-y-6">
            <div className="bg-white border border-black/10 rounded-lg p-6 shadow-sm">
              <h2 className="font-bold text-lg mb-1">Backup & restore</h2>
              <p className="text-sm text-black/50 mb-5">
                Everything is stored in this browser. Export regularly so you never lose your edits.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={exportJson} className={`${btnBase} bg-black text-white hover:bg-lime-500 hover:text-black`}>
                  <Download size={14} /> Export config
                </button>
                <label className={`${btnBase} bg-white border border-black/20 hover:bg-black hover:text-white cursor-pointer`}>
                  <UploadCloud size={14} /> Import config
                  <input type="file" accept="application/json" className="hidden" onChange={importJson} />
                </label>
                <button onClick={reset} className={`${btnBase} bg-red-50 text-red-700 border border-red-300 hover:bg-red-600 hover:text-white`}>
                  <RotateCcw size={14} /> Reset to defaults
                </button>
              </div>
              <p className="mt-4 font-mono text-[10px] text-black/35 break-all">
                storage key: {SITE_SETTINGS_STORAGE_KEY}
              </p>
            </div>

            <div className="bg-white border border-black/10 rounded-lg p-6 shadow-sm">
              <h2 className="font-bold text-lg mb-1">Passcode</h2>
              <p className="text-sm text-black/50 mb-4">Change the admin passcode (default <code className="font-mono bg-black/5 px-1.5 py-0.5 rounded">admin123</code>).</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  defaultValue={window.localStorage.getItem(PASS_KEY) || DEFAULT_PASS}
                  onBlur={(e) => {
                    const value = e.target.value.trim() || DEFAULT_PASS;
                    window.localStorage.setItem(PASS_KEY, value);
                    flash('Passcode updated');
                  }}
                  className={inputClassMemo}
                  placeholder="New passcode"
                />
              </div>
              <p className="mt-3 text-[11px] text-black/40">
                Tip: change it after first use — anyone with browser access can otherwise log in.
              </p>
            </div>
          </div>
        )}

        <p className="mt-10 text-[11px] text-black/35 leading-5">
          Demo admin panel. No server involved: changes persist to localStorage on this device and sync live
          across tabs. For a fully deployed site, swap this layer for a hosted CMS or your own API.
        </p>
      </div>
    </div>
  );
};

export default Admin;
