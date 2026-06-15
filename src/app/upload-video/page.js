"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './upload-video.module.css';

const DEFAULT_DISTRICTS = [
  "Maitama", "Asokoro", "Wuse", "Wuse 2", "Garki", "Garki 2", "Jabi", "Gwarinpa", "Apo", 
  "Life Camp", "Lugbe", "Guzape", "Katampe", "Katampe Extension", "Mabushi", "Utako", 
  "Wuye", "Central Business District", "Lokogoma", "Galadimawa", "Kaura", "Durumi", 
  "Kubwa", "Kuje", "Gwagwalada", "Bwari", "Karsana", "Karmo", "Idu", "Karu", "Nyanya", "Jikwoyi"
].sort();

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

export default function UploadVideoPage() {
  const [formData, setFormData] = useState({
    submitter_name: '',
    submitter_whatsapp: '',
    title: '',
    location_area: DEFAULT_DISTRICTS[0],
    price_ngn: '',
    bedrooms: '',
    size_sqm: '',
    transaction_type: 'sale',
    property_type: 'residential',
    description: '',
    title_document: '',
  });

  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');

  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: max 60MB for public uploads to protect bandwidth
    if (file.size > 60 * 1024 * 1024) {
      alert("Video file size must be less than 60MB.");
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      setErrorMsg("Please upload a walkthrough video.");
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setProgressMsg('Uploading walkthrough video (this may take a moment)...');

    try {
      // 1. Upload Video to Supabase Storage
      const videoExt = videoFile.name.split('.').pop();
      const videoFileName = `${Math.random().toString(36).substring(2, 15)}.${videoExt}`;
      const videoFilePath = `gallery/${videoFileName}`;

      const { error: videoUploadErr } = await supabase.storage
        .from('property-media')
        .upload(videoFilePath, videoFile, { cacheControl: '3600', upsert: false });

      if (videoUploadErr) throw new Error("Video upload failed: " + videoUploadErr.message);

      const { data: videoUrlData } = supabase.storage
        .from('property-media')
        .getPublicUrl(videoFilePath);

      const finalVideoUrl = videoUrlData.publicUrl;

      // 2. Build Properties Payload (use a default stunning mansion placeholder cover image)
      setProgressMsg('Submitting listing details...');
      const cleanTitle = formData.title.trim();
      const rawPrice = formData.price_ngn.replace(/[^0-9]/g, '');
      const price = rawPrice ? parseInt(rawPrice, 10) : 0;

      const bedPart = formData.bedrooms ? `${formData.bedrooms}-bedroom-` : '';
      const typePart = slugify(formData.property_type.toLowerCase());
      const areaPart = slugify(formData.location_area.toLowerCase());
      
      let baseSlug = `${bedPart}${typePart}-${areaPart}`;
      if (!baseSlug) baseSlug = slugify(cleanTitle.toLowerCase());
      const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const finalSlug = `${baseSlug}-${suffix}`;

      // Set default cover photo preset (Modern Mansion preset)
      const finalCoverUrl = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200';

      // Append Submitter Contact Information to description narrative for Admin review
      const contactBlock = `\n\n--- SUBMITTER CONTACT DETAILS ---\nName: ${formData.submitter_name}\nWhatsApp: ${formData.submitter_whatsapp}`;
      const fullDescription = formData.description.trim() + contactBlock;

      const propertyPayload = {
        title: cleanTitle,
        slug: finalSlug,
        description: fullDescription,
        district: formData.location_area,
        price_ngn: price,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms, 10) : null,
        bathrooms: null,
        size_sqm: formData.size_sqm ? parseFloat(formData.size_sqm) : null,
        transaction_type: formData.transaction_type,
        property_type: formData.property_type,
        status: 'pending', // Keeps the listing in pending approval state (hidden from public)
        photo: finalCoverUrl,
        features: ['Video Walkthrough Vetted'],
        structure_type: null,
        title_document: formData.title_document || null,
        created_at: new Date().toISOString()
      };

      // 3. Insert Property into properties table
      const { data: propertyInsert, error: propertyError } = await supabase
        .from('properties')
        .insert([propertyPayload])
        .select();

      if (propertyError) throw new Error("Property insert failed: " + propertyError.message);

      // 4. Insert Video URL into property_media table
      if (propertyInsert && propertyInsert[0]) {
        const mediaPayload = [
          {
            property_id: propertyInsert[0].id,
            url: finalCoverUrl,
            is_video: false,
            display_order: 0
          },
          {
            property_id: propertyInsert[0].id,
            url: finalVideoUrl,
            is_video: true,
            display_order: 1
          }
        ];

        const { error: mediaError } = await supabase
          .from('property_media')
          .insert(mediaPayload);

        if (mediaError) {
          console.error("Failed to link video walkthrough to property media registry:", mediaError);
        }
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setLoading(false);
      setProgressMsg('');
    }
  };

  if (success) {
    return (
      <div className={styles.successWrapper}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <i className="fa-solid fa-cloud-circle-check"></i>
          </div>
          <h2 className={styles.successTitle}>Video Submitted Successfully</h2>
          <p className={styles.successText}>
            Thank you! Your property listing and walkthrough video have been successfully uploaded and sent to the administrator for review.
          </p>
          <div className={styles.successAlert}>
            <i className="fa-solid fa-circle-info"></i>
            <span>Your submission is held as <strong>Pending Approval</strong> and will go live once vetted by an admin.</span>
          </div>
          <Link href="/" className={styles.homeBtn}>
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Submit Property Walkthrough</h1>
          <p className={styles.subtitle}>
            Upload a video walkthrough of your property. Vetted listings will go live on the homepage once approved.
          </p>
        </div>

        {errorMsg && (
          <div className={styles.errorAlert}>
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          
          {/* Submitter Details */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <i className="fa-solid fa-user-shield"></i> Submitter Contact Info
            </h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Your Name</label>
                <input
                  type="text"
                  name="submitter_name"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.submitter_name}
                  onChange={handleInputChange}
                  className={styles.input}
                  disabled={loading}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>WhatsApp Phone Number</label>
                <input
                  type="tel"
                  name="submitter_whatsapp"
                  required
                  placeholder="e.g. +2348031234567"
                  value={formData.submitter_whatsapp}
                  onChange={handleInputChange}
                  className={styles.input}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Property Specifications */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <i className="fa-solid fa-list-check"></i> Property Specifications
            </h3>
            <div className={styles.formGroup}>
              <label className={styles.label}>Property Listing Title</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Premium 4 Bedroom Detached Duplex"
                value={formData.title}
                onChange={handleInputChange}
                className={styles.input}
                disabled={loading}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>District Location</label>
                <select
                  name="location_area"
                  value={formData.location_area}
                  onChange={handleInputChange}
                  className={styles.select}
                  disabled={loading}
                >
                  {DEFAULT_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Price (NGN ₦)</label>
                <input
                  type="text"
                  name="price_ngn"
                  required
                  placeholder="e.g. 150,000,000"
                  value={formData.price_ngn}
                  onChange={handleInputChange}
                  className={styles.input}
                  disabled={loading}
                />
              </div>
            </div>

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
                  disabled={loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Size (sqm)</label>
                <input
                  type="number"
                  name="size_sqm"
                  placeholder="e.g. 550"
                  value={formData.size_sqm}
                  onChange={handleInputChange}
                  className={styles.input}
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Transaction Mode</label>
                <select
                  name="transaction_type"
                  value={formData.transaction_type}
                  onChange={handleInputChange}
                  className={styles.select}
                  disabled={loading}
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
                  disabled={loading}
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="multi-purpose">Multi-purpose</option>
                  <option value="land">Land Block</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Title Document</label>
                <select
                  name="title_document"
                  value={formData.title_document}
                  onChange={handleInputChange}
                  className={styles.select}
                  disabled={loading}
                >
                  <option value="">None / Unknown</option>
                  <option value="Certificate of Occupancy (cofo)">Certificate of Occupancy (cofo)</option>
                  <option value="Right of Occupancy (RofO)">Right of Occupancy (RofO)</option>
                  <option value="FCDA Allocation/Approval">FCDA Allocation/Approval</option>
                </select>
              </div>
            </div>
          </div>

          {/* Media uploads */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <i className="fa-solid fa-photo-film"></i> Upload Walkthrough Video
            </h3>
            
            <div className={styles.formRow}>
              {/* Video Walkthrough Upload */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Video Walkthrough (Max 60MB)</label>
                <div className={styles.uploadBox}>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    id="video-file-input"
                    className={styles.fileInput}
                    disabled={loading}
                  />
                  <label htmlFor="video-file-input" className={styles.uploadBoxLabel}>
                    {videoPreview ? (
                      <video src={videoPreview} className={styles.uploadPreview} muted />
                    ) : (
                      <>
                        <i className="fa-solid fa-video"></i>
                        <span>Select Walkthrough Video</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Listing Narrative */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <i className="fa-solid fa-pen-nib"></i> Narrative Description
            </h3>
            <div className={styles.formGroup}>
              <textarea
                name="description"
                required
                rows="4"
                placeholder="Describe the property layout, key selling points, neighborhood details..."
                value={formData.description}
                onChange={handleInputChange}
                className={styles.textarea}
                disabled={loading}
              ></textarea>
            </div>
          </div>

          {/* Submit Action */}
          <div className={styles.submitRow}>
            {loading && (
              <div className={styles.progressTracker}>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>{progressMsg}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`${styles.submitBtn} hover-lift`}
            >
              {loading ? 'Submitting Details...' : 'Submit Walkthrough Listing'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
