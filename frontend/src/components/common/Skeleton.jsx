import styles from './Skeleton.module.css';

export default function Skeleton({ width, height, variant = 'rectangular', className = '', style = {} }) {
  const inlineStyles = {
    ...(width && { width }),
    ...(height && { height }),
    ...style,
  };

  return (
    <div
      className={`${styles.skeleton} ${styles[variant]} ${className}`}
      style={inlineStyles}
    />
  );
}
