import type { Source } from './types'

const wiki = (id: string, article: string, title: string): Source => ({
  id,
  title,
  publisher: 'Wikipedia',
  url: `https://en.wikipedia.org/wiki/${article}`,
  kind: 'reference',
})

/**
 * Source registry. Facts cite these by id.
 *
 * Wikipedia articles are used as reference aggregators: each figure there carries
 * its own footnote to manufacturer, government or press sources, which readers can
 * follow. Official pages are cited directly where they publish the figure.
 */
const list: Source[] = [
  // Official / government
  {
    id: 'usaf-f16',
    title: 'F-16 Fighting Falcon fact sheet',
    publisher: 'U.S. Air Force',
    url: 'https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104505/f-16-fighting-falcon/',
    kind: 'government',
  },
  {
    id: 'usaf-f22',
    title: 'F-22 Raptor fact sheet',
    publisher: 'U.S. Air Force',
    url: 'https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104506/f-22-raptor/',
    kind: 'government',
  },
  {
    id: 'usaf-f15',
    title: 'F-15 Eagle fact sheet',
    publisher: 'U.S. Air Force',
    url: 'https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104501/f-15-eagle/',
    kind: 'government',
  },
  {
    id: 'usaf-f35a',
    title: 'F-35A Lightning II fact sheet',
    publisher: 'U.S. Air Force',
    url: 'https://www.af.mil/About-Us/Fact-Sheets/Display/Article/478441/f-35a-lightning-ii/',
    kind: 'government',
  },
  {
    id: 'lm-f35',
    title: 'F-35 Lightning II',
    publisher: 'Lockheed Martin',
    url: 'https://www.lockheedmartin.com/en-us/products/f-35.html',
    kind: 'manufacturer',
  },
  {
    id: 'nmusaf-f4',
    title: 'McDonnell Douglas F-4C Phantom II',
    publisher: 'National Museum of the U.S. Air Force',
    url: 'https://www.nationalmuseum.af.mil/Visit/Museum-Exhibits/Fact-Sheets/Display/Article/195821/mcdonnell-douglas-f-4c-phantom-ii/',
    kind: 'museum',
  },
  {
    id: 'nmusaf-mig21',
    title: 'Mikoyan-Gurevich MiG-21F-13 Fishbed C',
    publisher: 'National Museum of the U.S. Air Force',
    url: 'https://www.nationalmuseum.af.mil/Visit/Museum-Exhibits/Fact-Sheets/Display/Article/195971/mikoyan-gurevich-mig-21f-13-fishbed-c/',
    kind: 'museum',
  },
  {
    id: 'nmusaf-mig29',
    title: 'Mikoyan-Gurevich MiG-29A Fulcrum',
    publisher: 'National Museum of the U.S. Air Force',
    url: 'https://www.nationalmuseum.af.mil/Visit/Museum-Exhibits/Fact-Sheets/Display/Article/195970/mikoyan-gurevich-mig-29a-fulcrum/',
    kind: 'museum',
  },
  {
    id: 'dassault-rafale',
    title: 'Rafale',
    publisher: 'Dassault Aviation',
    url: 'https://www.dassault-aviation.com/en/defense/rafale/',
    kind: 'manufacturer',
  },
  {
    id: 'eurofighter',
    title: 'The Aircraft',
    publisher: 'Eurofighter GmbH',
    url: 'https://www.eurofighter.com/the-aircraft',
    kind: 'manufacturer',
  },
  {
    id: 'saab-gripen',
    title: 'Gripen C/D',
    publisher: 'Saab',
    url: 'https://www.saab.com/products/gripen-c-series',
    kind: 'manufacturer',
  },

  // Reference articles
  wiki('wiki-kf21', 'KAI_KF-21_Boramae', 'KAI KF-21 Boramae'),
  wiki('wiki-su57', 'Sukhoi_Su-57', 'Sukhoi Su-57'),
  wiki('wiki-j20', 'Chengdu_J-20', 'Chengdu J-20'),
  wiki('wiki-f35', 'Lockheed_Martin_F-35_Lightning_II', 'Lockheed Martin F-35 Lightning II'),
  wiki('wiki-tejas', 'HAL_Tejas', 'HAL Tejas'),
  wiki('wiki-jf17', 'PAC_JF-17_Thunder', 'PAC JF-17 Thunder'),
  wiki('wiki-f22', 'Lockheed_Martin_F-22_Raptor', 'Lockheed Martin F-22 Raptor'),
  wiki('wiki-j10', 'Chengdu_J-10', 'Chengdu J-10'),
  wiki('wiki-typhoon', 'Eurofighter_Typhoon', 'Eurofighter Typhoon'),
  wiki('wiki-su30mki', 'Sukhoi_Su-30MKI', 'Sukhoi Su-30MKI'),
  wiki('wiki-rafale', 'Dassault_Rafale', 'Dassault Rafale'),
  wiki('wiki-super-hornet', 'Boeing_F/A-18E/F_Super_Hornet', 'Boeing F/A-18E/F Super Hornet'),
  wiki('wiki-gripen', 'Saab_JAS_39_Gripen', 'Saab JAS 39 Gripen'),
  wiki('wiki-su27', 'Sukhoi_Su-27', 'Sukhoi Su-27'),
  wiki('wiki-mirage2000', 'Dassault_Mirage_2000', 'Dassault Mirage 2000'),
  wiki('wiki-mig29', 'Mikoyan_MiG-29', 'Mikoyan MiG-29'),
  wiki('wiki-f16', 'General_Dynamics_F-16_Fighting_Falcon', 'General Dynamics F-16 Fighting Falcon'),
  wiki('wiki-tornado', 'Panavia_Tornado', 'Panavia Tornado'),
  wiki('wiki-f15', 'McDonnell_Douglas_F-15_Eagle', 'McDonnell Douglas F-15 Eagle'),
  wiki('wiki-f14', 'Grumman_F-14_Tomcat', 'Grumman F-14 Tomcat'),
  wiki('wiki-f4', 'McDonnell_Douglas_F-4_Phantom_II', 'McDonnell Douglas F-4 Phantom II'),
  wiki('wiki-mig21', 'Mikoyan-Gurevich_MiG-21', 'Mikoyan-Gurevich MiG-21'),
  wiki('wiki-f86', 'North_American_F-86_Sabre', 'North American F-86 Sabre'),
  wiki('wiki-mig15', 'Mikoyan-Gurevich_MiG-15', 'Mikoyan-Gurevich MiG-15'),
]

export const sources: Record<string, Source> = Object.fromEntries(list.map((s) => [s.id, s]))
export const sourceList = list
