'use client';

import React, { useState } from 'react';
import { Column, Row, Text, Icon, Background, Flex, Heading, RevealFx, SmartLink } from '@once-ui-system/core';
import styles from './faq.module.scss';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    title: 'Vor dem Termin',
    icon: 'calendar',
    items: [
      {
        question: 'Was muss ich vor meinem Termin beachten?',
        answer: 'Komm bitte ohne Augen-Make-up und ohne Kontaktlinsen. Vermeide 24 Stunden vorher ölhaltige Produkte im Augenbereich. Das ist alles — ich kümmere mich um den Rest.'
      },
      {
        question: 'Kann ich mit Kontaktlinsen kommen?',
        answer: 'Bitte nimm deine Kontaktlinsen vor dem Termin heraus. Du kannst sie nach der Behandlung wieder einsetzen, aber während der Behandlung müssen deine Augen geschlossen bleiben.'
      },
      {
        question: 'Wie buche ich einen Termin?',
        answer: 'Du kannst direkt über meine Website buchen — einfach auf "Termin buchen" klicken und deinen Wunschtermin auswählen. Du bekommst sofort eine Bestätigung per E-Mail.'
      },
      {
        question: 'Kann ich meinen Termin verschieben oder absagen?',
        answer: 'Ja, bis 24 Stunden vor dem Termin kannst du kostenlos verschieben oder absagen. Bei kurzfristigeren Absagen fällt eine Ausfallgebühr an.'
      }
    ]
  },
  {
    title: 'Während der Behandlung',
    icon: 'sparkle',
    items: [
      {
        question: 'Tut das weh?',
        answer: 'Nein, überhaupt nicht. Du liegst entspannt mit geschlossenen Augen auf einer bequemen Liege. Viele meiner Kundinnen schlafen dabei sogar ein.'
      },
      {
        question: 'Wie lange dauert die Behandlung?',
        answer: 'Das hängt von der Technik ab: Einzeltechnik ca. 90-120 Minuten, Hybrid ca. 120-150 Minuten, Volumen ca. 150-180 Minuten. Refills sind kürzer.'
      },
      {
        question: 'Kann ich während der Behandlung mein Handy benutzen?',
        answer: 'Deine Augen müssen während der gesamten Behandlung geschlossen bleiben. Aber du kannst gerne Musik oder Podcasts über Kopfhörer hören.'
      },
      {
        question: 'Was passiert, wenn ich niesen oder husten muss?',
        answer: 'Kein Problem! Sag mir einfach kurz Bescheid, dann pausiere ich. Das passiert öfter und ist völlig normal.'
      }
    ]
  },
  {
    title: 'Nach der Behandlung',
    icon: 'heart',
    items: [
      {
        question: 'Wie lange halten die Wimpern?',
        answer: 'Bei guter Pflege 2-4 Wochen, abhängig von deinem natürlichen Wimpernzyklus. Danach empfehle ich ein Refill, um den Look aufzufrischen.'
      },
      {
        question: 'Wie pflege ich meine Wimpern richtig?',
        answer: 'Die ersten 24 Stunden kein Wasser an die Wimpern. Danach täglich mit einem sauberen Bürstchen kämmen und ölfreie Produkte im Augenbereich verwenden. Ich erkläre dir alles nach der Behandlung.'
      },
      {
        question: 'Kann ich mit Extensions schwimmen gehen?',
        answer: 'Ja, nach 24 Stunden ist das kein Problem. Chlor- und Salzwasser können die Haltbarkeit etwas verkürzen, aber grundsätzlich ist Schwimmen möglich.'
      },
      {
        question: 'Darf ich Mascara verwenden?',
        answer: 'Du brauchst keine Mascara mehr — das ist ja das Schöne! Wenn du trotzdem welche verwenden möchtest, nur wasserbasierte Mascara und nur auf die Spitzen.'
      },
      {
        question: 'Wann sollte ich zum Refill kommen?',
        answer: 'Idealerweise alle 2-3 Wochen. Wenn mehr als 50% der Extensions ausgefallen sind, ist ein Neuaufbau nötig statt eines Refills.'
      }
    ]
  },
  {
    title: 'Preise & Buchung',
    icon: 'tag',
    items: [
      {
        question: 'Was kostet eine Wimpernverlängerung?',
        answer: 'Einzeltechnik ab 89€, Hybrid ab 109€, Volumen ab 129€. Refills sind günstiger. Alle aktuellen Preise findest du auf meiner Website unter Services.'
      },
      {
        question: 'Wie kann ich bezahlen?',
        answer: 'Bar, EC-Karte oder PayPal — ganz wie du möchtest. Die Zahlung erfolgt nach der Behandlung.'
      },
      {
        question: 'Gibt es Rabatte für Stammkundinnen?',
        answer: 'Ja! Mit meiner Stempelkarte bekommst du nach 10 Behandlungen eine gratis. Außerdem gibt es regelmäßig Aktionen für meine treuen Kundinnen.'
      }
    ]
  },
  {
    title: 'Sicherheit & Verträglichkeit',
    icon: 'shield',
    items: [
      {
        question: 'Sind Wimpernextensions schädlich für meine Naturwimpern?',
        answer: 'Nein, wenn sie professionell angebracht werden. Ich achte darauf, dass jede Extension einzeln auf eine Naturwimper geklebt wird und das Gewicht zur Wimper passt.'
      },
      {
        question: 'Kann ich allergisch reagieren?',
        answer: 'Allergien auf den Kleber sind selten, aber möglich. Wenn du empfindlich bist oder unsicher, machen wir vorher einen Patch-Test.'
      },
      {
        question: 'Ich habe empfindliche Augen — ist das ein Problem?',
        answer: 'Nicht unbedingt. Sag mir vorher Bescheid, dann kann ich besonders sanfte Produkte verwenden und öfter Pausen machen.'
      },
      {
        question: 'Kann ich Extensions tragen, wenn ich Kontaktlinsen habe?',
        answer: 'Ja, kein Problem. Du nimmst sie nur für die Behandlung heraus und kannst sie danach wieder einsetzen.'
      }
    ]
  }
];

