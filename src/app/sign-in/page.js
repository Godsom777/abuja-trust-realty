"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Supabase Auth will be integrated here
    alert("Sign in functionality will be connected to Supabase Auth.");
  };

  return (
    <section className={styles.authPage}>
      <div className={styles.authLeft}>
        <div className={styles.authBrand}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>◆</span>
            <span className={styles.logoText}>
              ABJ-Realty<span className={styles.logoAccent}>.</span>
            </span>
          </Link>
          <h2 className={styles.brandTitle}>
            Your trusted gateway to
            <br />
            Abuja real estate
          </h2>
          <div className={styles.brandFeatures}>
            <div className={styles.brandFeature}>
              <span>✓</span> Verified property owners
            </div>
            <div className={styles.brandFeature}>
              <span>✓</span> Admin-reviewed listings
            </div>
            <div className={styles.brandFeature}>
              <span>✓</span> WhatsApp facilitated deals
            </div>
          </div>
        </div>
      </div>

      <div className={styles.authRight}>
        <div className={styles.authCard}>
          <h1 className={styles.authTitle}>Welcome back</h1>
          <p className={styles.authSub}>
            Sign in to your account to manage listings, track offers, or
            continue browsing.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                id="signin-email"
              />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelRow}>
                <label>Password</label>
                <button
                  type="button"
                  className={styles.forgotLink}
                  onClick={() => alert("Password reset will use Supabase Auth")}
                >
                  Forgot password?
                </button>
              </div>
              <div className={styles.passwordWrap}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  id="signin-password"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: "100%" }}
              id="signin-submit"
            >
              Sign In
            </button>
          </form>

          <div className={styles.dividerRow}>
            <hr className={styles.dividerLine} />
            <span>or</span>
            <hr className={styles.dividerLine} />
          </div>

          <button
            className={`btn btn-secondary btn-lg ${styles.magicLink}`}
            onClick={() => alert("Magic link will use Supabase Auth")}
            id="signin-magic-link"
          >
            ✉️ Sign in with Magic Link
          </button>

          <p className={styles.signupPrompt}>
            Don't have an account?{" "}
            <Link href="/sign-up" className={styles.signupLink}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
