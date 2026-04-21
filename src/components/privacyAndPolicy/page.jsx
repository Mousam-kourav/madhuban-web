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
import { gmail, phone } from "@/utills/constants";

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
  website: "madhubanresort@somaiya.com",
  description:
    "At Madhuban Eco Retreat, we value your privacy and are committed to protecting your personal information when you interact with us — whether through our website, email, booking forms, contact or signup forms, or other services. This Privacy Policy explains what information we collect, how we use it, and the steps we take to safeguard it.",

  sections: [
    {
      title: "1.Introduction",
      subtitle: "Personal Information You Provide",
      content:
        "When you use our website — for example to sign up, make an inquiry, book a stay, subscribe to newsletters or contact us — you may voluntarily share personal information such as:",
      items: [
        "Your name",
        "Email address",
        "Phone number",
        "Postal address (if provided)",
        "Message or inquiry details",
      ],
      note: "We collect this information only when you provide it directly via forms or email.",
    },
    {
      title: "2. How We Use Your Information",
      content: "We may use your personal data for the following purposes:",
      items: [
        "To respond to your inquiries, bookings, messages or requests",
        "To process and confirm reservations or other services",
        "To send you updates about special offers, packages or promotions (only with your consent)",
        "To improve our website, services and communication",
      ],
      note: "We do not sell or rent your personal information to third parties.",
    },
    {
      title: "3. Cookies and Tracking Technologies",
      content:
        "Our website may use standard tracking technologies like cookies or web beacons to collect anonymous information about your interactions with the site (e.g., pages visited, time spent, referring URL). This helps us improve user experience. You may choose to disable cookies in your browser settings, but some features of the site may not work correctly without them.",
    },
    {
      title: "4. How We Protect Your Data",
      content:
        "We take reasonable security measures to protect your personal information from unauthorized access, loss, or misuse. This includes secure server technology and restricted access to databases.",
      note: "Please note that no method of transmission over the Internet is 100% secure, and while we strive to protect your information, we cannot guarantee absolute security.",
    },
    {
      title: "5. Third-Party Services",
      content:
        "We may use trusted third-party service providers (e.g., email services, analytics tools) to support our website functions, bookings or communication systems. These services help us operate and maintain the site but are bound to protect your information and not use it for their own purposes.",
    },
    {
      title: "6. Your Rights",
      content: "You have the right to:",
      items: [
        " Access the personal information we hold about you",
        "Request corrections or updates to your data",
        "Unsubscribe from future communications",
      ],
      contactInfo: {
        title:
          "If you wish to exercise any of these rights, please contact us at:",
        email: "madhubanresort@somaiya.com",
        phone: `+${phone}`,
      },
    },
    {
      title: "7. Children’s Privacy",
      content:
        "Our website and services are not intended for children under the age of 13, and we do not knowingly collect personal information from minors.",
    },
    {
      title: "8. Changes to This Policy",
      content:
        "We may update this Privacy Policy from time to time. Any changes will be posted here with a revised date. We encourage you to review this page periodically.",
    },
    {
      title: "9. Contact Us",
      content: `If you have any questions about this Privacy Policy, feel free to reach out to us:`,
      address: {
        companyName: "Madhuban Eco Retreat",
        street: "Sarkanpur, Road, Dongri, Near Ratapani Wildlife Sanctuary",
        location: "Bhopal, Madhya Pradesh, India- 466446",
        phone: `+${phone}`,
        email: gmail,
      },
    },
  ],
};

export default function PrivacyPolicy() {
  return (
    <>
      <CustomBanner
        showLogo={true}
        logoSrc="/logo.png"
        title={"Our Privacy Policy"}
        breadcrumbs={[
          {
            name: "Home",
            goesto: "/",
          },
          {
            name: "Privacy policy",
            goesto: "/privacy-policy",
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
              <SectionSubTitle
                component="h3"
                sx={{
                  fontSize: { xs: "var(--text-base)", md: "var(--text-base)" },
                }}
              >
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
                        fontSize: {
                          xs: "var(--text-sm)",
                          md: "var(--text-sm)",
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
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    fontSize: {
                      xs: "var(--text-sm)",
                      md: "var(--text-sm)",
                    },
                  }}
                >
                  {section.contactInfo.title}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    fontSize: {
                      xs: "var(--text-sm)",
                      md: "var(--text-sm)",
                    },
                  }}
                >
                  {section.contactInfo.company}
                </Typography>

                {section?.contactInfo?.email && (
                  <Stack flexDirection={"row"} gap={1}>
                    <Typography
                      fontWeight={600}
                      component={"span"}
                      sx={{
                        fontSize: {
                          xs: "var(--text-sm)",
                          md: "var(--text-sm)",
                        },
                      }}
                    >
                      Email :
                    </Typography>
                    <Typography
                      variant="body1"
                      color="#000000"
                      sx={{
                        fontSize: {
                          xs: "var(--text-sm)",
                          md: "var(--text-sm)",
                        },
                      }}
                    >
                      {section.contactInfo.email}
                    </Typography>
                  </Stack>
                )}

                {section?.contactInfo?.phone && (
                  <Stack flexDirection={"row"} gap={1}>
                    <Typography
                      fontWeight={600}
                      component={"span"}
                      sx={{
                        fontSize: {
                          xs: "var(--text-sm)",
                          md: "var(--text-sm)",
                        },
                      }}
                    >
                      Phone :
                    </Typography>
                    <Typography
                      variant="body1"
                      color="#000000"
                      sx={{
                        fontSize: {
                          xs: "var(--text-sm)",
                          md: "var(--text-sm)",
                        },
                      }}
                    >
                      {section.contactInfo.phone}
                    </Typography>
                  </Stack>
                )}
              </Box>
            )}

            {section?.address && (
              <>
                <Typography
                  fontWeight={600}
                  component={"span"}
                  sx={{
                    fontSize: {
                      xs: "var(--text-sm)",
                      md: "var(--text-sm)",
                    },
                  }}
                >
                  {section?.address?.companyName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: {
                      xs: "var(--text-sm)",
                      md: "var(--text-sm)",
                    },
                  }}
                >
                  {section?.address?.street}
                </Typography>
                <Typography
                  sx={{
                    fontSize: {
                      xs: "var(--text-sm)",
                      md: "var(--text-sm)",
                    },
                  }}
                >
                  {section?.address?.location}
                </Typography>
                <Typography
                  sx={{
                    fontSize: {
                      xs: "var(--text-sm)",
                      md: "var(--text-sm)",
                    },
                  }}
                >
                  {section?.address?.phone}
                </Typography>
                <Typography
                  sx={{
                    fontSize: {
                      xs: "var(--text-sm)",
                      md: "var(--text-sm)",
                    },
                  }}
                >
                  {section?.address?.email}
                </Typography>
              </>
            )}
          </StyledPaper>
        ))}
      </Container>
    </>
  );
}
