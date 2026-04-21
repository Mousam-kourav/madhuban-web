"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import CloseIcon from "@mui/icons-material/Close";
import Cookies from "js-cookie";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControlLabel,
  IconButton,
  Slide,
  Switch,
} from "@mui/material";

const COOKIE_KEY = "madhuban_cookie_preferences";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CookiesPopup = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const cookiePref = Cookies.get(COOKIE_KEY);
    if (cookiePref) {
      try {
        const parsed = JSON.parse(cookiePref);
        setPreferences({
          necessary: true,
          analytics: !!parsed.analytics,
          marketing: !!parsed.marketing,
        });
      } catch (e) {
        // If parsing fails, show banner
        setShowBanner(true);
      }
    } else {
      // If no cookie preferences exist, show banner
      setTimeout(() => {
        setShowBanner(true);
      }, 10000);
    }
  }, []);

  useEffect(() => {
    if (!showBanner) setShowPreferences(false);
  }, [showBanner]);

  if (!showBanner) return null;
  const savePreferencesToCookie = (prefs) => {
    Cookies.set(COOKIE_KEY, JSON.stringify(prefs), {
      expires: 365,
      sameSite: "Lax",
    });
  };
  const handleAcceptAll = () => {
    const newPrefs = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(newPrefs);
    savePreferencesToCookie(newPrefs);
    setShowBanner(false);
  };

  const handleRejectNonEssential = () => {
    const newPrefs = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(newPrefs);
    savePreferencesToCookie(newPrefs);
    setShowBanner(false);
  };

  const handleManagePreferences = () => {
    setShowPreferences(true);
  };

  const handleSavePreferences = () => {
    setShowPreferences(false);
    savePreferencesToCookie(preferences);
    setShowBanner(false);
  };

  const handlePreferenceChange = (type) => (event) => {
    setPreferences((prev) => ({
      ...prev,
      [type]: event.target.checked,
    }));
  };

  return (
    <>
      <div className="fixed  bottom-5 md:bottom-5 left-0 right-0 mx-2  md:mx-5 lg:mx-12 z-30  ">
        <Box
          className="flex flex-col md:flex-row  gap-0.5 md:gap-2   items-center bg-primary-gray  rounded-t-xl rounded-xl md:rounded-full  "
          sx={{
            boxShadow: "0 0px 50px 4px #00000040",
          }}
        >
          <div className=" w-full px-2 m-2.5">
            <div className="flex flex-row gap-1.5 md:gap-2  items-center">
              <div className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] lg:w-[70px] lg:h-[70px] relative shrink-0">
                <Image
                  src="https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/logo/cookies.svg"
                  alt="logo"
                  fill
                />
              </div>
              <div className="text-base">
                <p className="text-sm md:text-lg">{`We use cookies to improve your experience. By continuing, you agree to our use of cookies`}</p>
              </div>
            </div>
          </div>
          <div className=" w-full px-1 md:px-5 my-1.5   ">
            <div className="flex flex-row gap-2 sm:gap-4 justify-center md:justify-end  items-center">
              <p className="dm_sans  responsive-text text-[#1A2E33] font-medium">
                <Link
                  onClick={handleManagePreferences}
                  href="/"
                  rel="noopener noreferrer"
                  className="flex flex-row items-center gap-1.5 hover:underline cursor-pointer underline text-[#1A2E33] whitespace-nowrap"
                >
                  {`Cookies Settings`}
                </Link>
              </p>
              <div className="flex sm:flex-row gap-2 sm:gap-5 text-xs md:text-lg">
                <button
                  onClick={handleAcceptAll}
                  height={{ xs: "40px", sm: "50px" }}
                  className=" px-4 py-2 rounded-md  font-semibold  text-[#D1C8C1] bg-[rgb(110,97,70)]  transition cursor-pointer"
                  type="submit"
                  color="#1A2E33"
                >
                  {`Accept All`}
                </button>
                <button
                  height={{ xs: "40px", sm: "50px" }}
                  onClick={handleRejectNonEssential}
                  className=" px-4 py-2 rounded-md  font-semibold  border border-[#6E6146]  transition cursor-pointer hover:text-[#D1C8C1] hover:bg-[#6E6146]"
                  type="submit"
                >
                  {`Reject All`}
                </button>
              </div>
            </div>
          </div>
        </Box>
      </div>

      <Dialog
        open={showPreferences}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setShowPreferences(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiPaper-root": {
            paddingTop: 2,
            position: "relative",
          },
        }}
      >
        <p className="dm_sans  responsive-text font-bold! ps-6 text-xl">
          {" "}
          {`Cookie Preferences`}{" "}
        </p>
        <IconButton
          aria-label="close"
          onClick={() => setShowPreferences(false)}
          className="text-gray-500"
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent className="pt-4">
          {/* Necessary Cookies */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <p className="dm_sans responsive-text font-bold! text-base">
                {" "}
                {`Necessary Cookies`}{" "}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-green-700 font-bold dm_sans text-[15px]">
                  {" "}
                  {` ✔ Always Active`}{" "}
                </p>
              </div>
            </div>
            <p className=" dm_sans text-[15px] text-[#1A2E33]">
              {`These are essential for the website to function properly (you can't turn these off).`}
            </p>
          </div>
          <Divider className="my-2" />
          {/* Analytics Cookies */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <p className="dm_sans responsive-text font-bold! text-base">
                {" "}
                {`Analytics Cookies`}{" "}
              </p>
              <FormControlLabel
                control={
                  <Switch
                    color="success"
                    checked={preferences.analytics}
                    onChange={handlePreferenceChange("analytics")}
                  />
                }
                label=""
                className="m-0!"
              />
            </div>
            <p className=" dm_sans text-[15px] text-[#1A2E33]">
              {` Help us understand how users interact with our site so we can improve the experience.`}
            </p>
          </div>
          <Divider className="my-2" />
          {/* Marketing Cookies */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <p className="dm_sans responsive-text font-bold! text-base">
                {" "}
                {`Marketing Cookies`}{" "}
              </p>
              <FormControlLabel
                control={
                  <Switch
                    color="success"
                    checked={preferences.marketing}
                    onChange={handlePreferenceChange("marketing")}
                  />
                }
                label=""
                className="m-0!"
              />
            </div>
            <p className=" dm_sans text-[15px] text-[#1A2E33]">
              {`Allow us to show you personalized ads and offers on platforms like Instagram, Google, and YouTube.`}
            </p>
          </div>
        </DialogContent>
        <DialogActions className="p-6 pt-2">
          <button
            onClick={handleSavePreferences}
            className="cursor-pointer mt-6 w-full py-3 text-center rounded-md font-semibold  text-[#D1C8C1] bg-[rgb(110,97,70)] hover:bg-[rgb(132,116,85)] transition primary-font-family"
          >
            Save My Preferences
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CookiesPopup;
