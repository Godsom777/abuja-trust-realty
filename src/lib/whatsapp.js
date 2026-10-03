import { formatConvertedPrice } from './currency';

const DEFAULT_WHATSAPP_NUMBER = '2349041983976';

/**
 * Returns the configured WhatsApp number from environment variables
 * @returns {string}
 */
export function getWhatsAppNumber() {
  const envNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!envNum) return DEFAULT_WHATSAPP_NUMBER;
  // Strip any leading + or non-numeric characters just in case
  return envNum.replace(/[^0-9]/g, '');
}

/**
 * Generates a WhatsApp deep link for a specific property inquiry
 * @param {Object} property 
 * @param {'ngn' | 'usd' | 'gbp'} currency 
 * @returns {string}
 */
export function getPropertyEnquiryLink(property, currency = 'ngn') {
  if (!property) return getGeneralEnquiryLink();

  const phone = getWhatsAppNumber();
  const title = property.title || 'Property';
  const area = property.location_area || property.district || 'Abuja';
  const city = property.location_city || 'Abuja';
  const idStr = property.id != null ? String(property.id) : '';
  const idShort = idStr ? (idStr.length > 8 ? idStr.substring(0, 6).toUpperCase() : idStr.padStart(4, '0')) : 'UNKNOWN';

  // Format the price in the active user currency preference
  const priceFormatted = property.price_ngn 
    ? formatConvertedPrice(property.price_ngn, currency, false)
    : 'Price on Enquiry';

  const template = `Hi, I'm interested in *${title} – ${area}, ${city}*\nPrice: ${priceFormatted}\nRef: #PROP-${idShort}\n\nCould we discuss further?`;
  
  const encodedText = encodeURIComponent(template);
  return `https://wa.me/${phone}?text=${encodedText}`;
}

/**
 * Generates a WhatsApp deep link for general inquiries
 * @returns {string}
 */
export function getGeneralEnquiryLink() {
  const phone = getWhatsAppNumber();
  const template = `Hi, I have an enquiry about your listed properties.`;
  const encodedText = encodeURIComponent(template);
  return `https://wa.me/${phone}?text=${encodedText}`;
}

/**
 * Generates a WhatsApp deep link for a bespoke property request submission
 * @param {Object} data
 * @returns {string}
 */
export function getPropertyRequestLink({
  name = '',
  phone = '',
  transactionType = '',
  propertyType = '',
  state = '',
  locality = '',
  bedrooms = '',
  budget = '',
  notes = ''
} = {}) {
  const waNumber = getWhatsAppNumber();
  
  const lines = [
    `*PROPERTY REQUEST — emanon.*`,
    `━━━━━━━━━━━━━━━━━━━━`,
  ];

  if (name.trim()) lines.push(`👤 *Client:* ${name.trim()}`);
  if (phone.trim()) lines.push(`📞 *WhatsApp / Phone:* ${phone.trim()}`);
  if (transactionType) lines.push(`🎯 *Purpose:* ${transactionType}`);
  if (propertyType) lines.push(`🏢 *Property Type:* ${propertyType}`);

  const loc = [locality, state]
    .filter(Boolean)
    .filter(val => val !== 'all' && val !== 'All Localities' && val !== 'All States')
    .join(', ');
  if (loc) lines.push(`📍 *Preferred Location:* ${loc}`);

  if (bedrooms && bedrooms !== 'any') {
    lines.push(`🛏 *Bedrooms:* ${bedrooms}`);
  }

  if (budget.trim()) lines.push(`💰 *Target Budget:* ${budget.trim()}`);
  if (notes.trim()) lines.push(`📝 *Additional Details:* ${notes.trim()}`);

  lines.push(`━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`_Hello emanon team, I am searching for a property matching these specifications. Please let me know what verified listings or off-market options are available._`);

  const encodedText = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${waNumber}?text=${encodedText}`;
}
