/**
 * Locations registry for emanon.
 * Supported States: Abuja (FCT), Lagos State, Imo State, Enugu State.
 * Includes complete Local Government Areas (LGAs) and prominent residential/commercial localities.
 */

export const SUPPORTED_STATES = [
  {
    id: "abuja",
    name: "Abuja (FCT)",
    shortName: "Abuja",
    localities: [
      "Apo",
      "Asokoro",
      "Bwari",
      "Central Business District",
      "Dakibiyu",
      "Dakwo",
      "Dawaki",
      "Dei-Dei",
      "Duboyi",
      "Durumi",
      "Dutse",
      "Gaduwa",
      "Galadima",
      "Galadimawa",
      "Garki",
      "Garki 2",
      "Gudu",
      "Guzape",
      "Gwagwa",
      "Gwagwalada",
      "Gwarinpa",
      "Idu",
      "Jabi",
      "Jahi",
      "Jikwoyi",
      "Kado",
      "Karmo",
      "Karsana",
      "Karu",
      "Katampe",
      "Katampe Extension",
      "Kaura",
      "Kaida",
      "Ketti",
      "Kubwa",
      "Kugbo",
      "Kuje",
      "Kurudu",
      "Kwali",
      "Kyami",
      "Life Camp",
      "Lokogoma",
      "Lugbe",
      "Mabushi",
      "Maitama",
      "Mpape",
      "Nyanya",
      "Orozo",
      "Pyakasa",
      "Utako",
      "Wumba",
      "Wuse",
      "Wuse 2",
      "Wuye",
    ].sort(),
  },
  {
    id: "lagos",
    name: "Lagos State",
    shortName: "Lagos",
    localities: [
      "Abule Egba",
      "Agege",
      "Agidingbi",
      "Aguda (Surulere)",
      "Agungi (Lekki)",
      "Ajah",
      "Ajao Estate",
      "Alagbado",
      "Alausa (Ikeja)",
      "Alimosho",
      "Amuwo-Odofin",
      "Anthony Village",
      "Apapa",
      "Badagry",
      "Banana Island (Ikoyi)",
      "Bariga",
      "Bogije (Ibeju-Lekki)",
      "Chevron (Lekki)",
      "Dopemu",
      "Ebute Metta",
      "Egbeda",
      "Epe",
      "Festac Town",
      "Gbagada",
      "Ibeju-Lekki",
      "Idumota",
      "Ifako-Ijaiye",
      "Igando",
      "Ijanikin",
      "Ijede",
      "Ijesha",
      "Ikeja",
      "Ikeja GRA",
      "Ikate Elegushi",
      "Ikorodu",
      "Ikotun",
      "Ikoyi",
      "Ilasamaja",
      "Ilupeju",
      "Isheri",
      "Isolo",
      "Ketu",
      "Kosofe",
      "Lagos Island",
      "Lekki Phase 1",
      "Lekki Phase 2",
      "Magodo Phase 1",
      "Magodo Phase 2",
      "Maryland",
      "Mende",
      "Mile 2",
      "Mile 12",
      "Mushin",
      "Obalende",
      "Obanikoro",
      "Ogba",
      "Ogudu",
      "Ojo",
      "Ojodu Berger",
      "Ojota",
      "Ojuelegba",
      "Okokomaiko",
      "Okota",
      "Onikan",
      "Onigbongbo",
      "Oniru",
      "Opebi (Ikeja)",
      "Oregun",
      "Oshodi",
      "Osapa London",
      "Palmgrove",
      "Sangotedo",
      "Shomolu",
      "Surulere",
      "Victoria Garden City (VGC)",
      "Victoria Island (VI)",
      "Yaba",
    ].sort(),
  },
  {
    id: "imo",
    name: "Imo State",
    shortName: "Imo",
    localities: [
      "Aboh Mbaise",
      "Ahiazu Mbaise",
      "Akwakuma (Owerri)",
      "Aladinma Estate (Owerri)",
      "Amakohia (Owerri)",
      "Atta",
      "Egbu",
      "Ehime Mbano",
      "Emekuku",
      "Ezinihitte Mbaise",
      "Federal Housing Estate (Egbu Road)",
      "Ideato North",
      "Ideato South",
      "Ihiagwa (FUTO area)",
      "Ihitte/Uboma",
      "Ikeduru",
      "Ikenegbu Layout (Owerri)",
      "Irete",
      "Isiala Mbano",
      "Isu",
      "Mbaitoli",
      "Nekede",
      "New Owerri",
      "Ngor Okpala",
      "Njaba",
      "Nkwerre",
      "Nwangele",
      "Obinze",
      "Obowo",
      "Oguta",
      "Ohaji/Egbema",
      "Okigwe",
      "Onuimo",
      "Orji (Owerri)",
      "Orlu",
      "Oru East",
      "Oru West",
      "Owerri Municipal",
      "Owerri North",
      "Owerri West",
      "Prefab Layout (Owerri)",
      "Ubulu",
      "Umuaka",
      "Umuguma",
      "Works Layout (Owerri)",
      "World Bank Housing Estate (New Owerri)",
    ].sort(),
  },
  {
    id: "enugu",
    name: "Enugu State",
    shortName: "Enugu",
    localities: [
      "9th Mile Corner",
      "Abakpa Nike",
      "Achara Layout",
      "Agbani",
      "Akwuke",
      "Amechi",
      "Aninri",
      "Asata",
      "Awgu",
      "Coal Camp",
      "Eha-Amufu",
      "Emene",
      "Enugu East",
      "Enugu North",
      "Enugu South",
      "Ezeagu",
      "Gariki (Enugu)",
      "Golf Estate (Enugu)",
      "GRA (Enugu)",
      "Idaw River",
      "Igbo-Etiti",
      "Igbo-Eze North",
      "Igbo-Eze South",
      "Independence Layout",
      "Isi-Uzo",
      "Maryland (Enugu)",
      "New Haven",
      "Nkanu East",
      "Nkanu West",
      "Nsukka",
      "Obiagu",
      "Ogui / Ogui New Layout",
      "Oji River",
      "Premier Layout",
      "Republic Layout",
      "Thinkers Corner",
      "Topland",
      "Trans-Ekulu",
      "Udenu",
      "Udi",
      "Uwani",
      "Uzo-Uwani",
    ].sort(),
  },
];

