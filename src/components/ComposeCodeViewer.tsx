import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Copy, Check, Smartphone, Code2, Sparkles, Cpu, Layers } from 'lucide-react';
import { Language } from '../types';
import { sounds } from '../utils/audio';

interface ComposeCodeViewerProps {
  lang: Language;
  onBack: () => void;
}

const KOTLIN_SNIPPETS = {
  main: `// ========================================================
// 📱 KidsMindSparkApp.kt (Jetpack Compose + Material 3)
// Smooth 60/120fps reactive animations for Kids Games
// ========================================================
package com.kidsmindspark.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                KidsAppNavigationHub()
            }
        }
    }
}`,

  memory: `// ========================================================
// 🦁 Memory Card Composable with 3D Flip Spring Physics
// ========================================================
@Composable
fun MemoryCardItem(
    card: MemoryCardState,
    onCardClick: () -> Unit
) {
    // Jetpack Compose 3D Rotation Animation
    val rotation by animateFloatAsState(
        targetValue = if (card.isFlipped || card.isMatched) 180f else 0f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessLow
        ),
        label = "cardFlipAnimation"
    )

    Card(
        modifier = Modifier
            .aspectRatio(1f)
            .padding(6.dp)
            .graphicsLayer {
                rotationY = rotation
                cameraDistance = 14f * density
            }
            .clickable(enabled = !card.isFlipped && !card.isMatched) {
                onCardClick()
            },
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (card.isMatched) Color(0xFFD1FAE5)
            else if (rotation > 90f) Color.White 
            else Color(0xFFF59E0B)
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
    ) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            if (rotation > 90f) {
                // Card face (Emoji & Name)
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.graphicsLayer { rotationY = 180f }
                ) {
                    Text(text = card.emoji, fontSize = 42.sp)
                    Text(
                        text = card.title,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF334155)
                    )
                }
            } else {
                // Card back (Playful icon)
                Text(text = "✨", fontSize = 28.sp)
            }
        }
    }
}`,

  balloon: `// ========================================================
// 🎈 Floating Balloon Math with Physics Bounce
// ========================================================
@Composable
fun FloatingBalloon(
    value: Int,
    balloonColor: Color,
    onPop: () => Unit
) {
    // Continuous gentle floating hover
    val infiniteTransition = rememberInfiniteTransition(label = "floating")
    val offsetY by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = -25f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "balloonBobbing"
    )

    Box(
        modifier = Modifier
            .offset(y = offsetY.dp)
            .size(width = 100.dp, height = 130.dp)
            .clip(RoundedCornerShape(50))
            .background(
                Brush.verticalGradient(
                    listOf(balloonColor.copy(alpha = 0.85f), balloonColor)
                )
            )
            .clickable { onPop() }
            .padding(12.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "$value",
            fontSize = 32.sp,
            fontWeight = FontWeight.Black,
            color = Color.White
        )
    }
}`,

  simon: `// ========================================================
// 🎵 Simon Sound Pad with Spring Touch & Glow
// ========================================================
@Composable
fun SimonMusicalPad(
    padColor: Color,
    isActive: Boolean,
    onTap: () => Unit
) {
    val scale by animateFloatAsState(
        targetValue = if (isActive) 1.08f else 1.0f,
        animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy),
        label = "padScale"
    )

    Surface(
        modifier = Modifier
            .size(130.dp)
            .graphicsLayer {
                scaleX = scale
                scaleY = scale
            }
            .clickable { onTap() },
        shape = RoundedCornerShape(32.dp),
        color = if (isActive) padColor.copy(alpha = 0.7f) else padColor,
        shadowElevation = if (isActive) 16.dp else 4.dp
    ) {
        Box(contentAlignment = Alignment.Center) {
            Icon(
                imageVector = Icons.Default.MusicNote,
                contentDescription = null,
                tint = Color.White
            )
        }
    }
}`
};

