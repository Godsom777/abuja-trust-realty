"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { formatConvertedPrice } from '@/lib/currency';
import Badge from '@/components/ui/Badge/Badge';
import slugify from 'slugify';
import styles from './page.module.css';

const DEFAULT_DISTRICTS = [
  "Maitama", "Asokoro", "Wuse", "Wuse 2", "Garki", "Garki 2", "Jabi", "Gwarinpa", "Apo", 
  "Life Camp", "Lugbe", "Guzape", "Katampe", "Katampe Extension", "Mabushi", "Utako", 
  "Wuye", "Central Business District", "Lokogoma", "Galadimawa", "Kaura", "Durumi", 
  "Kubwa", "Kuje", "Gwagwalada", "Bwari", "Karsana", "Karmo", "Idu", "Karu", "Nyanya", "Jikwoyi"
].sort();

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

  // Upload States
  const [coverLoading, setCoverLoading] = useState(false);
  const [galleryUrls, setGalleryUrls] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  // Form State for creating a property
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location_area: 'Maitama',
    location_city: 'Abuja',
    price_ngn: '',
    bedrooms: '',
    size_sqm: '',
    size_hectares: '',
    transaction_type: 'sale',
    property_type: 'residential',
    status: 'available',
    cover_image_url: COVER_IMAGE_PRESETS[0].url,
    features: '',
    structure_type: '',
    custom_structure_type: '',
    title_document: ''
  });
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formSuccessMessage, setFormSuccessMessage] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');

  // Handle Cover Image Upload from Device
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCoverLoading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `cover-${fileName}`;

    try {
      const { data, error } = await supabase.storage
        .from('property-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('property-media')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        cover_image_url: publicUrlData.publicUrl
      }));
    } catch (err) {
      console.error("Cover upload error:", err);
      alert("Failed to upload cover image: " + err.message);
    } finally {
      setCoverLoading(false);
    }
  };

  // Handle Additional Media Uploads (Images & Videos) from Device
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setGalleryLoading(true);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `gallery-${fileName}`;

        const { data, error } = await supabase.storage
          .from('property-media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
          .from('property-media')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrlData.publicUrl);
      }

      setGalleryUrls(prev => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error("Gallery upload error:", err);
      alert("Failed to upload media files: " + err.message);
    } finally {
      setGalleryLoading(false);
    }
  };

  // Auto passcode validation
  const handleLogin = (e) => {
    e.preventDefault();
    const inputPass = (passcode || '').trim();
    console.log("Passcode attempt in Abuja Trust Realty Admin:", inputPass);
    
    if (inputPass === '1238' || inputPass === 'admin1238') {
      setIsAuthenticated(true);
      setAuthError('');
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('abujatrust_admin_session', 'active');
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
        const session = localStorage.getItem('abujatrust_admin_session');
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
        localStorage.removeItem('abujatrust_admin_session');
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
        // Map database fields to ensure safe client rendering
        const mapped = data.map(item => ({
          ...item,
          cover_image_url: item.photo || item.cover_image_url || null,
          location_area: item.district || item.location_area || 'Abuja'
        }));
        setListings(mapped);
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

  // Load listings and enquiries on authentication mount to populate dashboard stats
  useEffect(() => {
    if (isAuthenticated) {
      fetchListings();
      fetchEnquiries();
    }
  }, [isAuthenticated]);

  // Refetch when tabs switch to ensure real-time data freshness
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'listings') {
        fetchListings();
      } else if (activeTab === 'enquiries') {
        fetchEnquiries();
      }
    }
  }, [activeTab]);

  // Form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'size_sqm') {
      const parsed = parseFloat(value);
      const hectaresVal = !isNaN(parsed) && parsed > 0 ? (parsed / 10000).toString() : '';
      setFormData(prev => ({
        ...prev,
        size_sqm: value,
        size_hectares: hectaresVal
      }));
    } else if (name === 'size_hectares') {
      const parsed = parseFloat(value);
      const sqmVal = !isNaN(parsed) && parsed > 0 ? Math.round(parsed * 10000).toString() : '';
      setFormData(prev => ({
        ...prev,
        size_hectares: value,
        size_sqm: sqmVal
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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

  // Handle Edit Trigger
  const handleEditClick = async (item) => {
    setEditingId(item.id);
    setActiveTab('create'); // Switch to the form tab
    
    // Check if the structure_type is one of the dropdown values
    const standardTypes = [
      "Detached Duplex", "Semi-Detached Duplex", "Terrace Duplex",
      "Detached Bungalow", "Semi-Detached Bungalow", "Detached House",
      "Semi-Detached House", "Terrace House", "Bungalow", "Duplex",
      "Terrace", "Penthouse", "Apartment", "Mansion"
    ];
    
    const isStandard = !item.structure_type || standardTypes.includes(item.structure_type);

    // Load listing core fields into formData
    setFormData({
      title: item.title || '',
      description: item.description || '',
      location_area: item.district || item.location_area || 'Maitama',
      location_city: item.location_city || 'Abuja',
      price_ngn: item.price_ngn || '',
      bedrooms: item.bedrooms || '',
      size_sqm: item.size_sqm || '',
      size_hectares: item.size_sqm ? (item.size_sqm / 10000).toString() : '',
      transaction_type: item.transaction_type || 'sale',
      property_type: item.property_type || 'residential',
      status: item.status || 'available',
      cover_image_url: item.photo || item.cover_image_url || COVER_IMAGE_PRESETS[0].url,
      features: item.features ? item.features.join(', ') : '',
      structure_type: item.structure_type ? (isStandard ? item.structure_type : 'Other') : '',
      custom_structure_type: item.structure_type ? (isStandard ? '' : item.structure_type) : '',
      title_document: item.title_document || ''
    });

    // Fetch existing gallery media
    setGalleryLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_media')
        .select('url')
        .eq('property_id', item.id)
        .order('display_order', { ascending: true });

      if (data && !error) {
        setGalleryUrls(data.map(m => m.url));
      } else {
        setGalleryUrls([]);
      }
    } catch (err) {
      console.error("Failed to load gallery for edit:", err);
      setGalleryUrls([]);
    } finally {
      setGalleryLoading(false);
    }
  };

  // Reset form and cancel edit
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      location_area: 'Maitama',
      location_city: 'Abuja',
      price_ngn: '',
      bedrooms: '',
      size_sqm: '',
      size_hectares: '',
      transaction_type: 'sale',
      property_type: 'residential',
      status: 'available',
      cover_image_url: COVER_IMAGE_PRESETS[0].url,
      features: '',
      structure_type: '',
      custom_structure_type: '',
      title_document: ''
    });
    setGalleryUrls([]);
    setFormSuccessMessage('');
    setFormErrorMessage('');
  };

  // Combined Form Submission (Create & Edit)
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

    // Format features array
    const featuresArray = formData.features
      ? formData.features.split(',').map(f => f.trim()).filter(Boolean)
      : [];

    // Fallback cover photo to first gallery media if cover is still the default preset
    let finalCoverUrl = formData.cover_image_url.trim();
    if (finalCoverUrl === COVER_IMAGE_PRESETS[0].url && galleryUrls.length > 0) {
      finalCoverUrl = galleryUrls[0];
    }

    const cleanTitle = formData.title.trim();

    let structureTypeVal = formData.structure_type;
    if (structureTypeVal === 'Other' && formData.custom_structure_type) {
      structureTypeVal = formData.custom_structure_type.trim();
    }

    const dbPayload = {
      title: cleanTitle,
      description: formData.description.trim(),
      district: formData.location_area,
      price_ngn: price,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: null,
      size_sqm: formData.size_sqm ? parseFloat(formData.size_sqm) : null,
      transaction_type: formData.transaction_type,
      property_type: formData.property_type,
      status: formData.status,
      photo: finalCoverUrl,
      features: featuresArray,
      structure_type: structureTypeVal || null,
      title_document: formData.title_document || null
    };

    try {
      if (editingId) {
        // UPDATE existing listing
        const { error } = await supabase
          .from('properties')
          .update(dbPayload)
          .eq('id', editingId);

        if (error) throw error;

        // Clear and rebuild associated gallery media to sync changes
        await supabase
          .from('property_media')
          .delete()
          .eq('property_id', editingId);

        if (galleryUrls.length > 0) {
          const mediaPayload = galleryUrls.map((url, idx) => ({
            property_id: editingId,
            url: url,
            is_video: url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov') || url.includes('/video/') || url.includes('video'),
            display_order: idx
          }));

          const { error: mediaError } = await supabase
            .from('property_media')
            .insert(mediaPayload);

          if (mediaError) {
            console.error("Failed to save property media files to database:", mediaError);
          }
        }

        setFormSuccessMessage(`Property Listing successfully updated!`);
        resetForm();
        fetchListings(); // Refresh registry
      } else {
        // CREATE new listing
        // 1. Generate SEO Slug
        const bedPart = formData.bedrooms ? `${formData.bedrooms}-bedroom-` : '';
        const typePart = slugify(formData.property_type.toLowerCase());
        const areaPart = slugify(formData.location_area.toLowerCase());
        
        let baseSlug = `${bedPart}${typePart}-${areaPart}`;
        if (!baseSlug) baseSlug = slugify(cleanTitle.toLowerCase());
        
        const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
        const finalSlug = `${baseSlug}-${suffix}`;

        const insertPayload = {
          ...dbPayload,
          slug: finalSlug,
          created_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('properties')
          .insert([insertPayload])
          .select();

        if (error) throw error;

        // If additional media files were uploaded, insert them into property_media table
        if (data && data[0] && galleryUrls.length > 0) {
          const mediaPayload = galleryUrls.map((url, idx) => ({
            property_id: data[0].id,
            url: url,
            is_video: url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov') || url.includes('/video/') || url.includes('video'),
            display_order: idx
          }));

          const { error: mediaError } = await supabase
            .from('property_media')
            .insert(mediaPayload);

          if (mediaError) {
            console.error("Failed to save property media files to database:", mediaError);
          }
        }

        setFormSuccessMessage(`Property Listing successfully published! Slug: ${finalSlug}`);
        resetForm();
      }
    } catch (err) {
      setFormErrorMessage(err.message || `Failed to ${editingId ? 'update' : 'publish'} listing to Supabase.`);
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
    <div className={styles.adminLayout}>
      {/* Left Sidebar on Desktop */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.logoGroup}>
            <span className={styles.logoText}>
              ABJ-Realty<span className={styles.logoDot}>.</span>
            </span>
          </div>
          <span className={styles.adminBadge}>ADMIN PORTAL</span>
        </div>

        <nav className={styles.sidebarNav}>
          <button
            onClick={() => setActiveTab('listings')}
            className={`${styles.navBtn} ${activeTab === 'listings' ? styles.navActive : ''}`}
          >
            <i className="fa-solid fa-list-check"></i>
            <span>Manage Listings</span>
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`${styles.navBtn} ${activeTab === 'create' ? styles.navActive : ''}`}
          >
            <i className="fa-solid fa-circle-plus"></i>
            <span>Add Property</span>
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`${styles.navBtn} ${activeTab === 'enquiries' ? styles.navActive : ''}`}
          >
            <i className="fa-solid fa-chart-line"></i>
            <span>Enquiry Logs</span>
          </button>
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.adminProfile}>
            <div className={styles.avatar}><i className="fa-solid fa-user-shield"></i></div>
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>Administrator</span>
              <span className={styles.profileStatus}>Session Active</span>
            </div>
          </div>
          <button onClick={handleSignOut} className={styles.sidebarSignOutBtn}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main dashboard content area */}
      <div className={styles.mainContainer}>
        {/* Mobile Header (only visible on mobile screens) */}
        <header className={styles.mobileHeader}>
          <div className={styles.mobileHeaderLeft}>
            <span className={styles.logoText}>ABJ-Realty<span className={styles.logoDot}>.</span></span>
            <span className={styles.adminBadge}>ADMIN</span>
          </div>
          <button onClick={handleSignOut} className={styles.mobileSignOutBtn} title="Sign Out">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
        </header>

        {/* Mobile navigation row (only visible on mobile screens) */}
        <div className={styles.mobileNavRow}>
          <button
            onClick={() => setActiveTab('listings')}
            className={`${styles.mobileNavBtn} ${activeTab === 'listings' ? styles.mobileNavActive : ''}`}
          >
            <i className="fa-solid fa-list-check"></i>
            <span>Listings</span>
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`${styles.mobileNavBtn} ${activeTab === 'create' ? styles.mobileNavActive : ''}`}
          >
            <i className="fa-solid fa-circle-plus"></i>
            <span>Add Vetted</span>
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`${styles.mobileNavBtn} ${activeTab === 'enquiries' ? styles.mobileNavActive : ''}`}
          >
            <i className="fa-solid fa-chart-line"></i>
            <span>Logs</span>
          </button>
        </div>

        {/* Shared Dashboard Stats Summary Grid */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: '#f5f0e8', color: '#1a1512' }}>
                <i className="fa-solid fa-building"></i>
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Total Listings</span>
                <span className={styles.statValue}>{listings.length}</span>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: '#E8F5EE', color: '#2D7D52' }}>
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Available</span>
                <span className={styles.statValue}>{listings.filter(item => item.status === 'available').length}</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: '#FEF3EC', color: '#C07D4A' }}>
                <i className="fa-solid fa-hourglass-half"></i>
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Reserved/Sold</span>
                <span className={styles.statValue}>{listings.filter(item => item.status === 'reserved' || item.status === 'sold').length}</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: '#eef2ff', color: '#4f46e5' }}>
                <i className="fa-brands fa-whatsapp"></i>
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Enquiry Clicks</span>
                <span className={styles.statValue}>{enquiries.length}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Content Panel */}
        <main className={styles.contentArea}>
          
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
                  {listings.map((item) => {
                    const thumbUrl = item.cover_image_url || COVER_IMAGE_PRESETS[0].url;
                    const isVideo = thumbUrl.endsWith('.mp4') || thumbUrl.endsWith('.webm') || thumbUrl.endsWith('.mov') || thumbUrl.includes('video');
                    return (
                      <div key={item.id} className={styles.listingRow}>
                        {isVideo ? (
                          <video
                            src={thumbUrl}
                            className={styles.rowThumb}
                            muted
                          />
                        ) : (
                          <img
                            src={thumbUrl}
                            alt={item.title}
                            className={item.cover_image_url ? styles.rowThumb : `${styles.rowThumb} ${styles.thumbFallback}`}
                          />
                        )}
                      
                      <div className={styles.rowInfo}>
                        <h4 className={styles.rowTitle}>{item.title}</h4>
                        <p className={styles.rowSpecs}>
                          {item.location_area} · {formatConvertedPrice(item.price_ngn, 'ngn')} · {item.bedrooms || 0} Bed{item.structure_type ? ` · ${item.structure_type}` : ''}
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

                        {/* Edit Action Button */}
                        <button
                          onClick={() => handleEditClick(item)}
                          className={styles.editRowBtn}
                          title="Edit Listing"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
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
                  )})}
                </div>
              )}
            </div>
          )}

          {/* Add Vetted Property TAB */}
          {activeTab === 'create' && (
            <div className={styles.tabContent}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  {editingId ? 'Edit Vetted Listing' : 'Publish Vetted Listing'}
                </h2>
                {editingId && (
                  <span className={styles.editingBadge}>
                    <i className="fa-solid fa-pen-to-square"></i> Editing Mode
                  </span>
                )}
              </div>
              
              <form onSubmit={handleSubmit} className={styles.form}>
                {formSuccessMessage && <div className={styles.successMessage}><i className="fa-solid fa-circle-check"></i> {formSuccessMessage}</div>}
                {formErrorMessage && <div className={styles.errorMessage}><i className="fa-solid fa-circle-exclamation"></i> {formErrorMessage}</div>}

                {/* Section 1: Core Details */}
                <div className={styles.formCard}>
                  <h3 className={styles.formCardTitle}>
                    <i className="fa-solid fa-circle-info"></i> Core Details
                  </h3>
                  <div className={styles.formCardBody}>
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
                  </div>
                </div>

                {/* Section 2: Mode & Classification */}
                <div className={styles.formCard}>
                  <h3 className={styles.formCardTitle}>
                    <i className="fa-solid fa-sliders"></i> Mode & Classification
                  </h3>
                  <div className={styles.formCardBody}>
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
                          <option value="multi-purpose">Multi-purpose</option>
                          <option value="land">Land Block</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Structural Specs */}
                <div className={styles.formCard}>
                  <h3 className={styles.formCardTitle}>
                    <i className="fa-solid fa-ruler-combined"></i> Structural Specifications
                  </h3>
                  <div className={styles.formCardBody}>
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

                      <div className={styles.formGroup}>
                        <label className={styles.label}>Size (hectares)</label>
                        <input
                          type="number"
                          step="any"
                          name="size_hectares"
                          placeholder="e.g. 1.5"
                          value={formData.size_hectares}
                          onChange={handleInputChange}
                          className={styles.input}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow} style={{ marginTop: '10px' }}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Building Design / Structure Type</label>
                        <select
                          name="structure_type"
                          value={formData.structure_type}
                          onChange={handleInputChange}
                          className={styles.select}
                        >
                          <option value="">Select Design (Optional)</option>
                          <option value="Detached Duplex">Detached Duplex</option>
                          <option value="Semi-Detached Duplex">Semi-Detached Duplex</option>
                          <option value="Terrace Duplex">Terrace Duplex</option>
                          <option value="Detached Bungalow">Detached Bungalow</option>
                          <option value="Semi-Detached Bungalow">Semi-Detached Bungalow</option>
                          <option value="Detached House">Detached House</option>
                          <option value="Semi-Detached House">Semi-Detached House</option>
                          <option value="Terrace House">Terrace House</option>
                          <option value="Bungalow">Bungalow</option>
                          <option value="Duplex">Duplex</option>
                          <option value="Terrace">Terrace</option>
                          <option value="Penthouse">Penthouse</option>
                          <option value="Apartment">Apartment</option>
                          <option value="Mansion">Mansion</option>
                          <option value="Other">Other (Custom)</option>
                        </select>
                      </div>

                      {formData.structure_type === 'Other' && (
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Custom Structure Type</label>
                          <input
                            type="text"
                            name="custom_structure_type"
                            placeholder="e.g. Maisonette, Loft..."
                            value={formData.custom_structure_type || ''}
                            onChange={handleInputChange}
                            className={styles.input}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 4: Media & Narrative */}
                <div className={styles.formCard}>
                  <h3 className={styles.formCardTitle}>
                    <i className="fa-solid fa-photo-film"></i> Media & Narrative
                  </h3>
                  <div className={styles.formCardBody}>
                    {/* Cover Image Selector */}
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Visual Cover Image</label>
                      <div className={styles.uploadContainer}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverUpload}
                          className={styles.fileInput}
                          id="cover-upload"
                        />
                        <label htmlFor="cover-upload" className={styles.uploadLabel}>
                          <i className="fa-solid fa-cloud-arrow-up"></i>
                          {coverLoading ? 'Uploading image...' : 'Choose Cover Image from Device'}
                        </label>
                      </div>
                      
                      <div className={styles.inputSpacing}>
                        <span className={styles.orSpan}>— OR paste image URL —</span>
                        <input
                          type="text"
                          name="cover_image_url"
                          required
                          placeholder="Paste Unsplash/Cloudinary link"
                          value={formData.cover_image_url}
                          onChange={handleInputChange}
                          className={styles.input}
                        />
                      </div>
                      
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

                    {/* Additional Property Media Upload */}
                    <div className={styles.formGroup} style={{ marginTop: '10px' }}>
                      <label className={styles.label}>Additional Media (Photos & Videos)</label>
                      <div className={styles.uploadContainer}>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          onChange={handleGalleryUpload}
                          className={styles.fileInput}
                          id="gallery-upload"
                          disabled={galleryLoading}
                        />
                        <label htmlFor="gallery-upload" className={styles.uploadLabel}>
                          <i className="fa-solid fa-photo-film"></i>
                          {galleryLoading ? 'Uploading media...' : 'Upload Photos & Videos from Device'}
                        </label>
                      </div>
                      {galleryUrls.length > 0 && (
                        <div className={styles.mediaPreviewList}>
                          {galleryUrls.map((mediaItem, idx) => {
                            const isVideo = mediaItem.endsWith('.mp4') || mediaItem.endsWith('.webm') || mediaItem.endsWith('.mov') || mediaItem.includes('video');
                            return (
                              <div key={idx} className={styles.mediaPreviewItem}>
                                {isVideo ? (
                                  <video src={mediaItem} className={styles.previewMedia} muted />
                                ) : (
                                  <img src={mediaItem} alt={`Uploaded ${idx + 1}`} className={styles.previewMedia} />
                                )}
                                <button
                                  type="button"
                                  className={styles.removeMediaBtn}
                                  onClick={() => setGalleryUrls(prev => prev.filter((_, i) => i !== idx))}
                                >
                                  <i className="fa-solid fa-circle-xmark"></i>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className={styles.formGroup} style={{ marginTop: '10px' }}>
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
                    <div className={styles.formGroup} style={{ marginTop: '10px' }}>
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

                    {/* Title Document Dropdown */}
                    <div className={styles.formGroup} style={{ marginTop: '10px' }}>
                      <label className={styles.label}>Title Document</label>
                      <select
                        name="title_document"
                        value={formData.title_document}
                        onChange={handleInputChange}
                        className={styles.select}
                      >
                        <option value="">None / Select Title Document</option>
                        <option value="Certificate of Occupancy (cofo)">Certificate of Occupancy (cofo)</option>
                        <option value="Right of Occupancy (RofO)">Right of Occupancy (RofO)</option>
                        <option value="FCDA Allocation/Approval">FCDA Allocation/Approval</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className={styles.formActionsRow}>
                  <button
                    type="submit"
                    disabled={formSubmitLoading}
                    className={styles.submitBtn}
                  >
                    {formSubmitLoading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i> {editingId ? 'Saving Changes...' : 'Publishing Vetted Listing...'}
                      </>
                    ) : (
                      <>
                        <i className={editingId ? 'fa-solid fa-floppy-disk' : 'fa-solid fa-cloud-arrow-up'}></i> {editingId ? 'Save Changes' : 'Publish Vetted Listing'}
                      </>
                    )}
                  </button>
                  
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className={styles.cancelEditBtn}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
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

        </main>
      </div>
    </div>
  );
}
