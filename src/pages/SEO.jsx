import { Helmet } from 'react-helmet-async';

function SEO({ title, description, path = '', noindex = false }) {
    const baseUrl = 'https://elias4864.github.io/Titocci-Metalcostruzioni-SAGL-Website-';

    // Generiert die saubere Kanonische URL (ohne UTM-Parameter für Suchmaschinen)
    const canonicalUrl = `${baseUrl}/#${path}`;

    return (
        <Helmet>
            {/* Basis-Titel & Meta-Tags */}
            <title>{title ? `${title} | Titocci Metalcostruzioni SAGL` : 'Titocci Metalcostruzioni SAGL'}</title>
            <meta name="description" content={description || 'Titocci Metalcostruzioni SAGL – Creazioni personalizzate e carpenteria metallica in Ticino.'} />

            {/* SEO Indexierung Steuerung */}
            <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Social Media */}
            <meta property="og:title" content={title || 'Titocci Metalcostruzioni SAGL'} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonicalUrl} />
        </Helmet>
    );
}

export default SEO;