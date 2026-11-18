"use client";

import { patchListing } from "@/lib/actions";
import type { Issues } from "@/lib/listing-check";
import type { Listing, StepId } from "@/lib/listing";
import type { Me } from "@/lib/store";
import { StepBasics } from "./step-basics";
import { StepGroup } from "./step-group";
import { StepItinerary } from "./step-itinerary";
import { StepPricing } from "./step-pricing";
import { StepReview } from "./step-review";
import { StepSafety } from "./step-safety";
import { StepWhen } from "./step-when";

type Props = { step: StepId; listing: Listing; me: Me; issues: Issues; onEdit: (index: number) => void };

export function StepBody({ step, listing, me, issues, onEdit }: Props) {
  const props = { listing, issues, set: (patch: Partial<Listing>) => patchListing(listing.id, patch) };
  switch (step) {
    case "basics":
      return <StepBasics {...props} />;
    case "when":
      return <StepWhen {...props} />;
    case "itinerary":
      return <StepItinerary {...props} />;
    case "group":
      return <StepGroup {...props} me={me} />;
    case "pricing":
      return <StepPricing {...props} />;
    case "safety":
      return <StepSafety {...props} />;
    case "review":
      return <StepReview listing={listing} me={me} onEdit={onEdit} />;
  }
}
