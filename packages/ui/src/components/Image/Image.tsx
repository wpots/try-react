import type { ImageProps } from "./index";

export function Image({
  component: ImageComponent,
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
  if (ImageComponent) {
    return (
      <ImageComponent
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
        {...props}
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
