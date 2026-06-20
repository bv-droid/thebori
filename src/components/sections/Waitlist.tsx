"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PackCard } from "@/components/brand/PackCard";
import { useI18n } from "@/i18n/LanguageProvider";
import { submitWaitlist, type WaitlistResult } from "@/lib/submitWaitlist";
import { packIdFromPosition } from "@/config/waitlist";
import { waitlistMedia } from "@/config/waitlistMedia";
import styles from "./Waitlist.module.css";

gsap.registerPlugin(ScrollTrigger);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Waitlist() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<WaitlistResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-reveal]", {
        scrollTrigger: { trigger: root.current, start: "top 70%" },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.08,
      });
    }, root);
    return () => ctx.revert();
  }, [t]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!EMAIL_RE.test(email)) return setError(t.waitlist.errEmail);
    if (!consent) return setError(t.waitlist.errConsent);
    setSubmitting(true);
    try {
      const r = await submitWaitlist(email.trim(), name.trim());
      setResult(r);
    } catch {
      setError(t.waitlist.errGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  const onShare = async () => {
    const link = result?.referral || window.location.href;
    const text = t.waitlist.success.shareText;
    // native share sheet (Telegram/WhatsApp/IG on mobile) → clipboard fallback
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "BØRI", text, url: link });
        return;
      } catch {
        /* user cancelled or unsupported → fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${link}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <section ref={root} className={styles.waitlist} id="join">
      {waitlistMedia.enabled && (
        <div className={styles.media} aria-hidden="true">
          {waitlistMedia.type === "video" ? (
            <video
              className={styles.mediaEl}
              src={waitlistMedia.video}
              poster={waitlistMedia.poster}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img className={styles.mediaEl} src={waitlistMedia.image} alt="" />
          )}
          <div className={styles.mediaScrim} />
        </div>
      )}
      {!result ? (
        <div className={styles.inner}>
          <span className={`${styles.kicker} ${styles.reveal}`} data-reveal>
            {t.waitlist.kicker}
          </span>
          <h2 className={`${styles.title} ${styles.reveal}`} data-reveal>
            {t.waitlist.title}
          </h2>
          <p className={`${styles.lead} ${styles.reveal}`} data-reveal>
            {t.waitlist.lead}
          </p>

          <form className={`${styles.form} ${styles.reveal}`} data-reveal onSubmit={onSubmit}>
            <label htmlFor="wl-name" className="srOnly">
              {t.waitlist.namePlaceholder}
            </label>
            <input
              id="wl-name"
              className={styles.input}
              type="text"
              placeholder={t.waitlist.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
            <label htmlFor="wl-email" className="srOnly">
              {t.waitlist.emailPlaceholder}
            </label>
            <input
              id="wl-email"
              className={styles.input}
              type="email"
              placeholder={t.waitlist.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              aria-invalid={!!error}
              aria-describedby={error ? "wl-error" : undefined}
            />
            <label className={styles.consent}>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>
                {t.waitlist.consent}{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.policyLink}
                  onClick={(e) => e.stopPropagation()}
                >
                  {t.waitlist.policy}
                </a>
              </span>
            </label>
            {error && (
              <span id="wl-error" className={styles.error} role="alert">
                {error}
              </span>
            )}
            <button className={styles.submit} type="submit" disabled={submitting}>
              {submitting ? t.waitlist.submitting : t.waitlist.cta}
            </button>
          </form>
        </div>
      ) : (
        <div className={styles.success}>
          <span className={styles.kicker}>{t.waitlist.success.title}</span>
          <p className={styles.lead}>{t.waitlist.success.lead}</p>
          <div className={styles.successCard}>
            <PackCard
              packId={packIdFromPosition(result.position)}
              label={t.waitlist.success.idLabel}
              status={t.waitlist.success.statusLabel}
            />
          </div>
          <button type="button" className={styles.share} onClick={onShare}>
            {copied ? t.waitlist.success.copied : t.waitlist.success.share}
          </button>
        </div>
      )}
    </section>
  );
}
