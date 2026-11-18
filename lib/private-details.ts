import { noDetails, type PrivateDetails } from "./people";

/**
 * SAMPLE DATA: the private details of mock members. Every one is fictional.
 * In production these never reach the browser. The server returns them only after it has confirmed
 * an accepted connection between the two members (see lib/asks.ts, detailsFor).
 */
const details: Record<string, PrivateDetails> = {
  divya: { surname: "Ponnappa", company: "Kodagu Trails", area: "Indiranagar", instagram: "@divya.trails" },
  karthik: { surname: "Shetty", company: "Coastline Outdoors", area: "Jayanagar", instagram: "@karthik.walks" },
  meera: { surname: "Iyer", company: "Brightline Consulting", area: "Koramangala", instagram: "@meera.slowtravel" },
  sana: { surname: "Qureshi", company: "Fieldnote Research", area: "Frazer Town", instagram: "@sana.asks" },
  rahul: { surname: "Menon", company: "Tessellate Labs", area: "Whitefield", instagram: "@rahul.debugs" },
  arjun: { surname: "Rao", company: "Lattice Architects", area: "Basavanagudi", instagram: "@arjun.birds" },
  neha: { surname: "Agarwal", company: "Metricly", area: "HSR Layout", instagram: "@neha.playlists" },
  ishaan: { surname: "Kapoor", company: "Parcelpath", area: "Domlur", instagram: "@ishaan.carries.water" },
  tara: { surname: "D'Souza", company: "Freelance illustrator", area: "Richmond Town", instagram: "@tara.draws.trips" },
  kabir: { surname: "Malhotra", company: "Long Take Films", area: "Malleswaram", instagram: "@kabir.chai.stories" },
  zoya: { surname: "Hussain", company: "Align Physio", area: "Banashankari", instagram: "@zoya.stretches" },
  dev: { surname: "Pillai", company: "Independent musician", area: "Ulsoor", instagram: "@dev.ukulele" },
  riya: { surname: "Nair", company: "Crumb & Co", area: "Sadashivanagar", instagram: "@riya.bakes" },
  aditya: { surname: "Kulkarni", company: "Greenwood High", area: "Rajajinagar", instagram: "@aditya.ruins" },
  farah: { surname: "Sheikh", company: "Mehta & Rao Advocates", area: "Cooke Town", instagram: "@farah.finesprint" },
  vikram: { surname: "Reddy", company: "Offline Labs", area: "Sarjapur", instagram: "@vikram.offline" },
  anika: { surname: "Bose", company: "IISc (student)", area: "Yeshwanthpur", instagram: "@anika.botany" },
  sam: { surname: "Fernandes", company: "Inkwell Copy", area: "Cox Town", instagram: "@sam.three.inks" },
};

export function sampleDetails(personId: string): PrivateDetails {
  return details[personId] ?? noDetails;
}
