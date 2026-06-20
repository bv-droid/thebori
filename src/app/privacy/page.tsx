import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Как BØRI обрабатывает персональные данные.",
  robots: { index: false, follow: true },
};

/* Baseline privacy policy (RU). DRAFT — должно быть проверено юристом перед
   запуском (Закон РК «О персональных данных и их защите» № 94-V / 152 и GDPR
   при обработке данных из ЕС). */
export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <Link href="/" className={styles.back}>
          ← BØRI
        </Link>
        <h1 className={styles.h1}>Политика конфиденциальности</h1>
        <p className={styles.meta}>Черновик · обновлено 06.2026</p>

        <p className={styles.p}>
          Этот документ описывает, какие данные собирает сайт BØRI ({siteConfig.url})
          и как они используются. Регистрируясь в листе ожидания, вы соглашаетесь
          с обработкой данных в объёме ниже.
        </p>

        <h2 className={styles.h2}>1. Какие данные мы собираем</h2>
        <ul className={styles.list}>
          <li>
            <b>Email и имя</b> — когда вы вступаете в лист ожидания. Хранятся у
            нашего обработчика GetWaitlist (getwaitlist.com).
          </li>
          <li>
            <b>Приблизительное местоположение по IP</b> (страна, город,
            координаты) — для выбора языка и оформления. Определяется сервисом
            ipapi.co; сам IP-адрес мы не храним.
          </li>
          <li>
            <b>Технические данные</b> — язык и согласие на cookies сохраняются
            локально в вашем браузере (localStorage).
          </li>
          <li>
            <b>Аналитика</b> — обезличенная статистика использования собирается
            только после вашего согласия в баннере cookies.
          </li>
        </ul>

        <h2 className={styles.h2}>2. Зачем</h2>
        <p className={styles.p}>
          Чтобы уведомить вас о запуске и первых релизах, выдать персональный
          Pack ID, показать сайт на вашем языке и улучшать опыт. Мы не продаём
          ваши данные третьим лицам.
        </p>

        <h2 className={styles.h2}>3. Обработчики</h2>
        <p className={styles.p}>
          GetWaitlist (хранение заявок), ipapi.co и open-meteo (геоданные по IP).
          Каждый обрабатывает данные на своих условиях.
        </p>

        <h2 className={styles.h2}>4. Хранение и ваши права</h2>
        <p className={styles.p}>
          Данные хранятся до отзыва согласия или достижения цели. Вы можете
          запросить доступ, исправление или удаление ваших данных, а также
          отозвать согласие — напишите на privacy@
          {siteConfig.url.replace(/^https?:\/\//, "")}.
        </p>

        <h2 className={styles.h2}>5. Cookies</h2>
        <p className={styles.p}>
          Необходимые cookies обеспечивают работу сайта (язык, выбор согласия).
          Аналитические подключаются только с вашего согласия и управляются
          баннером cookies.
        </p>

        <p className={styles.note}>
          Документ носит ознакомительный характер и будет дополнен финальной
          юридической редакцией перед публичным запуском.
        </p>
      </div>
    </main>
  );
}
