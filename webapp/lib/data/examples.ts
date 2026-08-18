export interface DemoExample {
  id: string;
  label: string;
  quality: "excellent" | "good" | "average" | "poor" | "very_poor";
  userStory: string;
  acceptanceCriteria: string;
}

export const DEMO_EXAMPLES: DemoExample[] = [
  {
    id: "excellent-password-reset",
    label: "Excellent — Password reset",
    quality: "excellent",
    userStory:
      "As a registered customer, I want to reset my password using my verified email address, so that I can regain access to my account without contacting support.",
    acceptanceCriteria:
      "Given I am a registered customer\nWhen I request a password reset using my registered email address\nThen the system sends a password reset email within 2 minutes\n\nGiven I enter an email address that is not registered\nWhen I request a password reset\nThen the system displays a generic confirmation message without revealing whether the email exists\n\nGiven my password reset link is older than 30 minutes\nWhen I open the link\nThen the system informs me the link has expired and lets me request a new one",
  },
  {
    id: "good-saved-items",
    label: "Good — Save items for later",
    quality: "good",
    userStory:
      "As a returning shopper, I want to move an item from my cart to a saved-for-later list, so that I can keep browsing without losing items I'm not ready to buy.",
    acceptanceCriteria:
      "Given I have at least one item in my cart\nWhen I select \"Save for later\" on an item\nThen the item moves to my saved-for-later list and is removed from my cart total\n\nGiven an item is in my saved-for-later list\nWhen I select \"Move to cart\"\nThen the item returns to my cart at the current price",
  },
  {
    id: "average-refund",
    label: "Average — Request a refund",
    quality: "average",
    userStory: "As a customer I want to get my money back so that I'm satisfied.",
    acceptanceCriteria:
      "Given an eligible order\nWhen I request a refund\nThen I should get my money back quickly",
  },
  {
    id: "poor-export",
    label: "Poor — Export report",
    quality: "poor",
    userStory:
      "As a user I want to export stuff so I can use it elsewhere and it should be easy and fast and support all formats.",
    acceptanceCriteria: "Export should work correctly.",
  },
  {
    id: "very-poor-settings",
    label: "Very poor — Everything settings",
    quality: "very_poor",
    userStory:
      "As a user I want a settings page and also billing and also team management and notifications so that the app is easy and user-friendly and fast.",
    acceptanceCriteria: "The settings page should work well and be intuitive.",
  },
];
