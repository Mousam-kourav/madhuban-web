import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import Link from "next/link";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";

const CustomBanner = ({
  title,
  subtitle,
  sx = {},
  textAlign = "center",
  padding = 8,
  breadcrumbs,
  ...props
}) => {
  return (
    <Grid
      overflow={"hidden"}
      alignItems="center"
      textAlign={textAlign}
      padding={10}
      paddingBottom={5}
      paddingLeft={2}
      paddingRight={2}
      sx={{
        background: "#FFFDEB",
        overflow: "hidden",
        ...sx,
      }}
      {...props}
    >
      <Typography
        variant="h1"
        component="h1"
        sx={{
          fontFamily: "sen, sans-serif",
          whiteSpace: "wrap",
          marginTop: 4,
          lineHeight: "130%",
          color: "#322C3E",
          fontWeight: "bold",
          fontSize: { xs: "var(--text-xl)", md: "var(--text-3xl)" },
          paddingTop: { lg: 5, md: 5, sm: 3, sx: 2 },
        }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontFamily: "sen, sans-serif",
            whiteSpace: "wrap",
            lineHeight: "130%",
            color: "#443B56",
            fontSize: { xs: "20px", sm: "22px", md: "24px", lg: "24px" },
            mt: 2,
            color: "#333",
          }}
        >
          {subtitle}
        </Typography>
      )}

      <Box
        sx={{
          borderRadius: "4px",
          display: "flex",
          width: "fit-content",
          padding: "4px 20px",
          justifySelf: "center",
          marginTop: "10px",
          cursor: "default",
        }}
      >
        {breadcrumbs?.map((val, index) => (
          <React.Fragment key={val.goesto}>
            <Link href={val.goesto}>
              <Box
                component="span"
                sx={{
                  fontFamily: "sen, sans-serif",
                  cursor: index == 0 ? "pointer" : "default",
                  fontSize: { xs: "var(--text-sm)" },
                }}
              >
                {val.name}
              </Box>
            </Link>
            {index < breadcrumbs.length - 1 && (
              <Box component="span" sx={{ mx: 1 }}>
                /
              </Box>
            )}
          </React.Fragment>
        ))}
      </Box>
    </Grid>
  );
};

export default CustomBanner;
