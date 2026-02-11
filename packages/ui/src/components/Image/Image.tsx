import type { ImageProps } from "./index";

export function Image({
  nextImageComponent: NextImageComponent,
  src,
  alt,
  width,
  height,
  className,
  fill,
  sizes,
  priority,
  quality,
  style,
  ...props
}: ImageProps): React.JSX.Element {
  if (NextImageComponent) {
    return (
      <NextImageComponent
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        fill={fill}
        sizes={sizes}
        priority={priority}
        quality={quality}
        style={style}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      {...props}
    />
  );
}
