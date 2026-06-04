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
        { name: "Asconi Agor", price: "₦30,000", image: "/menu/asconi_agor.png", note: "No sides" },
        { name: "Four Cousins", price: "₦30,000", image: "/menu/four_cousins.png", note: "No sides" },
        { name: "Pastoral", price: "₦60,000", image: "/menu/pastoral.png", note: "Comes with chicken wings" },
        { name: "Thomas Barton", price: "₦60,000", image: "/menu/thomas_barton.png", note: "Comes with chicken wings" },
        { name: "Cooper & Thief", price: "₦130,000", image: "/menu/cooper_thief.png", note: "Comes with chicken wings" },
        { name: "Baileys", price: "₦160,000", image: "/menu/baileys.png", note: "Comes with chicken wings" },
      ]
    },
    {
      id: "whiskey",
      title: "Whiskey, Cognac & Tequila",
      icon: "🥃",
      items: [
        { name: "Buen Amigo Tequila", price: "₦60,000", image: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?w=600&auto=compress", note: "Comes with chicken wings" },
        { name: "Teeling Whiskey", price: "₦60,000", image: "https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?w=600&auto=compress", note: "Comes with chicken wings" },
        { name: "Jameson Green", price: "₦70,000", image: "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?w=600&auto=compress", note: "Comes with chicken wings" },
        { name: "Belaire", price: "₦120,000", image: "https://images.pexels.com/photos/2789328/pexels-photo-2789328.jpeg?w=600&auto=compress", note: "Comes with chicken wings" },
        { name: "Martel VS", price: "₦160,000", image: "https://images.pexels.com/photos/1170599/pexels-photo-1170599.jpeg?w=600&auto=compress", note: "Comes with chicken wings" },
        { name: "Hennessy VS", price: "₦160,000", image: "https://images.pexels.com/photos/4553027/pexels-photo-4553027.jpeg?w=600&auto=compress", note: "Comes with chicken wings" },
        { name: "Bisquit & Dubouché", price: "₦170,000", image: "https://images.pexels.com/photos/1170599/pexels-photo-1170599.jpeg?w=600&auto=compress", note: "Comes with chicken wings" },
        { name: "Hennessy VSOP", price: "₦190,000", image: "https://images.pexels.com/photos/4553027/pexels-photo-4553027.jpeg?w=600&auto=compress", note: "Comes with chicken wings" },
        { name: "Casamigo Tequila", price: "₦300,000", image: "https://images.pexels.com/photos/5946627/pexels-photo-5946627.jpeg?w=600&auto=compress", note: "Comes with chicken wings" },
      ]
    },
    {
      id: "specials",
      title: "Specials & Extras",
      icon: "🍹",
      items: [
        { name: "Cocktails", price: "₦7,000", image: "https://images.pexels.com/photos/3019019/pexels-photo-3019019.jpeg?w=600&auto=compress", note: "No sides" },
        { name: "Shisha", price: "₦10,000", image: "https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg?w=600&auto=compress", note: "Available in multiple flavors" },
        { name: "Juice", price: "On Demand", image: "https://images.pexels.com/photos/1536304/pexels-photo-1536304.jpeg?w=600&auto=compress", note: "Available on demand 🥤" },
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

        <footer className={styles.footer}>
          <p>Please drink responsibly.</p>
        </footer>
      </div>
    </div>
  );
}