const beautyTips = [
  {
    title: 'Morgenroutine',
    tip: 'Kämme deine Wimpern jeden Morgen sanft mit einem sauberen Bürstchen durch. Das hält sie in Form und verhindert Verkleben.'
  },
  {
    title: 'Schlafposition',
    tip: 'Versuche, auf dem Rücken zu schlafen. Seitenschläfer können ein Seidenkissen verwenden — das ist sanfter zu den Wimpern.'
  },
  {
    title: 'Make-up Entfernung',
    tip: 'Verwende ölfreie Produkte und tupfe sanft statt zu reiben. Mizellenwasser auf einem Wattepad funktioniert super.'
  },
  {
    title: 'Zwischen den Terminen',
    tip: 'Wenn einzelne Wimpern abstehen, kannst du sie vorsichtig mit dem Bürstchen in Form bringen. Nicht ziehen oder zupfen!'
  }
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, number | null>>({});

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: prev[key] === itemIndex ? null : itemIndex
    }));
  };

  return (
    <Column fillWidth className={styles.faqPage}>
      <Background
        position="absolute"
        fill
        gradient={{
          display: true,
          opacity: 100,
          x: 50,
          y: 50,
          colorStart: "brand-background-weak",
          colorEnd: "accent-background-weak"
        }}
        mask={{
          x: 50,
          y: 50,
          radius: 120
        }}
        zIndex={0}
      />
      <main className={styles.main} style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <Column gap="16" center className={styles.heroContent}>
            <RevealFx delay={0.1} translateY={20}>
              <div className={styles.heroIcon}>
                <Icon name="helpCircle" size="l" />
              </div>
            </RevealFx>
            <RevealFx delay={0.2} translateY={20}>
              <Column gap="s" center>
                <h1 className={styles.heroTitle}>
                  Häufige <span>Fragen</span>
                </h1>
                <div className={styles.headlineUnderline} />
              </Column>
            </RevealFx>
            <RevealFx delay={0.3} translateY={20}>
              <p className={styles.heroSubtitle}>
                Alles, was du über Wimpernverlängerungen wissen möchtest — ehrlich und verständlich erklärt.
              </p>
            </RevealFx>
          </Column>
        </section>

        {/* FAQ Section */}
        <section className={styles.faqSection}>
          <Column gap="48" className={styles.faqContainer}>
            {faqCategories.map((category, categoryIndex) => (
              <Column key={categoryIndex} className={styles.faqCategory}>
                <Row gap="16" vertical="center" className={styles.categoryHeader}>
                  <div className={styles.categoryIcon}>
                    <Icon name={category.icon as any} size="m" />
                  </div>
                  <h2 className={styles.categoryTitle}>
                    {category.title}
                  </h2>
                </Row>
                
                <Column className={styles.faqList}>
                  {category.items.map((item, itemIndex) => {
                    const isOpen = openItems[`${categoryIndex}`] === itemIndex;
                    return (
                      <div 
                        key={itemIndex} 
                        className={`${styles.faqItem} ${isOpen ? styles.open : ''}`}
                      >
                        <button
                          className={styles.faqQuestion}
                          onClick={() => toggleItem(categoryIndex, itemIndex)}
                          aria-expanded={isOpen}
                        >
                          <span className={styles.questionText}>
                            {item.question}
                          </span>
                          <div className={styles.faqIcon}>
                            <Icon 
                              name={isOpen ? 'chevronUp' : 'chevronDown'} 
                              size="s" 
                            />
                          </div>
                        </button>
                        <div className={styles.faqAnswer}>
                          <p className={styles.answerText}>
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </Column>
              </Column>
            ))}
          </Column>
        </section>

        {/* Beauty Tips Section */}
        <section className={styles.tipsSection}>
          <Column className={styles.tipsContainer}>
            <div className={styles.tipsHeader}>
              <div className={styles.tipsIcon}>
                <Icon name="sparkles" size="m" />
              </div>
              <h2 className={styles.tipsTitle}>
                Beauty-Tipps von Lisa
              </h2>
              <p className={styles.tipsSubtitle}>
                Kleine Tricks für maximale Haltbarkeit deiner Wimpern
              </p>
            </div>
            
            <div className={styles.tipsGrid}>
              {beautyTips.map((tip, index) => (
                <div key={index} className={styles.tipCard}>
                  <div className={styles.tipNumber}>{index + 1}</div>
                  <h3 className={styles.tipTitle}>{tip.title}</h3>
                  <p className={styles.tipText}>{tip.tip}</p>
                </div>
              ))}
            </div>
          </Column>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <RevealFx delay={0.4} translateY={20}>
              <div className={styles.ctaCard}>
                <div className={styles.ctaIcon}>
                  <Icon name="messageCircle" size="l" />
                </div>
                <h2 className={styles.ctaTitle}>
                  Noch Fragen?
                </h2>
                <p className={styles.ctaText}>
                  Schreib mir einfach — ich antworte dir persönlich und helfe dir gerne weiter.
                </p>
                <div className={styles.ctaButtons}>
                  <SmartLink href="/online-booking" className={styles.ctaButtonPrimary}>
                    Termin buchen
                  </SmartLink>
                  <SmartLink 
                    href="https://instagram.com/_l.m_beauty_" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.ctaButtonSecondary}
                  >
                    Instagram
                  </SmartLink>
                  <SmartLink href="/" className={styles.ctaButtonSecondary}>
                    ← Zurück zur Startseite
                  </SmartLink>
                </div>
              </div>
            </RevealFx>
          </div>
        </section>
      </main>
    </Column>
  );
}
