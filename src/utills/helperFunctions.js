export const generateMataDataForSEO = ({
  title = "",
  description = "",
  keywords = [],
  canonicalEndpoint = "/",
  ogImages = [],
  robots = {},
}) => {
  const baseUrl = "https://www.madhubanecoretreat.com";

  const generateOGImage = (urls = []) => {
    if (!urls || !urls.length) return [];
    return urls.map((url) => {
      return { url };
    });
  };

  return {
    title: title,
    description: description,
    keywords: keywords,
    alternates: {
      canonical: `${baseUrl}${canonicalEndpoint}`,
    },
    openGraph: {
      title: title,
      description: description,
      url: `${baseUrl}${canonicalEndpoint}`,
      images: generateOGImage(ogImages),
    },
    robots: robots,
  };
};

export function getAltFromUrl(url) {
  if (!url) return "";

  const fileName = url.split("/").pop();
  let name = fileName.replace(/\.[^/.]+$/, "");

  // remove last random cloudinary hash (like _lbzlrg)
  name = name.replace(/_[a-z0-9]+$/i, "");

  return name.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}
