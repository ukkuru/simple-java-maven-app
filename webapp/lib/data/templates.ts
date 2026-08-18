import type { Template } from "@/types";

export const TEMPLATES: Template[] = [
  {
    id: "ecommerce-cart",
    category: "E-commerce",
    title: "Save items for later",
    quality: "good",
    userStory:
      "As a returning shopper, I want to move an item from my cart to a saved-for-later list, so that I can keep browsing without losing items I'm not ready to buy.",
    acceptanceCriteria:
      "Given I have at least one item in my cart\nWhen I select \"Save for later\" on an item\nThen the item moves to my saved-for-later list and is removed from my cart total\n\nGiven an item is in my saved-for-later list\nWhen I select \"Move to cart\"\nThen the item returns to my cart at the current price",
  },
  {
    id: "banking-transfer-limit",
    category: "Banking",
    title: "Set a daily transfer limit",
    quality: "excellent",
    userStory:
      "As an account holder, I want to set a daily limit on outgoing transfers, so that I can reduce my exposure if my account credentials are ever compromised.",
    acceptanceCriteria:
      "Given I am on the Security Settings page\nWhen I set a daily transfer limit between $100 and $10,000\nThen the new limit is saved and applies to transfers initiated after the change\n\nGiven my daily transfer total would exceed my configured limit\nWhen I attempt an additional transfer\nThen the transfer is blocked and I see the remaining amount available for the day",
  },
  {
    id: "saas-workspace",
    category: "SaaS",
    title: "Everything, all the settings",
    quality: "very_poor",
    userStory:
      "As a user I want a settings page and also billing and also team management and notifications so that the app is easy and user-friendly and fast.",
    acceptanceCriteria: "The settings page should work well and be intuitive.",
  },
  {
    id: "healthcare-appointment",
    category: "Healthcare",
    title: "Reschedule an appointment",
    quality: "good",
    userStory:
      "As a patient, I want to reschedule an upcoming appointment to a different available time slot, so that I don't have to call the clinic to change my visit.",
    acceptanceCriteria:
      "Given I have an upcoming appointment more than 24 hours away\nWhen I select a new available time slot\nThen my appointment is updated and I receive a confirmation email within 5 minutes\n\nGiven my appointment is less than 24 hours away\nWhen I try to reschedule\nThen I see a message explaining rescheduling requires calling the clinic directly",
  },
  {
    id: "mobile-offline-mode",
    category: "Mobile App",
    title: "View content offline",
    quality: "average",
    userStory:
      "As a mobile user, I want to view previously loaded content when I lose internet connection, so that I can keep working without interruption.",
    acceptanceCriteria:
      "Given I have viewed content while online\nWhen my device loses connectivity\nThen I can still see that content\n\nGiven I am offline\nWhen I try to load new content\nThen the app should handle it gracefully",
  },
  {
    id: "auth-password-reset",
    category: "Authentication",
    title: "Reset a forgotten password",
    quality: "excellent",
    userStory:
      "As a registered customer, I want to reset my password using my verified email address, so that I can regain access to my account without contacting support.",
    acceptanceCriteria:
      "Given I am a registered customer\nWhen I request a password reset using my registered email address\nThen the system sends a password reset email within 2 minutes\n\nGiven I enter an email address that is not registered\nWhen I request a password reset\nThen the system displays a generic confirmation message without revealing whether the email exists\n\nGiven my password reset link is older than 30 minutes\nWhen I open the link\nThen the system informs me the link has expired and lets me request a new one",
  },
  {
    id: "payments-refund",
    category: "Payments",
    title: "Request a refund",
    quality: "average",
    userStory:
      "As a customer I want to get my money back so that I'm satisfied.",
    acceptanceCriteria:
      "Given an eligible order\nWhen I request a refund\nThen I should get my money back quickly",
  },
  {
    id: "notifications-digest",
    category: "Notifications",
    title: "Configure a weekly email digest",
    quality: "good",
    userStory:
      "As a subscriber, I want to receive a weekly email digest summarizing my account activity, so that I can stay informed without checking the app every day.",
    acceptanceCriteria:
      "Given I have opted into the weekly digest\nWhen Monday at 8:00 AM in my local time zone arrives\nThen I receive an email summarizing the previous 7 days of activity\n\nGiven I opt out of the weekly digest\nWhen the next scheduled send occurs\nThen I do not receive the email",
  },
  {
    id: "reporting-export",
    category: "Reporting",
    title: "Export a report as CSV",
    quality: "poor",
    userStory:
      "As a user I want to export stuff so I can use it elsewhere and it should be easy and fast and support all formats.",
    acceptanceCriteria: "Export should work correctly.",
  },
  {
    id: "search-filters",
    category: "Search",
    title: "Filter search results by category and price",
    quality: "good",
    userStory:
      "As a shopper, I want to filter search results by category and price range, so that I can find relevant products faster.",
    acceptanceCriteria:
      "Given I have entered a search query\nWhen I select one or more category filters\nThen only results matching those categories are shown\n\nGiven I have search results displayed\nWhen I set a minimum and maximum price\nThen only results within that price range are shown, updated within 1 second",
  },
];

export function getTemplatesByCategory(): Record<string, Template[]> {
  return TEMPLATES.reduce<Record<string, Template[]>>((acc, t) => {
    (acc[t.category] ??= []).push(t);
    return acc;
  }, {});
}
