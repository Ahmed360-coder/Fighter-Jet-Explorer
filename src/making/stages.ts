/**
 * "How it's made": a general, public overview of how modern fighter aircraft
 * are produced. It describes no specific factory process and gives no
 * actionable manufacturing detail.
 */

export type StageId = 'design' | 'fabrication' | 'integration' | 'assembly' | 'ground' | 'flight'

export interface Stage {
  id: StageId
  title: string
  /** Short line under the title. */
  kicker: string
  summary: string
  points: string[]
  /** Describes what the illustration shows at this stage, for screen readers and the caption. */
  figure: string
}

export const STAGES: readonly Stage[] = [
  {
    id: 'design',
    title: 'Design and testing',
    kicker: 'From a requirement to a digital aircraft',
    summary:
      'Every fighter starts as a list of what an air force needs it to do. Engineers turn that list into a shape, a weight and a set of systems long before any metal is cut.',
    points: [
      'Designers trade speed, range, payload, stealth and cost against each other, then refine the shape with computer simulations of airflow.',
      'Scale models go into wind tunnels to check how air moves over the wings, intakes and tail.',
      'The whole aircraft is first built as a detailed 3D computer model, so thousands of parts can be checked for fit before any of them exist.',
    ],
    figure: 'A wireframe outline with airflow lines passing over it: at this stage the aircraft exists only as a digital model.',
  },
  {
    id: 'fabrication',
    title: 'Airframe fabrication',
    kicker: 'Making the major pieces',
    summary:
      'The airframe is made as separate major sections: nose, forward, centre and aft fuselage, wings and tail surfaces. They are often built in different factories, sometimes in different countries.',
    points: [
      'Frames, spars and bulkheads are machined from aluminium and titanium. Many skins and panels are carbon-fibre composite, cured under heat and pressure.',
      'Each part is measured against the digital model before it moves on.',
      'Large programmes share the work among many suppliers, who ship finished sections to one final assembly site.',
    ],
    figure: 'The outline split into its major sections, spread apart and unpainted.',
  },
  {
    id: 'integration',
    title: 'Subsystem integration',
    kicker: 'Filling the sections',
    summary:
      'While the sections are still open and easy to reach, they are fitted with the systems that make the aircraft work.',
    points: [
      'Wiring looms, hydraulic lines, fuel tanks and pipes, and cooling and pressurisation systems go in section by section.',
      'Avionics, the radar, the cockpit with its displays and ejection seat, and the landing gear are installed and connected.',
      'Systems are checked inside each section before the joins close off easy access.',
    ],
    figure: 'The separated sections with wiring, fuel tanks, the cockpit, radar and engine shown inside them.',
  },
  {
    id: 'assembly',
    title: 'Final assembly',
    kicker: 'Joining it together',
    summary: 'In final assembly the major sections are brought together in large fixtures and joined into a single airframe.',
    points: [
      'Laser and optical measuring systems line the sections up before they are fastened together.',
      'Wiring, fuel and hydraulic connections are made up across each join.',
      'The engine, canopy and remaining panels go on, followed by paint or, on stealth aircraft, special surface coatings.',
    ],
    figure: 'The sections sliding together into one airframe, with the joins highlighted.',
  },
  {
    id: 'ground',
    title: 'Ground testing',
    kicker: 'Proving it before it flies',
    summary: 'A finished aircraft is powered up and tested on the ground long before it takes off.',
    points: [
      'Electrical, hydraulic, fuel and flight-control systems are checked, and the fuel system is tested for leaks.',
      'Engines are run in a test area or a noise-suppressing hangar, then the aircraft taxis under its own power.',
      'For a new design, separate test airframes are loaded on rigs to prove their strength and fatigue life, sometimes until they break.',
    ],
    figure: 'The complete aircraft with its engine running and test points being checked around the airframe.',
  },
  {
    id: 'flight',
    title: 'Flight testing',
    kicker: 'Expanding the envelope',
    summary:
      'Test pilots fly a new design step by step, taking speed, altitude and manoeuvres a little further on each flight.',
    points: [
      'Prototypes carry extra instruments that stream measurements to engineers on the ground.',
      'A new type flies for years, over many test flights, before it is cleared for service.',
      'Every production aircraft also flies acceptance flights before it is handed over to its air force.',
    ],
    figure: 'The aircraft in flight, sending telemetry back to the ground.',
  },
]

/** Keyboard navigation for the stage tabs: arrows step, Home and End jump. Returns undefined for other keys. */
export function stepFromKey(current: number, key: string, count: number): number | undefined {
  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return Math.min(count - 1, current + 1)
    case 'ArrowLeft':
    case 'ArrowUp':
      return Math.max(0, current - 1)
    case 'Home':
      return 0
    case 'End':
      return count - 1
    default:
      return undefined
  }
}
