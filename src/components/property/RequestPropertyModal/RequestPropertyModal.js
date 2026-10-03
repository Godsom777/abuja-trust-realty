"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { getPropertyRequestLink, getWhatsAppNumber } from '@/lib/whatsapp';
import { SUPPORTED_STATES, getLocalitiesForState } from '@/lib/locations';
import { supabase } from '@/lib/supabase';
import styles from './RequestPropertyModal.module.css';

const TRANSACTION_TYPES = [
  { id: 'sale', label: 'Buy (For Sale)', value: 'Buy (For Sale)' },
  { id: 'rent', label: 'Rent', value: 'For Rent' },
  { id: 'off-plan', label: 'Off-Plan', value: 'Off-Plan Investment' },
  { id: 'shortlet', label: 'Shortlet', value: 'Shortlet / Serviced' },
  { id: 'land', label: 'Land', value: 'Land / Plot' },
];

const PROPERTY_TYPES = [
  "Detached Duplex",
  "Semi-Detached Duplex",
  "Terrace Duplex",
  "Apartment / Flat",
  "Penthouse",
  "Mansion / Villa",
  "Commercial / Office / Plaza",
  "Residential Land / Plot",
  "Commercial Land",
  "Any / Open to Suggestions"
];

const BEDROOM_OPTIONS = [
  { label: 'Any', value: 'any' },
  { label: '1 Bed', value: '1 Bedroom' },
  { label: '2 Beds', value: '2 Bedrooms' },
  { label: '3 Beds', value: '3 Bedrooms' },
  { label: '4 Beds', value: '4 Bedrooms' },
  { label: '5+ Beds', value: '5+ Bedrooms' },
];

