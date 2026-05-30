"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { formatConvertedPrice } from '@/lib/currency';
import Badge from '@/components/ui/Badge/Badge';
import slugify from 'slugify';
import styles from './page.module.css';

const DEFAULT_DISTRICTS = [
  "Maitama", "Asokoro", "Wuse", "Wuse 2", "Garki", "Jabi", "Gwarinpa", "Apo", "Life Camp", "Lugbe"
];

// Presets of stunning architectural houses to seed testing easily!
const COVER_IMAGE_PRESETS = [
  { label: "Modern Abuja Mansion", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200" },
  { label: "Minimalist Villa", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200" },
  { label: "Glass Front Duplex", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200" },
  { label: "Premium Apartment", url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200" }
];

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'create' | 'enquiries'

  // Listings data
  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Enquiries data
  const [enquiries, setEnquiries] = useState([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);

  // Form State for creating a property
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location_area: 'Maitama',
    location_city: 'Abuja',
    price_ngn: '',
    bedrooms: '',
    bathrooms: '',
    size_sqm: '',
    transaction_type: 'sale',
    property_type: 'residential',
    status: 'available',
    cover_image_url: COVER_IMAGE_PRESETS[0].url,
    features: ''
  });
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');



  // Auto passcode validation
  const handleLogin = (e) => {
    e.preventDefault();
    const inputPass = (passcode || '').trim();
    console.log("Passcode attempt in Abode Admin:", inputPass);
    
    if (inputPass === '1238' || inputPass === 'admin1238') {
      setIsAuthenticated(true);
      setAuthError('');
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('abode_admin_session', 'active');
        } catch (err) {
          console.warn("Local storage write blocked by browser settings/sandbox:", err);
        }
      }
    } else {
      setAuthError(`Incorrect administrative passcode.`);
      setPasscode('');
    }
  };

  // Restore session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const session = localStorage.getItem('abode_admin_session');
        if (session === 'active') {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.warn("Local storage read blocked by browser settings/sandbox:", err);
      }
    }
  }, []);

  const handleSignOut = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('abode_admin_session');
      } catch (err) {
        console.warn("Local storage clear blocked by browser settings/sandbox:", err);
      }
    }
  };

  // Fetch Listings
  const fetchListings = async () => {
    setLoadingListings(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setListings(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoadingListings(false);
  };

  // Fetch Enquiries
  const fetchEnquiries = async () => {
    setLoadingEnquiries(true);
    try {
      const { data, error } = await supabase
        .from('enquiry_log')
        .select('*')
        .order('clicked_at', { ascending: false });

      if (data && !error) {
        setEnquiries(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoadingEnquiries(false);
  };

  // Trigger loads on tab switch
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'listings') {
        fetchListings();
      } else if (activeTab === 'enquiries') {
        fetchEnquiries();
      }
    }
  }, [isAuthenticated, activeTab]);

  // Form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Status toggle from the listing grid/row
  const toggleStatus = async (id, currentStatus) => {
    const statusMap = {
      'available': 'reserved',
      'reserved': 'sold',
      'sold': 'available'
    };
    const nextStatus = statusMap[currentStatus] || 'available';

    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: nextStatus })
        .eq('id', id);

      if (!error) {
        setListings(prev => prev.map(item => item.id === id ? { ...item, status: nextStatus } : item));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete action
  const deleteListing = async (id) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (!error) {
        setListings(prev => prev.filter(item => item.id !== id));
        setDeleteId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create listing submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitLoading(true);
    setFormSuccessMessage('');
    setFormErrorMessage('');

    const price = parseFloat(formData.price_ngn);
    if (isNaN(price) || price <= 0) {
      setFormErrorMessage("Please enter a valid price in Naira.");
      setFormSubmitLoading(false);
      return;
    }

    // 1. Generate SEO Slug
    const cleanTitle = formData.title.trim();
    const bedPart = formData.bedrooms ? `${formData.bedrooms}-bedroom-` : '';
    const typePart = slugify(formData.property_type.toLowerCase());
    const areaPart = slugify(formData.location_area.toLowerCase());
    
    let baseSlug = `${bedPart}${typePart}-${areaPart}`;
    if (!baseSlug) baseSlug = slugify(cleanTitle.toLowerCase());
    
    // Add random suffix to ensure absolute slug uniqueness
    const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const finalSlug = `${baseSlug}-${suffix}`;

    // 2. Format features array
    const featuresArray = formData.features
      ? formData.features.split(',').map(f => f.trim()).filter(Boolean)
      : [];

    const dbPayload = {
      title: cleanTitle,
      description: formData.description.trim(),
      location_area: formData.location_area,
      location_city: formData.location_city,
      price_ngn: price,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
      size_sqm: formData.size_sqm ? parseFloat(formData.size_sqm) : null,
      transaction_type: formData.transaction_type,
      property_type: formData.property_type,
      status: formData.status,
      cover_image_url: formData.cover_image_url.trim(),
      features: featuresArray,
      slug: finalSlug,
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([dbPayload])
        .select();

      if (error) {
        throw error;
      }

      setFormSuccessMessage(`Property Listing successfully published! Slug: ${finalSlug}`);
      // Reset form
      setFormData({
        title: '',
        description: '',
        location_area: 'Maitama',
        location_city: 'Abuja',
        price_ngn: '',
        bedrooms: '',
        bathrooms: '',
        size_sqm: '',
        transaction_type: 'sale',
        property_type: 'residential',
        status: 'available',
        cover_image_url: COVER_IMAGE_PRESETS[0].url,
        features: ''
      });
    } catch (err) {
      setFormErrorMessage(err.message || "Failed to publish listing to Supabase.");
    }
    setFormSubmitLoading(false);
  };

  // Authenticate UI lock
  if (!isAuthenticated) {
    return (
      <div className={styles.authGate}>
        <div className={styles.authCard}>
          <div className={styles.authIcon}>
            <i className="fa-solid fa-lock"></i>
          </div>
          <h1 className={styles.authTitle}>Administrative Panel</h1>
          <p className={styles.authSubtitle}>Enter the administrator security code to access control metrics.</p>
          
          <form onSubmit={handleLogin} className={styles.authForm}>
            <input
              type="text"
              autoComplete="off"
              style={{ WebkitTextSecurity: 'disc' }}
              placeholder="Enter passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className={styles.authInput}
              autoFocus
            />
            {authError && <p className={styles.authError}>{authError}</p>}
            
            <button type="submit" className={styles.authBtn}>
              Unlock Control Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      {/* Navigation Header */}
      <header className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <h1 className={styles.headline}>Abode Control</h1>
          <span className={styles.badge}>ADMIN MODE</span>
        </div>
        <button onClick={handleSignOut} className={styles.signOutBtn}>
          <i className="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
        </button>
      </header>

      {/* Tabs list selector */}
      <div className={styles.tabsRow}>
        <button
          onClick={() => setActiveTab('listings')}
          className={`${styles.tabBtn} ${activeTab === 'listings' ? styles.tabActive : ''}`}
        >
          <i className="fa-solid fa-list-check"></i> Manage Listings
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`${styles.tabBtn} ${activeTab === 'create' ? styles.tabActive : ''}`}
        >
          <i className="fa-solid fa-circle-plus"></i> Add Property
        </button>
        <button
          onClick={() => setActiveTab('enquiries')}
          className={`${styles.tabBtn} ${activeTab === 'enquiries' ? styles.tabActive : ''}`}
        >
          <i className="fa-solid fa-chart-line"></i> Enquiry Logs
        </button>
      </div>

      <div className={styles.content}>
        
        {/* Manage Listings TAB */}
        {activeTab === 'listings' && (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Property Registry</h2>
              <span className={styles.counter}>{listings.length} Listings Total</span>
            </div>

            {loadingListings ? (
              <div className={styles.loader}>
                <i className="fa-solid fa-spinner fa-spin"></i> Loading registry...
              </div>
            ) : listings.length === 0 ? (
              <div className={styles.empty}>
                <p>No listings exist in the registry. Head to the 'Add Property' tab to seed listings.</p>
              </div>
            ) : (
              <div className={styles.list}>
                {listings.map((item) => (
                  <div key={item.id} className={styles.listingRow}>
                    <img
                      src={item.cover_image_url || COVER_IMAGE_PRESETS[0].url}
                      alt={item.title}
                      className={item.cover_image_url ? styles.rowThumb : `${styles.rowThumb} ${styles.thumbFallback}`}
                    />
                    
                    <div className={styles.rowInfo}>
                      <h4 className={styles.rowTitle}>{item.title}</h4>
                      <p className={styles.rowSpecs}>
                        {item.location_area} · {formatConvertedPrice(item.price_ngn, 'ngn')} · {item.bedrooms || 0} Bed
                      </p>
                    </div>

                    <div className={styles.rowActions}>
                      {/* Status Toggle Trigger */}
                      <button
                        onClick={() => toggleStatus(item.id, item.status)}
                        className={styles.statusToggleBtn}
                        title="Click to cycle status"
                      >
                        <Badge status={item.status} />
                      </button>

                      {/* Delete Trigger */}
                      {deleteId === item.id ? (
                        <div className={styles.confirmDelete}>
                          <button onClick={() => deleteListing(item.id)} className={styles.confirmBtn}>Confirm</button>
                          <button onClick={() => setDeleteId(null)} className={styles.cancelBtn}>Cancel</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className={styles.deleteBtn}
                          title="Delete Listing"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Property TAB */}
        {activeTab === 'create' && (
          <div className={styles.tabContent}>
            <h2 className={styles.sectionTitle}>Publish New Vetted Property</h2>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              {formSuccessMessage && <div className={styles.successMessage}><i className="fa-solid fa-circle-check"></i> {formSuccessMessage}</div>}
              {formErrorMessage && <div className={styles.errorMessage}><i className="fa-solid fa-circle-exclamation"></i> {formErrorMessage}</div>}

              {/* Title input */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Listing Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Elegant 5 Bedroom Detached Duplex"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              {/* Prices input in Naira */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Price in Naira (NGN)</label>
                  <input
                    type="number"
                    name="price_ngn"
                    required
                    placeholder="e.g. 150000000"
                    value={formData.price_ngn}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                  <small className={styles.inputHelper}>Calculates to: {formData.price_ngn ? formatConvertedPrice(formData.price_ngn, 'usd') : '$0'} USD / {formData.price_ngn ? formatConvertedPrice(formData.price_ngn, 'gbp') : '£0'} GBP</small>
                </div>

                {/* District */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Abuja District</label>
                  <select
                    name="location_area"
                    value={formData.location_area}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    {DEFAULT_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Transaction Type & Property Type */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Transaction Mode</label>
                  <select
                    name="transaction_type"
                    value={formData.transaction_type}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                    <option value="off-plan">Off-Plan</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Category Type</label>
                  <select
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land Block</option>
                  </select>
                </div>
              </div>

              {/* Specifications row */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    placeholder="e.g. 4"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    placeholder="e.g. 5"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Size (sqm)</label>
                  <input
                    type="number"
                    name="size_sqm"
                    placeholder="e.g. 650"
                    value={formData.size_sqm}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Cover Image selector */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Visual Cover Image URL</label>
                <input
                  type="text"
                  name="cover_image_url"
                  required
                  placeholder="Paste Unsplash/Cloudinary link"
                  value={formData.cover_image_url}
                  onChange={handleInputChange}
                  className={styles.input}
                />
                
                {/* Visual presets row */}
                <div className={styles.presetsRow}>
                  {COVER_IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, cover_image_url: preset.url }))}
                      className={`${styles.presetBtn} ${formData.cover_image_url === preset.url ? styles.presetActive : ''}`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Property Narrative Description</label>
                <textarea
                  name="description"
                  required
                  placeholder="Enter deep description details, structural benefits, proximity rules..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className={styles.textarea}
                ></textarea>
              </div>

              {/* Vetted features list */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Vetted Amenities (Comma-separated)</label>
                <input
                  type="text"
                  name="features"
                  placeholder="e.g. 24/7 Power, Fitted Kitchen, Swimming Pool, C of O"
                  value={formData.features}
                  onChange={handleInputChange}
                  className={styles.input}
                />
                <small className={styles.inputHelper}>Separate each custom vetted feature tag with a comma.</small>
              </div>

              <button
                type="submit"
                disabled={formSubmitLoading}
                className={styles.submitBtn}
              >
                {formSubmitLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Publishing to Supabase...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-cloud-arrow-up"></i> Publish Vetted Listing
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Enquiry Logs TAB */}
        {activeTab === 'enquiries' && (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Enquiry Logs Metrics</h2>
              <span className={styles.counter}>{enquiries.length} Inquiries Clicked</span>
            </div>

            {loadingEnquiries ? (
              <div className={styles.loader}>
                <i className="fa-solid fa-spinner fa-spin"></i> Loading logs...
              </div>
            ) : enquiries.length === 0 ? (
              <div className={styles.empty}>
                <p>No user inquiry clicks have occurred yet. Logs are written whenever visitors click WhatsApp CTAs.</p>
              </div>
            ) : (
              <div className={styles.logsTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.colTitle}>Property & Location</div>
                  <div className={styles.colCurr}>Currency</div>
                  <div className={styles.colTime}>Timestamp</div>
                </div>
                
                <div className={styles.tableBody}>
                  {enquiries.map((enq) => {
                    const date = enq.clicked_at 
                      ? new Date(enq.clicked_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Just now';

                    return (
                      <div key={enq.id} className={styles.logRow}>
                        <div className={styles.colTitle}>
                          <strong>{enq.property_title || 'General Enquiry'}</strong>
                          <span className={styles.logLoc}>{enq.property_location || 'General Landing'}</span>
                        </div>
                        <div className={styles.colCurr}>
                          <span className={styles.currTag}>{enq.currency_shown || 'NGN'}</span>
                        </div>
                        <div className={styles.colTime}>{date}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
