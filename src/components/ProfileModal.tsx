import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Sparkles } from 'lucide-react';
import { AVATARS } from '../data/games';
import { Language, PlayerProfile } from '../types';
import { sounds } from '../utils/audio';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
  lang: Language;
  onSave: (name: string, avatar: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  lang,
  onSave,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [name, setName] = useState(profile.name);

  if (!isOpen) return null;

  const handleSave = () => {
    sounds.playPop(1.2);
    onSave(name.trim() || 'Super Kid', selectedAvatar);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          className="bg-white rounded-3xl p-6 max-w-sm w-full border-4 border-amber-300 shadow-2xl relative"
        >
          {/* Close button */}
          <button
            onClick={() => {
              sounds.playPop(0.9);
              onClose();
            }}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-black text-slate-800">
              {lang === 'hi' ? 'खिलाड़ी प्रोफाइल चुनें' : 'Customize Profile'}
            </h3>
          </div>

          {/* Name input */}
          <div className="mb-4">
            <label className="text-xs font-bold text-slate-500 block mb-1">
              {lang === 'hi' ? 'आपका नाम:' : 'Player Name:'}
            </label>
            <input
              type="text"
              value={name}
              maxLength={15}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aarav, Ananya, Leo"
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-500 focus:outline-none font-bold text-slate-800 text-sm"
            />
          </div>

          {/* Avatar choice */}
          <label className="text-xs font-bold text-slate-500 block mb-2">
            {lang === 'hi' ? 'पसंदीदा अवतार:' : 'Choose an Avatar:'}
          </label>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {AVATARS.map((av) => {
              const isSelected = selectedAvatar === av.emoji;
              return (
                <button
                  key={av.id}
                  onClick={() => {
                    sounds.playPop(1.3);
                    setSelectedAvatar(av.emoji);
                  }}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-amber-100 border-2 border-amber-500 shadow-md ring-2 ring-amber-300/60 scale-105'
                      : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="text-3xl">{av.emoji}</span>
                  <span className="text-[10px] font-extrabold text-slate-700 mt-1 truncate max-w-full">
                    {lang === 'hi' ? av.nameHi : av.nameEn.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black rounded-2xl shadow-md active:scale-95 transition-all text-sm flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{lang === 'hi' ? 'सुरक्षित करें' : 'Save Profile'}</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
