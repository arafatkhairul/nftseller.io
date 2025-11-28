import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-foreground text-background",
        secondary:
          "bg-muted text-foreground",
        destructive:
          "bg-red-500/10 text-red-700 dark:text-red-400",
        outline:
          "border border-border bg-background text-foreground",
        success:
          "bg-green-500/10 text-green-700 dark:text-green-400",
        warning:
          "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
        error:
          "bg-red-500/10 text-red-700 dark:text-red-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