export default function RequestPropertyModal({
  isOpen,
  onClose,
  initialContext = {}
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [transactionType, setTransactionType] = useState('Buy (For Sale)');
  const [propertyType, setPropertyType] = useState('Detached Duplex');
  const [state, setState] = useState('Abuja (FCT)');
  const [locality, setLocality] = useState('All Localities');
  const [customLocality, setCustomLocality] = useState('');
  const [bedrooms, setBedrooms] = useState('any');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-fill state whenever modal opens or initialContext changes
  useEffect(() => {
    if (!isOpen) return;

    setSubmitted(false);
    setErrorMsg('');

    // Pre-fill transaction type if provided
    if (initialContext.transactionType) {
      const match = TRANSACTION_TYPES.find(
        (t) => t.id === initialContext.transactionType.toLowerCase()
      );
      if (match) setTransactionType(match.value);
    }

    // Pre-fill state if provided
    if (initialContext.state && initialContext.state !== 'all') {
      const stateMatch = SUPPORTED_STATES.find(
        (s) => s.name.toLowerCase() === initialContext.state.toLowerCase() ||
               s.shortName.toLowerCase() === initialContext.state.toLowerCase()
      );
      if (stateMatch) {
        setState(stateMatch.name);
      }
    }

    // Pre-fill locality/district
    if (initialContext.district && initialContext.district !== 'all' && initialContext.district !== 'All Localities') {
      setLocality(initialContext.district);
    }

    // Pre-fill search query into notes if present
    if (initialContext.searchQuery && initialContext.searchQuery.trim() !== '') {
      setNotes((prev) => prev ? prev : `Looking for: ${initialContext.searchQuery.trim()}`);
    }
  }, [isOpen, initialContext]);

  // Lock body scroll on modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Available localities for chosen state
  const localities = useMemo(() => {
    if (!state || state === 'all') return [];
    return getLocalitiesForState(state);
  }, [state]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter your WhatsApp or phone number.');
      return;
    }

    const finalLocality = locality === '__custom__' || locality === 'Other'
      ? customLocality.trim() || 'Custom Area'
      : locality;

    const requestData = {
      name,
      phone,
      transactionType,
      propertyType,
      state,
      locality: finalLocality,
      bedrooms,
      budget,
      notes
    };

    const waLink = getPropertyRequestLink(requestData);
    setGeneratedLink(waLink);

    // Try logging non-blocking event to Supabase
    try {
      supabase.from('enquiry_log').insert({
        property_title: `Property Request: ${name.trim()} (${propertyType})`,
        property_location: `${finalLocality}, ${state}`,
        enquiry_type: 'property_request',
        currency_shown: 'NGN'
      }).then(() => {}).catch(() => {});
    } catch {
      // safe fallback
    }

    // Open WhatsApp deep link
    window.open(waLink, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Modal Close Icon */}
        <button
          onClick={onClose}
          className={styles.closeBtn}
          aria-label="Close modal"
          type="button"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {submitted ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <i className="fa-brands fa-whatsapp"></i>
            </div>
            <h3 className={styles.successTitle}>Request Sent to WhatsApp!</h3>
            <p className={styles.successDesc}>
              We have generated your customized property specification message. If WhatsApp did not open automatically, tap the button below to continue:
            </p>

            <a
              href={generatedLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.openWaBtn}
            >
              <i className="fa-brands fa-whatsapp"></i>
              Open WhatsApp Chat
            </a>

            <button
              onClick={handleResetAndClose}
              className={styles.doneBtn}
              type="button"
            >
              Done & Close
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.badge}>
                <i className="fa-solid fa-sparkles"></i> Bespoke Property Sourcing
              </div>
              <h2 id="modal-title" className={styles.title}>
                Request A Property
              </h2>
              <p className={styles.subtitle}>
                Can't find exactly what you're looking for? Tell us your specifications and our team will source verified listings directly from vetted owners.
              </p>
            </div>

            {errorMsg && (
              <div className={styles.errorAlert} role="alert">
                <i className="fa-solid fa-circle-exclamation"></i> {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Name & Phone */}
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Your Full Name <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <i className={`fa-regular fa-user ${styles.inputIcon}`}></i>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Adeola Johnson"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    WhatsApp / Phone Number <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWrap}>
                    <i className={`fa-brands fa-whatsapp ${styles.inputIcon}`}></i>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0803 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>

              {/* Purpose / Transaction Type Chips */}
              <div className={styles.field}>
                <label className={styles.label}>Transaction Purpose</label>
                <div className={styles.chipsRow}>
                  {TRANSACTION_TYPES.map((t) => {
                    const isSelected = transactionType === t.value;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTransactionType(t.value)}
                        className={`${styles.chip} ${isSelected ? styles.chipActive : ''}`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Property Type & Bedrooms */}
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Property Type</label>
                  <div className={styles.selectWrap}>
                    <i className={`fa-solid fa-building ${styles.inputIcon}`}></i>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className={styles.select}
                    >
                      {PROPERTY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Bedrooms</label>
                  <div className={styles.selectWrap}>
                    <i className={`fa-solid fa-bed ${styles.inputIcon}`}></i>
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className={styles.select}
                    >
                      {BEDROOM_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* State & Locality */}
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Preferred State</label>
                  <div className={styles.selectWrap}>
                    <i className={`fa-solid fa-map-location-dot ${styles.inputIcon}`}></i>
                    <select
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        setLocality('All Localities');
                        setCustomLocality('');
                      }}
                      className={styles.select}
                    >
                      {SUPPORTED_STATES.map((st) => (
                        <option key={st.id} value={st.name}>
                          {st.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Locality / Neighborhood</label>
                  <div className={styles.selectWrap}>
                    <i className={`fa-solid fa-location-dot ${styles.inputIcon}`}></i>
                    <select
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className={styles.select}
                    >
                      <option value="All Localities">Any in {state}</option>
                      {localities.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                      <option value="__custom__">+ Other / Custom Neighborhood</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* If custom locality selected */}
              {locality === '__custom__' && (
                <div className={styles.field}>
                  <label className={styles.label}>Specify Custom Neighborhood or Estate</label>
                  <div className={styles.inputWrap}>
                    <i className={`fa-solid fa-pen-nib ${styles.inputIcon}`}></i>
                    <input
                      type="text"
                      placeholder="e.g. Katampe Extension, Brains & Hammers Estate..."
                      value={customLocality}
                      onChange={(e) => setCustomLocality(e.target.value)}
                      className={styles.input}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Target Budget */}
              <div className={styles.field}>
                <label className={styles.label}>Target Budget (NGN)</label>
                <div className={styles.inputWrap}>
                  <span className={styles.currencyPrefix}>₦</span>
                  <input
                    type="text"
                    placeholder="e.g. 150,000,000 or 80M - 120M"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Specific Requirements / Notes */}
              <div className={styles.field}>
                <label className={styles.label}>
                  Specific Requirements or Preferences <span className={styles.optional}>(Optional)</span>
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. Needs BQ, swimming pool, clean C of O, paved access road, solar inverter..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={styles.textarea}
                ></textarea>
              </div>

              {/* Footer Actions */}
              <div className={styles.footer}>
                <div className={styles.directWhatsAppInfo}>
                  <i className="fa-brands fa-whatsapp"></i>
                  <span>Opens WhatsApp directly with your request details pre-filled.</span>
                </div>

                <button type="submit" className={styles.submitBtn}>
                  <i className="fa-brands fa-whatsapp"></i>
                  Send Request via WhatsApp
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
