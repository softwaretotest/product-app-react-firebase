// Button.jsx
import React from "react";

type ButtonProps = {
  /** Button label/content */
  children: React.ReactNode;

  /** Click handler */
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Reusable UI button component.
 */
export function Button({ className = "", children, ...props }: ButtonProps) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}
// export function PrimaryButton(props) {
//   return <Button variant="primary" {...props} />;
// }

// export function DangerButton(props) {
//   return <Button variant="danger" {...props} />;
// }
