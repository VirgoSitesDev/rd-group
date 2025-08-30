import React from 'react';
import styled from 'styled-components';

const IubendaLink = styled.a`
  color: ${({ theme }) => theme.colors.text.primary};
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
    text-decoration: underline;
  }

  &:visited {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const PrivacyPolicyLink: React.FC = () => {
  return (
    <IubendaLink
      href="https://www.iubenda.com/privacy-policy/97643926"
      className="iubenda-black iubenda-noiframe iubenda-embed iubenda-noiframe"
      title="Privacy Policy"
      target="_blank"
      rel="noopener noreferrer"
    >
      Privacy Policy
    </IubendaLink>
  );
};

export const CookiePolicyLink: React.FC = () => {
  return (
    <IubendaLink
      href="https://www.iubenda.com/privacy-policy/97643926/cookie-policy"
      className="iubenda-black iubenda-noiframe iubenda-embed iubenda-noiframe"
      title="Cookie Policy"
      target="_blank"
      rel="noopener noreferrer"
    >
      Cookie Policy
    </IubendaLink>
  );
};

export const IubendaLinks: React.FC = () => {
  return (
    <>
      <PrivacyPolicyLink />
      <CookiePolicyLink />
    </>
  );
};

export default IubendaLinks;