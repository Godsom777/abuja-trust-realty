"use client";

import React from 'react';
import styles from './menu.module.css';

export default function TrapHouseMenu() {
  const MENU_CATEGORIES = [
    {
      id: "wine",
      title: "Wine & Liqueur",
      icon: "🍷",
      items: [
        { name: "Asconi Agor",    price: "₦30,000",  image: "/menu/asconi_agor.png",  note: "No sides" },
        { name: "Four Cousins",   price: "₦30,000",  image: "/menu/four_cousins.png", note: "No sides" },
        { name: "Pastoral",       price: "₦60,000",  image: "/menu/pastoral.png",     note: "Comes with chicken wings" },
        { name: "Thomas Barton",  price: "₦60,000",  image: "/menu/thomas_barton.png",note: "Comes with chicken wings" },
        { name: "Cooper & Thief", price: "₦130,000", image: "/menu/cooper_thief.png", note: "Comes with chicken wings" },
        { name: "Baileys",        price: "₦160,000", image: "/menu/baileys.png",      note: "Comes with chicken wings" },
      ]
    },
    {
      id: "whiskey",
      title: "Whiskey, Cognac & Tequila",
      icon: "🥃",
      items: [
        { name: "Buen Amigo Tequila",   price: "₦60,000",  image: "/menu/buen_amigo.jpg",    note: "Comes with chicken wings" },
        { name: "Teeling Whiskey",      price: "₦60,000",  image: "/menu/teeling.jpg",       note: "Comes with chicken wings" },
        { name: "Jameson Green",        price: "₦70,000",  image: "/menu/jameson.jpg",       note: "Comes with chicken wings" },
        { name: "Belaire",              price: "₦120,000", image: "/menu/belaire.jpg",       note: "Comes with chicken wings" },
        { name: "Martel VS",            price: "₦160,000", image: "/menu/martell.jpg",       note: "Comes with chicken wings" },
        { name: "Hennessy VS",          price: "₦160,000", image: "/menu/hennessy_vs.jpg",   note: "Comes with chicken wings" },
        { name: "Bisquit & Dubouché",   price: "₦170,000", image: "/menu/bisquit.jpg",       note: "Comes with chicken wings" },
        { name: "Hennessy VSOP",        price: "₦190,000", image: "/menu/hennessy_vsop.jpg", note: "Comes with chicken wings" },
        { name: "Casamigo Tequila",     price: "₦300,000", image: "/menu/casamigos.jpg",     note: "Comes with chicken wings" },
      ]
    },
    {
      id: "cocktails",
      title: "Cocktails",
      icon: "🍹",
      items: [
        { name: "Cocktails", price: "₦7,000", image: "/menu/cocktail.jpg", note: "No sides" },
        { name: "Juice",     price: "On Demand", image: "/menu/juice.jpg", note: "Available on request 🥤" },
      ]
    }
  ];

  const EXTRAS = [
    {
      name: "Shisha",
      price: "₦10,000",
      image: "/menu/shisha.jpg",
      description: "Flavored hookah, available all night. Ask your host for available flavors.",
      icon: "💨"
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>

        <header className={styles.header}>
          <span className={styles.kicker}>Exclusive Menu</span>
          <h1 className={styles.title}>Trap House Party</h1>
          <p className={styles.subtitle}>Premium drinks & good vibes. Let the night begin.</p>

          {/* Venue badge */}
          <div className={styles.venueBadge}>
            <span className={styles.venueLabel}>Hosted at</span>
            <div className={styles.venueLogoWrap}>
              <img
                src="/menu/old_english_logo.jpg"
                alt="Old English Bar & Grills"
                className={styles.venueLogo}
              />
            </div>
          </div>
        </header>

        <div className={styles.noticeBox}>
          <span>🍗</span>
          <p style={{ margin: 0 }}>All drinks (except cocktails) come with complimentary chicken wings!</p>
        </div>

        {MENU_CATEGORIES.map((category) => (
          <section key={category.id} className={styles.category}>
            <h2 className={styles.categoryTitle}>
              {category.icon} {category.title}
            </h2>
            <div className={styles.grid}>
              {category.items.map((item, idx) => (
                <div key={idx} className={styles.card}>
                  <img src={item.image} alt={item.name} className={styles.cardImage} loading="lazy" />
                  <div className={styles.cardBody}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <p className={styles.itemPrice}>{item.price}</p>
                    {item.note && <p className={styles.itemNote}>{item.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Shisha – styled separately as an experience, not a drink */}
        <section className={styles.category}>
          <h2 className={styles.categoryTitle}>💨 Vibe & Extras</h2>
          <div className={styles.shishaGrid}>
            {EXTRAS.map((item, idx) => (
              <div key={idx} className={styles.shishaCard}>
                <div className={styles.shishaImageWrap}>
                  <img src={item.image} alt={item.name} className={styles.shishaImage} loading="lazy" />
                  <div className={styles.shishaOverlay}>
                    <span className={styles.shishaIcon}>{item.icon}</span>
                    <h3 className={styles.shishaName}>{item.name}</h3>
                    <p className={styles.shishaPrice}>{item.price}</p>
                  </div>
                </div>
                <p className={styles.shishaDesc}>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className={styles.footer}>
          <p>Please drink responsibly.</p>
        </footer>
      </div>
    </div>
  );
}