export const STATE_NAMES = SUPPORTED_STATES.map((s) => s.name);

export const DEFAULT_STATE = "Abuja (FCT)";

// Flat list of all localities across all states
export const ALL_LOCALITIES = SUPPORTED_STATES.flatMap((s) => s.localities).sort();

// Backwards-compatible alias for DEFAULT_DISTRICTS
export const DEFAULT_DISTRICTS = ALL_LOCALITIES;

/**
 * Returns the state name for a given locality
 * @param {string} locality 
 * @returns {string} State Name (e.g. 'Lagos State', 'Imo State', 'Enugu State', 'Abuja (FCT)')
 */
export function getStateForLocality(locality) {
  if (!locality) return DEFAULT_STATE;
  const cleanLoc = locality.trim().toLowerCase();

  for (const state of SUPPORTED_STATES) {
    // Check if the locality name is the state name itself
    if (
      cleanLoc === state.name.toLowerCase() ||
      cleanLoc === state.shortName.toLowerCase() ||
      cleanLoc.includes(state.shortName.toLowerCase())
    ) {
      return state.name;
    }

    const match = state.localities.find((loc) => {
      const locClean = loc.toLowerCase();
      return (
        locClean === cleanLoc ||
        cleanLoc.includes(locClean) ||
        locClean.includes(cleanLoc)
      );
    });

    if (match) {
      return state.name;
    }
  }

  return DEFAULT_STATE;
}

/**
 * Returns the short state name (e.g. 'Abuja', 'Lagos', 'Imo', 'Enugu')
 * @param {string} stateOrLocality 
 * @returns {string}
 */
export function getStateShortName(stateOrLocality) {
  if (!stateOrLocality) return "Abuja";
  const stateName = getStateForLocality(stateOrLocality);
  const found = SUPPORTED_STATES.find(
    (s) => s.name.toLowerCase() === stateName.toLowerCase()
  );
  return found ? found.shortName : "Abuja";
}

/**
 * Returns localities list for a specific state
 * @param {string} stateNameOrId 
 * @returns {string[]}
 */
export function getLocalitiesForState(stateNameOrId) {
  if (!stateNameOrId || stateNameOrId === "all") return ALL_LOCALITIES;
  const clean = stateNameOrId.trim().toLowerCase();
  const state = SUPPORTED_STATES.find(
    (s) =>
      s.id.toLowerCase() === clean ||
      s.name.toLowerCase() === clean ||
      s.shortName.toLowerCase() === clean
  );
  return state ? state.localities : ALL_LOCALITIES;
}
