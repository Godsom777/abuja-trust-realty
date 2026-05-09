"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <span className="text-label">Get In Touch</span>
          <h1>Contact Us</h1>
          <p className={styles.heroSub}>
            Have questions about buying, selling, or investing in Abuja property?
            We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className={`section ${styles.contactSection}`}>
        <div className="container">
          <div className={styles.grid}>
            {/* Contact Info */}
            <div className={styles.info}>
              <div className={styles.infoCard}>
                <div className={styles.infoIconWrap}>
                  <i className="fa-brands fa-whatsapp"></i>
                </div>
                <h3>WhatsApp</h3>
                <p>Reach us directly on WhatsApp for quick inquiries</p>
                <a
                  href="https://wa.me/2348000000000"
                  className="btn btn-whatsapp"
                  id="contact-whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-whatsapp"></i>
                  Chat on WhatsApp
                </a>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIconWrap}>
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <h3>Email</h3>
                <p>For formal inquiries and documentation</p>
                <a href="mailto:hello@abujatrust.com" className={styles.infoLink}>
                  <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  hello@abujatrust.com
                </a>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIconWrap}>
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <h3>Office</h3>
                <p>Abuja, Federal Capital Territory, Nigeria</p>
                <span className={styles.infoNote}>
                  <i className="fa-regular fa-calendar"></i>
                  By appointment only
                </span>
              </div>
            </div>

            {/* Contact Form */}
            <div className={styles.formWrap}>
              {submitted ? (
                <div className={styles.success}>
                  <div className={styles.successIconWrap}>
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <h3>Message Sent!</h3>
                  <p>We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>
                        <i className="fa-regular fa-user"></i>
                        Full Name
                      </label>
                      <input type="text" required placeholder="Your name" id="contact-name" />
                    </div>
                    <div className={styles.formGroup}>
                      <label>
                        <i className="fa-regular fa-envelope"></i>
                        Email
                      </label>
                      <input type="email" required placeholder="your@email.com" id="contact-email" />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      <i className="fa-solid fa-earth-africa"></i>
                      Country
                    </label>
                    <input type="text" placeholder="Where are you based?" id="contact-country" />
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      <i className="fa-solid fa-tag"></i>
                      Subject
                    </label>
                    <select id="contact-subject" defaultValue="">
                      <option value="" disabled>Select a topic</option>
                      <option value="buying">Buying Property</option>
                      <option value="selling">Listing My Property</option>
                      <option value="investing">Investment Inquiry</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      <i className="fa-regular fa-message"></i>
                      Message
                    </label>
                    <textarea
                      required
                      rows="5"
                      placeholder="Tell us how we can help..."
                      id="contact-message"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%" }}>
                    <i className="fa-solid fa-paper-plane"></i>
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
