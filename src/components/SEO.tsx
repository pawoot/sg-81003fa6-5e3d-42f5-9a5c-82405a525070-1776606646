import Head from "next/head";
import { Fragment } from "react";

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const defaultSEO: SEOProps = {
  title: "PolicyWatch Thailand | ติดตามนโยบายรัฐบาลอนุทิน 2",
  description: "ติดตามความคืบหน้านโยบาย 23 ข้อของรัฐบาลอนุทิน ชาญวีรกูล แบบเรียลไทม์ ตรวจสอบคำมั่นสัญญา \"พูดแล้วทำ\" ได้ที่นี่",
  image: "/og-image.png",
  url: "https://policywatch-thailand.vercel.app",
};

export function SEOElements(props?: SEOProps) {
  const seo = { ...defaultSEO, ...props };
  
  return (
    <Fragment>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
    </Fragment>
  );
}

export function SEO(props?: SEOProps) {
  const seo = { ...defaultSEO, ...props };
  
  return (
    <Head>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
    </Head>
  );
}