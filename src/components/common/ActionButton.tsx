import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const ActionButton = styled(Button)`
  align-self: flex-end;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: none;

  svg {
    font-size: 0.8rem;
    margin-left: 8px;
  }
`;

export default ActionButton;