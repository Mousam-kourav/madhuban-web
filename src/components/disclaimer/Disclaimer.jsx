"use client";

import React from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CustomBanner from "@/common-components/banner/CustomBanner";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  boxShadow: "0 0px 4px rgba(0,0,0,0.2)",
  borderRadius: theme.spacing(0.5),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
}));

const SectionSubTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  fontSize: 18,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: 0,
  paddingRight: 0,
  "&::before": {
    content: '"•"',
    color: "#001538",
    fontWeight: 600,
    position: "absolute",
    left: "8px",
  },
  paddingLeft: theme.spacing(3),
}));

const privacyData = {
  title: "Privacy Policy",
  lastUpdated: "1 August 2025",
  companyName: "VyomEdge",
  website: "info@vyomedge.com",
  description:
    "The website https://www.madhubanecoretreat.com/ is owned and operated by Madhuban Eco Retreat-Somaiya. All information available on this website is provided in good faith to showcase our retreat, experiences, accommodations, facilities, and nature-based offerings. By accessing or using this website, you acknowledge and agree to the terms outlined in this Disclaimer.",

  sections: [
    {
      title: "1. Nature of Information",
      content:
        "The content on this website is intended for general informational and promotional purposes only. While we make reasonable efforts to keep all details accurate and updated, Madhuban Eco Retreat does not guarantee that information such as pricing, availability, itineraries, amenities, activity schedules, wildlife sightings, or descriptions will always be complete, current, or error-free.",
      note: "Details may change due to seasonal conditions, environmental factors, safety considerations, operational requirements, or regulatory guidelines.",
    },
    {
      title: "2. Outdoor Activities & Natural Conditions",
      content:
        "Madhuban Eco Retreat offers nature-based experiences where outdoor conditions and wildlife encounters may vary. Participation in such activities is entirely at the guest’s discretion, and while safety measures are in place, the retreat is not liable for any injury, discomfort, or loss arising from these experiences, except as required by law.",
    },
    {
      title: "3.  Health, Safety & Personal Responsibility",
      content:
        "Guests are responsible for assessing their physical fitness, medical conditions, and personal safety before engaging in any on-site or off-site activity. Any guidance provided by staff is advisory in nature and does not replace individual responsibility or professional medical advice.",
    },
    {
      title: "4.  Images, Videos & Visual Content",
      content:
        "Images, videos, and illustrations on this website are used for representational purposes. Actual views, landscapes, rooms, amenities, flora, fauna, and experiences may differ due to natural changes, seasonal variations, or upgrades.",
    },
    {
      title: "5. Third-Party Links & Services",
      content:
        "This website may include links to third-party platforms such as maps, booking tools, social media, or partner services. Madhuban Eco Retreat does not control or assume responsibility for the content, availability, policies, or practices of these external websites. Accessing third-party links is done at your own risk.",
    },
    {
      title: "6. Website Availability & Technical Accuracy",
      content:
        "We do not warrant that the website will be available at all times or free from technical issues, viruses, or interruptions. Madhuban Eco Retreat is not liable for any temporary unavailability or technical errors that may affect user access.",
    },
    {
      title: "7. Intellectual Property",
      content:
        "All website content, including text, logos, branding elements, images, and layout, is the intellectual property of Madhuban Eco Retreat, unless otherwise stated. Unauthorized reproduction, copying, or commercial use of any content without written permission is prohibited.",
    },
    {
      title: "8. Limitation of Liability",
      content:
        "To the maximum extent permitted by law, Madhuban Eco Retreat shall not be liable for any direct, indirect, incidental, or consequential loss or damage arising from the use of this website, reliance on its content, or participation in experiences described herein.",
    },
    {
      title: "9. Updates to This Disclaimer",
      content: `Madhuban Eco Retreat reserves the right to modify this Disclaimer at any time without prior notice. Continued use of the website signifies acceptance of the updated terms.`,
    },
  ],
};

