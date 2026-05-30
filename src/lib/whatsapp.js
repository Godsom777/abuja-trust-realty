import { formatConvertedPrice } from './currency';

const DEFAULT_WHATSAPP_NUMBER = '2348032591590';

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
  const idShort = property.id ? property.id.substring(0, 6).toUpperCase() : 'UNKNOWN';

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
  const template = `Hi, I have an enquiry about your listed properties in Abuja.`;
  const encodedText = encodeURIComponent(template);
  return `https://wa.me/${phone}?text=${encodedText}`;
}