export const ComposeCodeViewer: React.FC<ComposeCodeViewerProps> = ({ lang, onBack }) => {
  const [selectedSnippet, setSelectedSnippet] = useState<keyof typeof KOTLIN_SNIPPETS>('main');
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    sounds.playPop();
    navigator.clipboard.writeText(KOTLIN_SNIPPETS[selectedSnippet]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="compose-viewer-container" className="max-w-4xl mx-auto px-4 py-4">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur rounded-2xl p-3 border border-indigo-100 shadow-sm">
        <button
          id="compose-back-btn"
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-semibold text-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-indigo-600" />
          <div className="text-left">
            <span className="text-xs font-bold text-slate-400 block uppercase">
              {lang === 'hi' ? 'एंड्रॉयड जेटपैक कम्पोज़' : 'Android Jetpack Compose'}
            </span>
            <span className="text-sm font-black text-indigo-950">
              Kotlin UI & Animation Source
            </span>
          </div>
        </div>

        <button
          id="copy-code-btn"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all active:scale-95 shadow"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? (lang === 'hi' ? 'कॉपी हुआ!' : 'Copied!') : (lang === 'hi' ? 'कोड कॉपी करें' : 'Copy Code')}</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-2xl p-3.5 border border-indigo-100 shadow-sm flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800">
              {lang === 'hi' ? 'स्प्रिंग फिजिक्स एनिमेशन' : 'Spring Physics'}
            </h4>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              {lang === 'hi'
                ? 'animateFloatAsState और Spring.DampingRatioMediumBouncy से बच्चों के लिए स्वाभाविक उछाल।'
                : 'Bouncy, fluid spring physics for cards and popping balloons.'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-indigo-100 shadow-sm flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800">
              {lang === 'hi' ? 'ग्राफिक्स लेयर 3D' : 'graphicsLayer 3D'}
            </h4>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              {lang === 'hi'
                ? 'हार्डवेयर त्वरित 3D कार्ड रोटेशन बिना किसी लैग के 60/120 FPS पर।'
                : 'Hardware-accelerated 3D flip rotation at 60/120 FPS.'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-indigo-100 shadow-sm flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800">
              {lang === 'hi' ? 'प्रतिक्रियाशील स्टेट' : 'Reactive StateFlow'}
            </h4>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              {lang === 'hi'
                ? 'remember और mutableStateOf से तेज, स्मूथ और तत्काल प्रतिक्रिया।'
                : 'Smooth state management with zero stutter and instant touch.'}
            </p>
          </div>
        </div>
      </div>

      {/* Snippet Tabs */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        {[
          { key: 'main', labelEn: '1. App Hub (MainActivity.kt)', labelHi: '1. मुख्य नेविगेशन' },
          { key: 'memory', labelEn: '2. 3D Memory Card Composable', labelHi: '2. 3D कार्ड फ्लिपर' },
          { key: 'balloon', labelEn: '3. Floating Balloon Math', labelHi: '3. गुब्बारा गणित' },
          { key: 'simon', labelEn: '4. Simon Musical Glow Pad', labelHi: '4. साइमन संगीत पैड' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              sounds.playPop(1.1);
              setSelectedSnippet(tab.key as keyof typeof KOTLIN_SNIPPETS);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedSnippet === tab.key
                ? 'bg-slate-900 text-white shadow'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {lang === 'hi' ? tab.labelHi : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Code Editor Preview Box */}
      <div className="bg-slate-950 rounded-3xl p-5 border-2 border-slate-800 shadow-2xl font-mono text-xs overflow-x-auto text-emerald-400">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400 text-[11px]">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>Kotlin / Jetpack Compose 1.7+ (Android 14/15 Ready)</span>
          </div>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
            build.gradle.kts (Material 3)
          </span>
        </div>

        <pre className="leading-relaxed">
          <code>{KOTLIN_SNIPPETS[selectedSnippet]}</code>
        </pre>
      </div>
    </div>
  );
};
