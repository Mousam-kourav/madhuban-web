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
    "Welcome to Madhuban Eco Retreat. This Cookies & Consent Policy explains how we use cookies and similar technologies when you visit our website https://www.madhubanecoretreat.com/ and how you can control your preferences.",

  sections: [
    {
      title: "1. What Are Cookies?",
      content:
        "Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They help us recognize your browser and remember certain information to improve your experience, such as your language preference, personalization settings, and pages you visit. Cookies do not give us access to your personal files or sensitive data on your device.",
    },
    {
      title: "2. Types of Cookies We Use",
      itemsObjects: [
        {
          title: "a. Essential Cookies",
          desc: "These cookies are necessary for the website to function correctly. They enable core features like secure navigation, session management, and booking processes. Without these cookies, parts of the website may not work properly.",
        },
        {
          title: "b. Performance & Analytics Cookies",
          desc: "We use cookies to understand how visitors interact with our site so we can improve performance. These cookies collect anonymous data about page visits, time spent on pages, and website behavior. They help us make the site more efficient and user-friendly.",
        },
        {
          title: "c. Functionality Cookies",
          desc: "These cookies remember your preferences during visits, such as region, language, or other display choices, so you don’t have to reset them each time.",
        },
        {
          title: "d. Advertising & Third-Party Cookies (if any)",
          desc: "Our site may include content and features from third parties (e.g., maps, social media or analytics tools) that use their own cookies. These cookies may track your activity across websites and help tailor marketing and content offers. You can manage or disable these through your browser settings.",
        },
      ],
    },
    {
      title: "3. Your Consent",
      content:
        "By continuing to browse and use our website, you consent to the placement of cookies on your device as described in this policy. If you do not wish to accept cookies, you can change your browser settings to reject or block cookies. However, this may impact your ability to fully use certain features of the site.",
    },
    {
      title: "4. How to Control Cookies",
      content: "Most web browsers allow you to:",
      items: [
        "Accept or reject cookies",
        "Delete existing cookies",
        "Set preferences for specific websites",
      ],
      note: "You can usually find these controls in your browser’s “Settings” or “Preferences” menu. Please refer to your browser provider’s help section for detailed instructions.",
    },
    {
      title: "5. Third-Party Services",
      content:
        "Some services used by our website (e.g., analytics, social integrations or maps) may set cookies on your device. We do not control these cookies and recommend reviewing the privacy policies of those third parties to understand how they use cookies and other tracking technologies.",
    },
    {
      title: "6. Security & Your Data",
      content:
        "Cookies used on our site are managed with appropriate security measures. However, no online method of transmitting or storing information is completely secure, and we cannot guarantee absolute protection.",
    },
    {
      title: "7. Changes to This Policy",
      content:
        "We may update this policy from time to time to reflect changes in technology, legal requirements, or our privacy practices. Updated versions will be posted on this page with a revised Effective Date.",
    },
    {
      title: "8.  Contact Us",
      content:
        "If you have questions about cookies or privacy practices at Madhuban Eco Retreat, please contact us via the Contact Us page on our website.",
    },
  ],
};

export default function Cookie() {
  return (
    <>
      <CustomBanner
        showLogo={true}
        logoSrc="/logo.png"
        title={"Our Cookie Policy"}
        breadcrumbs={[
          {
            name: "Home",
            goesto: "/",
          },
          {
            name: "Cookie Policy",
            goesto: "/cookies-and-consent-policy",
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
              variant="h5"
              component="h2"
              sx={{ fontSize: { xs: "var(--text-lg)", md: "var(--text-xl)" } }}
            >
              {section.title}
            </SectionTitle>

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
                        sx: {
                          lineHeight: 1.6,
                          fontSize: {
                            xs: "var(--text-sm)",
                            md: "var(--text-sm)",
                          },
                        },
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
                  {section.contactInfo.company}
                </Typography>
                <Typography variant="body1" color="#000000">
                  {section.contactInfo.email}
                </Typography>
                <Typography variant="body1" color="#000000">
                  {section.contactInfo.phone}
                </Typography>
              </Box>
            )}

            {section?.itemsObjects?.map((obj, i) => {
              return (
                <Box key={i} sx={{ mb: 4 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: 20,
                      fontWeight: 500,
                      mb: 1,
                      fontSize: {
                        xs: "var(--text-base)",
                        md: "var(--text-base)",
                      },
                    }}
                  >
                    {obj.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: {
                        xs: "var(--text-sm)",
                        md: "var(--text-sm)",
                      },
                    }}
                  >
                    {obj.desc}
                  </Typography>
                </Box>
              );
            })}
          </StyledPaper>
        ))}
      </Container>
    </>
  );
}
