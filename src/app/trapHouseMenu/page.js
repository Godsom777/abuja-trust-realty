"use client";

import Image from "next/image";
import React from "react";
import styles from "./menu.module.css";

const MENU_SECTIONS = [
  {
    id: "wine",
    title: "Wine & Liqueur",
    accent: "#ff8b54",
    blurb: "Soft pours, sharp bottles, and a warm start to the night.",
    items: [
      { name: "Asconi Agor", price: "₦30,000", image: "/menu/asconi_agor.png", note: "No sides" },
      { name: "Four Cousins", price: "₦30,000", image: "/menu/four_cousins.png", note: "No sides" },
      { name: "Pastoral", price: "₦60,000", image: "/menu/pastoral.png", note: "Comes with Chicken and chips" },
      { name: "Thomas Barton", price: "₦60,000", image: "/menu/thomas_barton.png", note: "Comes with Chicken and chips" },
      { name: "Cooper & Thief", price: "₦130,000", image: "/menu/cooper_thief.png", note: "Comes with Chicken and chips" },
      { name: "Baileys", price: "₦30,000", image: "/menu/baileys.png", note: "No sides" },
    ],
  },
  {
    id: "whiskey",
    title: "Whiskey, Cognac & Tequila",
    accent: "#f6b565",
    blurb: "Deeper pours for people who want the room to notice them.",
    items: [
      { name: "Buen Amigo Tequila", price: "₦60,000", image: "/menu/buen_amigo.jpg", note: "Comes with Chicken and chips" },
      { name: "Teeling Whiskey", price: "₦60,000", image: "/menu/teeling.jpg", note: "Comes with Chicken and chips" },
      { name: "Jameson Green", price: "₦70,000", image: "/menu/jameson.jpg", note: "Comes with Chicken and chips" },
      { name: "Belaire", price: "₦120,000", image: "/menu/belaire.jpg", note: "Comes with Chicken and chips" },
      { name: "Martel VS", price: "₦160,000", image: "/menu/martell.jpg", note: "Comes with Chicken and chips" },
      { name: "Hennessy VS", price: "₦160,000", image: "/menu/hennessy_vs.jpg", note: "Comes with Chicken and chips" },
      { name: "Bisquit & Dubouché", price: "₦170,000", image: "/menu/bisquit.jpg", note: "Comes with Chicken and chips" },
      { name: "Hennessy VSOP", price: "₦190,000", image: "/menu/hennessy_vsop.jpg", note: "Comes with Chicken and chips" },
      { name: "Casamigo Tequila", price: "₦300,000", image: "/menu/casamigos.jpg", note: "Comes with Chicken and chips" },
    ],
  },
  {
    id: "cocktails",
    title: "Cocktails",
    accent: "#6dd7ff",
    blurb: "Fast, bright, and built to keep the pace up.",
    items: [
      { name: "Cocktails", price: "₦7,000", image: "/menu/cocktail.jpg", note: "No sides" },
      { name: "Juice", price: "On Demand", image: "/menu/juice.jpg", note: "Available on request 🥤" },
    ],
  },
  {
    id: "extras",
    title: "Vibe & Extras",
    accent: "#c78aff",
    blurb: "Slow smoke, bright flame, and the room breathing easier.",
    items: [
      {
        name: "Shisha",
        price: "₦10,000",
        image: "/menu/shisha.jpg",
        note: "Flavored hookah, available all night.",
      },
    ],
  },
];

const CAROUSEL_STEP = 360;

function MenuSection({ section, index, trackRef, onScroll }) {
  return (
    <section
      className={styles.category}
      style={{ "--section-index": index, "--section-accent": section.accent }}
    >
      <div className={styles.categoryHeader}>
        <div className={styles.categoryCopy}>
          <span className={styles.sectionIndex}>{String(index + 1).padStart(2, "0")}</span>
          <div className={styles.headingBlock}>
            <h2 className={styles.categoryTitle}>{section.title}</h2>
            <p className={styles.categoryBlurb}>{section.blurb}</p>
          </div>
        </div>

        <div className={styles.carouselControls}>
          <button
            type="button"
            className={styles.controlButton}
            aria-label={`Scroll ${section.title} left`}
            onClick={() => onScroll(section.id, -CAROUSEL_STEP)}
          >
            <span className={styles.controlArrow} aria-hidden="true" data-direction="left" />
          </button>
          <button
            type="button"
            className={styles.controlButton}
            aria-label={`Scroll ${section.title} right`}
            onClick={() => onScroll(section.id, CAROUSEL_STEP)}
          >
            <span className={styles.controlArrow} aria-hidden="true" data-direction="right" />
          </button>
        </div>
      </div>

      <div className={styles.carouselViewport}>
        <div className={styles.carouselTrack} ref={trackRef}>
          {section.items.map((item, itemIndex) => (
            <article
              key={`${section.id}-${item.name}`}
              className={styles.carouselCard}
              style={{ "--item-index": itemIndex }}
            >
              <div className={styles.cardMedia}>
                <Image
                  src={item.image}
                  alt={item.name}
                  className={styles.cardImage}
                  fill
                  sizes="(max-width: 600px) 84vw, (max-width: 1100px) 36vw, 28vw"
                  priority={index === 0 && itemIndex < 2}
                />
                <span className={styles.cardOrdinal}>{String(itemIndex + 1).padStart(2, "0")}</span>
                <div className={styles.cardGlow} />
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardTopRow}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemPrice}>{item.price}</p>
                </div>
                {item.note && <p className={styles.itemNote}>{item.note}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function TrapHouseMenu() {
  const trackRefs = React.useRef({});

  const setTrackRef = (id) => (node) => {
    if (node) {
      trackRefs.current[id] = node;
    }
  };

  const scrollCategory = (id, delta) => {
    const node = trackRefs.current[id];
    if (!node) return;
    node.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <span className={styles.kicker}>Exclusive Menu</span>
          <h1 className={styles.title}>Trap House Party</h1>
          <p className={styles.subtitle}>Premium drinks &amp; good vibes. Let the night begin.</p>

          <div className={styles.venueBadge}>
            <span className={styles.venueLabel}>Hosted at</span>
            <div className={styles.venueLogoWrap}>
              <Image
                src="/menu/old_english_logo_transparent.png"
                alt="Old English Bar & Grills"
                className={styles.venueLogo}
                width={180}
                height={58}
                priority
              />
            </div>
          </div>
        </header>

        <div className={styles.noticeBox}>
          <p>All drinks except cocktails come with complimentary Chicken and chips.</p>
        </div>

        {MENU_SECTIONS.map((section, index) => (
          <MenuSection
            key={section.id}
            section={section}
            index={index}
            trackRef={setTrackRef(section.id)}
            onScroll={scrollCategory}
          />
        ))}

        <footer className={styles.footer}>
          <p>Please drink responsibly.</p>
        </footer>
      </div>
    </div>
  );
}
