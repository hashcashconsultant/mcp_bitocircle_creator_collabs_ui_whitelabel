import React from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrandProvider } from '../context/BrandContext';
import theme from '../theme/theme';
import WHITELABEL from '../config/whitelabel';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>{`${WHITELABEL.productName} - ${WHITELABEL.brandName}`}</title>
        <meta name="description" content={WHITELABEL.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={WHITELABEL.favicon} />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrandProvider>
          <Component {...pageProps} />
        </BrandProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
