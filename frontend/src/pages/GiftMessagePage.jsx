import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

function GiftMessagePage() {
  const { giftId } = useParams();
  const [gift, setGift] = useState(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    try {
      const gifts = JSON.parse(localStorage.getItem("skinmatch.gifts") || "{}");
      setGift(gifts[giftId] || null);
    } catch (_error) {
      setGift(null);
    }
  }, [giftId]);

  const voice = useMemo(() => {
    if (!gift?.voiceStyle) return null;
    const voices = window.speechSynthesis?.getVoices?.() || [];
    if (voices.length === 0) return null;
    const lower = gift.voiceStyle.toLowerCase();
    if (lower.includes("female")) return voices.find((v) => v.name.toLowerCase().includes("female")) || voices[0];
    if (lower.includes("male")) return voices.find((v) => v.name.toLowerCase().includes("male")) || voices[0];
    return voices.find((v) => v.name.toLowerCase().includes("english")) || voices[0];
  }, [gift]);

  const playTyped = () => {
    if (!gift?.typedMessage) return;
    const utterance = new SpeechSynthesisUtterance(gift.typedMessage);
    if (voice) utterance.voice = voice;
    utterance.onend = () => setPlaying(false);
    setPlaying(true);
    window.speechSynthesis?.speak?.(utterance);
  };

  if (!gift) {
    return (
      <div className="gift-page">
        <div className="gift-page__card">
          <p className="gift-page__title">Gift message not found</p>
          <p className="gift-page__subtitle">Please scan the QR code again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gift-page">
      <div className="gift-page__card">
        <p className="gift-page__kicker">Only on OpenLeaf Beauty</p>
        <h1 className="gift-page__title">A gift from {gift.senderName || "a loved one"} 💖</h1>
        <p className="gift-page__subtitle">Personalized Voice Gifts</p>

        <div className="gift-page__animation" aria-hidden="true">
          <div className="gift-page__sparkle" />
          <div className="gift-page__box" />
        </div>

        <div className="gift-page__message">
          <p>✨ A message just for you</p>
          {gift.audioDataUrl ? (
            <audio controls src={gift.audioDataUrl} />
          ) : (
            <button type="button" onClick={playTyped} disabled={playing}>
              🎧 Play Voice Message
            </button>
          )}
          <p className="gift-page__text">{gift.typedMessage}</p>
        </div>
      </div>
    </div>
  );
}

export default GiftMessagePage;
