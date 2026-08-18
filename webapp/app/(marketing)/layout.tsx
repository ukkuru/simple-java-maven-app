import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { JsonLd } from "@/components/marketing/json-ld";
import { ORG, SITE_URL } from "@/lib/seo/site";

const ORGANIZATION_WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: ORG.name,
      alternateName: "QPulse by TestMetry",
      url: ORG.url,
      description:
        "TestMetry builds tools and training for software testing, test automation and requirements quality.",
      founder: {
        "@type": "Person",
        name: ORG.founder,
        email: ORG.email,
      },
      email: ORG.email,
      telephone: "+91-9895780269",
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: ORG.email,
          telephone: "+91-9895780269",
          availableLanguage: ["English"],
          areaServed: "Worldwide",
        },
      ],
      sameAs: [ORG.linkedin, ORG.twitter, ORG.instagram],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "QPulse",
      description: "User story and acceptance criteria quality analyzer",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
  ],
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={ORGANIZATION_WEBSITE_SCHEMA} />
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
