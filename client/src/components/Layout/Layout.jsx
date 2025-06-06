import React, { useContext, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Outlet } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import UserDetailContext from '../../context/UserDetails.js';
import { useMutation } from 'react-query';
import { createUser } from '../../utils/api.js';
import useFavourites from '../../hooks/useFavourites.jsx';
import useBookings from '../../hooks/useBookings.jsx';

const Layout = () => {
  useFavourites();
  useBookings();

  const { isAuthenticated, user, getAccessTokenSilently, loginWithRedirect } = useAuth0();
  const { setUserDetails } = useContext(UserDetailContext);

  const { mutate } = useMutation({
    mutationKey: [user?.email],
    mutationFn: (token) => createUser(user?.email, token),
  });

  useEffect(() => {
    const getTokenAndRegister = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: "https://full-stack-real-estate-eight.vercel.app",
            scope: "openid profile email",
          },
        });

        localStorage.setItem("access_token", token);
        setUserDetails((prev) => ({ ...prev, token }));
        mutate(token);
      } catch (error) {
        console.error("Error fetching token:", error);

        // 👉 If consent is required, redirect the user to login with consent prompt
        if (error.error === 'consent_required' || error.message.includes("Consent required")) {
          loginWithRedirect({
            authorizationParams: {
              audience: "https://full-stack-real-estate-eight.vercel.app",
              scope: "openid profile email",
            },
          });
        }
      }
    };

    if (isAuthenticated) getTokenAndRegister();
  }, [isAuthenticated]);

  return (
    <>
      <div style={{ background: "var(--black)", overflow: "hidden" }}>
        <Header />
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
