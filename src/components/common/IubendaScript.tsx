import { useEffect } from 'react';

interface IubendaScriptProps {
  loadPrivacyControls?: boolean;
  bannerPosition?: 'top' | 'bottom' | 'float-top-center' | 'float-bottom-center';
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonTextColor?: string;
}

const IubendaScript: React.FC<IubendaScriptProps> = ({ 
  loadPrivacyControls = true,
  bannerPosition = 'bottom',
  primaryColor = '#cb1618', // Il rosso del tuo tema
  backgroundColor = '#000000', // Nero
  textColor = '#ffffff', // Bianco
  buttonTextColor = '#ffffff' // Bianco
}) => {
  useEffect(() => {
    if (document.querySelector('script[src*="iubenda.js"]')) {
      return;
    }

    (window as any)._iub = (window as any)._iub || [];
    (window as any)._iub.csConfiguration = {
      "siteId": 3747896, // Il tuo site ID da Iubenda
      "cookiePolicyId": 97643926, // Il tuo policy ID
      "lang": "it",
      "storage": {
        "useSiteId": true
      },
      "banner": {
        "acceptButtonDisplay": true,
        "acceptButtonColor": primaryColor,
        "acceptButtonCaptionColor": buttonTextColor,
        "customizeButtonDisplay": true,
        "customizeButtonColor": backgroundColor,
        "customizeButtonCaptionColor": textColor,
        "rejectButtonDisplay": true,
        "rejectButtonColor": backgroundColor,
        "rejectButtonCaptionColor": textColor,
        "position": bannerPosition,
        "backgroundColor": backgroundColor,
        "textColor": textColor,
        "fontSize": "14px",
        "closeButtonRejects": true,
        "listPurposes": true,
        "showPurposesToggles": true,
        "customizeButtonCaption": "Personalizza",
        "acceptButtonCaption": "Accetta tutti",
        "rejectButtonCaption": "Rifiuta tutto"
      },
      "callback": {
        "onConsentGiven": function() {
        },
        "onConsentRejected": function() {
        }
      }
    };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://cs.iubenda.com/autoblocking/3747896.js';
    
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    }

    const policyScript = document.createElement('script');
    policyScript.type = 'text/javascript';
    policyScript.async = true;
    policyScript.src = 'https://cdn.iubenda.com/iubenda.js';
    
    setTimeout(() => {
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(policyScript, firstScript);
      }
    }, 100);

    if (loadPrivacyControls) {
      const controlsScript = document.createElement('script');
      controlsScript.type = 'text/javascript';
      controlsScript.async = true;
      controlsScript.src = 'https://embeds.iubenda.com/widgets/80d6a511-5025-458e-808b-1bb279c1d5aa.js';
      
      setTimeout(() => {
        if (firstScript && firstScript.parentNode) {
          firstScript.parentNode.insertBefore(controlsScript, firstScript);
        }
      }, 200);
    }

    const style = document.createElement('style');
    style.textContent = `
      #iubenda-cs-banner {
        font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1) !important;
        border-radius: 8px 8px 0 0 !important;
        z-index: 999999 !important;
      }

      /* Personalizzazione pulsanti */
      #iubenda-cs-banner .iubenda-cs-accept-btn {
        background-color: ${primaryColor} !important;
        color: ${buttonTextColor} !important;
        border: none !important;
        border-radius: 4px !important;
        font-weight: 600 !important;
        padding: 8px 16px !important;
        transition: all 0.2s ease !important;
      }

      #iubenda-cs-banner .iubenda-cs-accept-btn:hover {
        background-color: ${primaryColor}dd !important;
        transform: translateY(-1px) !important;
      }

      #iubenda-cs-banner .iubenda-cs-customize-btn,
      #iubenda-cs-banner .iubenda-cs-reject-btn {
        background-color: transparent !important;
        color: ${textColor} !important;
        border: 1px solid ${textColor}40 !important;
        border-radius: 4px !important;
        font-weight: 600 !important;
        padding: 8px 16px !important;
        transition: all 0.2s ease !important;
      }

      #iubenda-cs-banner .iubenda-cs-customize-btn:hover,
      #iubenda-cs-banner .iubenda-cs-reject-btn:hover {
        background-color: ${textColor}10 !important;
        border-color: ${textColor} !important;
      }

      @media (max-width: 768px) {
        #iubenda-cs-banner {
          border-radius: 0 !important;
        }
        
        #iubenda-cs-banner .iubenda-cs-container {
          padding: 16px !important;
        }

        #iubenda-cs-banner .iubenda-cs-content {
          font-size: 13px !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [loadPrivacyControls, bannerPosition, primaryColor, backgroundColor, textColor, buttonTextColor]);

  return null;
};

export default IubendaScript;