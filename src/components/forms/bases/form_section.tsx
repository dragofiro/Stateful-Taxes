// A titled group of fields inside a step.
import React, { type ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  description?: ReactNode;
  /** Short reference shown at the right of the title, for example the form line numbers. */
  tag?: string;
  children: ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, description, tag, children }) => {
  return (
    <section className="tf-section">
      <div className="tf-section-head">
        <div>
          <h2 className="tf-section-title">{title}</h2>
          {description && <p className="tf-section-desc">{description}</p>}
        </div>
        {tag && <span className="tf-section-tag">{tag}</span>}
      </div>
      <div className="tf-stack">{children}</div>
    </section>
  );
};
