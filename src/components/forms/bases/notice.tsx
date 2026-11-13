// A short message block inside a step: a tip, or the list of problems that stop the filer from continuing.
import React, { type ReactNode } from 'react';

interface NoticeProps {
  title?: string;
  tone?: 'info' | 'error';
  children: ReactNode;
}

export const Notice: React.FC<NoticeProps> = ({ title, tone = 'info', children }) => (
  <div className={`tf-notice${tone === 'error' ? ' tf-notice--error' : ''}`} role={tone === 'error' ? 'alert' : undefined}>
    {title && <span className="tf-notice-title">{title}</span>}
    {children}
  </div>
);
