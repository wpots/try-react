import type { ImageProps, NextImageLikeProps } from "./index";

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
    const componentProps: NextImageLikeProps = {
      src: typeof src === "string" ? (src ?? "") : "",
      alt: alt ?? "",
      width: typeof width === "number" ? width : undefined,
      height: typeof height === "number" ? height : undefined,
      fill,
      className,
      sizes,
      priority,
      quality,
      style,
      ...props,
    };
    return <ImageComponent {...componentProps} />;
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
