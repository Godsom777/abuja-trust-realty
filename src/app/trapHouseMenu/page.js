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
        { name: "Asconi Agor", price: "₦30,000", image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=600&auto=format&fit=crop", note: "No sides" },
        { name: "Four cousins", price: "₦30,000", image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop", note: "No sides" },
        { name: "Pastoral", price: "₦60,000", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop", note: "Comes with chicken wings" },
        { name: "Thomas Barton", price: "₦60,000", image: "https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?q=80&w=600&auto=format&fit=crop", note: "Comes with chicken wings" },
        { name: "Cooper & Thief", price: "₦130,000", image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?q=80&w=600&auto=format&fit=crop", note: "Comes with chicken wings" },
        { name: "Baileys", price: "₦160,000", image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=600&auto=format&fit=crop", note: "Comes with chicken wings" },
      ]
    },
    {
      id: "whiskey",
      title: "Whiskey, Cognac & Tequila",
      icon: "🥃",
      items: [
        { name: "Buen Amigo Tequila", price: "₦60,000", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop", note: "Comes with chicken wings" },
        { name: "Teeling Whiskey", price: "₦60,000", image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=600&auto=format&fit=crop", note: "Comes with chicken wings" },
        { name: "Jameson Green", price: "₦70,000", image: "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?q=80&w=600&auto=format&fit=crop", note: "Comes with chicken wings" },
        { name: "Belaire", price: "₦120,000", image: "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?q=80&w=600&auto=format&fit=crop", note: "Comes with chicken wings" },
        { name: "Martel VS", price: "₦160,000", image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=600&auto=format&fit=crop", note: "Comes with chicken wings" },
        { name: "Hennessy VS", price: "₦160,000", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop", note: "Comes with chicken wings" },
        { name: "Bisquit & Dubouché", price: "₦170,000", image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=600&auto=format&fit=crop", note: "Comes with chicken wings" },
        { name: "Hennessy VSOP", price: "₦190,000", image: "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?q=80&w=600&auto=format&fit=crop", note: "Comes with chicken wings" },
        { name: "Casamigo Tequila", price: "₦300,000", image: "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?q=80&w=600&auto=format&fit=crop", note: "Comes with chicken wings" },
      ]
    },
    {
      id: "specials",
      title: "Specials & Extras",
      icon: "🍹",
      items: [
        { name: "Cocktails", price: "₦7,000", image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=600&auto=format&fit=crop", note: "No sides" },
        { name: "Shisha", price: "₦10,000", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=600&auto=format&fit=crop", note: "Available in multiple flavors" },
        { name: "Juice", price: "On Demand", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=600&auto=format&fit=crop", note: "" },
      ]
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <span className={styles.kicker}>Exclusive Menu</span>
          <h1 className={styles.title}>Trap House Party</h1>
          <p className={styles.subtitle}>Premium drinks & good vibes. Let the night begin.</p>
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
                  <img src={item.image} alt={item.name} className={styles.cardImage} />
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

        <footer className={styles.footer}>
          <p>Please drink responsibly.</p>
        </footer>
      </div>
    </div>
  );
}