export default function Disclaimer() {
  return (
    <>
      <CustomBanner
        showLogo={true}
        logoSrc="/logo.png"
        title={"Disclaimer"}
        breadcrumbs={[
          {
            name: "Home",
            goesto: "/",
          },
          {
            name: "Disclaimer",
            goesto: "/disclaimer",
          },
        ]}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <p className="p-text text-justify mb-4">{privacyData.description}</p>
        {/* Privacy Sections */}
        {privacyData.sections.map((section, index) => (
          <StyledPaper key={index} elevation={2}>
            <SectionTitle
              component="h2"
              sx={{ fontSize: { xs: "var(--text-lg)", md: "var(--text-xl)" } }}
            >
              {section.title}
            </SectionTitle>
            {section?.subtitle && (
              <SectionSubTitle component="h6">
                {section.subtitle}
              </SectionSubTitle>
            )}

            {section.content && (
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  fontSize: {
                    xs: "var(--text-sm)",
                    md: "var(--text-sm)",
                  },
                }}
              >
                {section.content}
              </Typography>
            )}

            {section.websiteUrl && (
              <Typography variant="body1" color="primary" sx={{ mb: 2 }}>
                {section.websiteUrl}
              </Typography>
            )}

            {section.additionalContent && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                {section.additionalContent}
              </Typography>
            )}

            {section.items && (
              <List sx={{ py: 0 }}>
                {section.items.map((item, itemIndex) => (
                  <StyledListItem key={itemIndex} disablePadding>
                    <ListItemText
                      primary={item}
                      primaryTypographyProps={{
                        variant: "body1",
                        sx: { lineHeight: 1.6 },
                      }}
                    />
                  </StyledListItem>
                ))}
              </List>
            )}

            {section.subsections &&
              section.subsections.map((subsection, subIndex) => (
                <Box key={subIndex} sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                    {subsection.subtitle}
                  </Typography>
                  <List sx={{ py: 0 }}>
                    {subsection.items.map((item, itemIndex) => (
                      <StyledListItem key={itemIndex} disablePadding>
                        <ListItemText
                          primary={item}
                          primaryTypographyProps={{
                            variant: "body1",
                            sx: { lineHeight: 1.6 },
                          }}
                        />
                      </StyledListItem>
                    ))}
                  </List>
                </Box>
              ))}

            {section.contactEmail && (
              <Typography variant="body1" sx={{ mt: 2, fontStyle: "italic" }}>
                {section.contactEmail}
              </Typography>
            )}

            {section.note && (
              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  fontStyle: "italic",
                  color: "text.secondary",
                  borderLeft: "3px solid #011d4a",
                  pl: 2,
                  py: 1,
                }}
              >
                {section.note}
              </Typography>
            )}

            {section.contactInfo && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {section.contactInfo.title}
                </Typography>

                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {section.contactInfo.company}
                </Typography>

                {section?.contactInfo?.email && (
                  <Stack flexDirection={"row"}>
                    <Typography fontWeight={600} component={"span"}>
                      Email :
                    </Typography>
                    <Typography variant="body1" color="#000000">
                      {section.contactInfo.email}
                    </Typography>
                  </Stack>
                )}

                {section?.contactInfo?.phone && (
                  <Stack flexDirection={"row"}>
                    <Typography fontWeight={600} component={"span"}>
                      Phone :
                    </Typography>
                    <Typography variant="body1" color="#000000">
                      {section.contactInfo.phone}
                    </Typography>
                  </Stack>
                )}
              </Box>
            )}

            {section?.address && (
              <>
                <Typography fontWeight={600} component={"span"}>
                  {section?.address?.companyName}
                </Typography>
                <Typography>{section?.address?.street}</Typography>
                <Typography>{section?.address?.location}</Typography>
                <Typography>{section?.address?.phone}</Typography>
                <Typography>{section?.address?.email}</Typography>
              </>
            )}
          </StyledPaper>
        ))}
      </Container>
    </>
  );
}
