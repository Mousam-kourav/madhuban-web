import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent font-medium whitespace-nowrap transition-all duration-200 ease-out outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /** Earth-brown background, ivory text. Primary CTA. */
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        /** Warm-beige background, charcoal text. Secondary action. */
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        /** Earth-brown border and text, transparent background. */
        outline: "border-primary text-primary bg-transparent hover:bg-primary/10",
        /** No background. Subtle warm-beige hover fill. */
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
        /** Underline link style. No border or background. */
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        /** 48px tall — WCAG-compliant mobile tap target (CLAUDE.md §4). */
        default: "h-12 px-5 text-sm",
        lg: "h-14 px-6 text-base",
        icon: "size-12",
        "icon-sm": "size-9",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Brand-styled button built on @base-ui/react. Default height is 48px (WCAG tap target).
 *
 * @example
 * <Button>Book Now</Button>
 * <Button variant="outline" size="lg">Explore Rooms</Button>
 * <Button variant="secondary" size="sm">Learn More</Button>
 */
function Button({
  className,
  variant,
  size,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
