import * as React from "react"
import { type LucideIcon } from "lucide-react"
import { cn } from "#/lib/utils.ts"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title: string
  description?: string
}

export function EmptyState({
  className,
  icon: Icon,
  title,
  description,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 px-4 text-center bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 max-w-md mx-auto animate-in fade-in duration-300",
        className
      )}
      {...props}
    >
      {Icon && (
        <div className="bg-[#2b7fff]/10 p-4 rounded-full mb-4">
          <Icon className="h-8 w-8 text-[#2b7fff]" />
        </div>
      )}
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-zinc-400">
          {description}
        </p>
      )}
    </div>
  )
}
