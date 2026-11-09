/**
 * WHITE-LABEL CONTROL PANEL — set your brand in ONE place.
 *
 * The Creator Collabs marketplace (brands find creators, send offers, run collab campaigns and pay
 * through escrow) runs next to your white-label community app, on the same domain under
 * /creator-collabs (for example https://circle.paybito.com/creator-collabs). It reads the sign-in from
 * that app (cookies paybito_launch_platform_token / paybito_launch_platform_uuid), so a member who is
 * signed in on your community is signed in here too. Your Ad Center opens it with ?uuid=<member uuid>.
 *
 * THE GOLDEN RULE: change the look, not the wiring. Brand values below are free to change. The service
 * addresses at the end must stay as they are: the services keep your brands and creators on your own
 * platform because the browser sends your domain with every call.
 *
 * NOTE: this snapshot ships with the sample brand "Circle". Replace every brand value with your own.
 */

export const WHITELABEL = {
  // --- Identity -------------------------------------------------------------
  brandName: 'Circle',
  productName: 'Collabs Marketplace',
  description: 'Circle Collabs Marketplace - connect brands with creators.',

  // --- Your community app ---------------------------------------------------
  // The domain your community app runs on. This marketplace is served from the same domain.
  siteUrl: 'https://circle.paybito.com',
  // The path this marketplace is served from. Keep it in sync with basePath in next.config.js.
  basePath: '/creator-collabs',
  // Pages of your community app (and sibling apps on the same domain) this marketplace links to.
  communityLinks: {
    home: '/',
    wallet: '/bitodollar-wallet',
    adCenter: '/ad-center',
  },

  // --- Sign-in ---------------------------------------------------------------
  // Members sign in on your community app; this page of it is opened when nobody is signed in.
  signInPath: '/login',
  // Cookie domain used when clearing the sign-in cookies. Leave undefined to use the current host; set
  // it (for example '.example.com') only if your community app sets them that way.
  cookieDomain: undefined,

  // --- Look -----------------------------------------------------------------
  // Icons live in public/. Replace those files with your own (same names), or point these at new files.
  favicon: '/creator-collabs/favicon-32x32.png',
  // Mapped onto the MUI theme palette (src/theme/theme.js) and the header brand text.
  colors: {
    primary: { main: '#0d9488', light: '#2dd4bf', dark: '#0f766e' },
    secondary: { main: '#f97066', light: '#fda29b', dark: '#e04f45' },
    background: { default: '#0b1211', paper: '#121b1a' },
    text: { primary: '#f2f5f4', secondary: '#9aa8a5' },
  },

  // --- Services (do not change) ---------------------------------------------
  services: {
    monetize: 'https://institutional-bo.paybito.com:8443/MonetizeService',
    brokerAdminApi: 'https://institutional-bo.paybito.com:8443/BrokerAdminApi',
  },
};

/** A page of the community app this marketplace sits next to (same domain, so a plain path). */
export const communityUrl = (path = '/') => path;

/** The community app's sign-in page. */
export const signInUrl = () => communityUrl(WHITELABEL.signInPath);

/** Options for removing the sign-in cookies (host-only unless a cookie domain is set). */
export const cookieOptions = () => ({
  path: '/',
  ...(WHITELABEL.cookieDomain ? { domain: WHITELABEL.cookieDomain } : {}),
});

export default WHITELABEL;
