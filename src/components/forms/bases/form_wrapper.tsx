// Header and body of one step in a filing workflow.
import React, { type ReactNode } from 'react';

interface FormWrapperProps {
  title: string;
  /** Small line above the title, for example "Step 2 of 9 · IT-201". */
  eyebrow?: string;
  lede?: ReactNode;
  children: ReactNode;
}

export const FormWrapper: React.FC<FormWrapperProps> = ({ title, eyebrow, lede, children }) => {
  return (
    <article>
      <header>
        {eyebrow && <p className="tf-eyebrow">{eyebrow}</p>}
        <h1 className="tf-title" tabIndex={-1} data-step-title>
          {title}
        </h1>
        {lede && <p className="tf-lede">{lede}</p>}
      </header>
      <div className="tf-step-body">{children}</div>
    </article>
  );
};
