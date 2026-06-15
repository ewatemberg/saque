import type { ReactNode } from 'react'

export type IconName =
  | 'calendar'
  | 'cash'
  | 'users'
  | 'chart'
  | 'whatsapp'
  | 'bell'
  | 'user'
  | 'alert'
  | 'rain'
  | 'chevron-left'
  | 'chevron-right'
  | 'plus'
  | 'trash'
  | 'check'
  | 'edit'
  | 'download'
  | 'search'

const paths: Record<IconName, ReactNode> = {
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </>
  ),
  cash: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  users: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
  chart: (
    <>
      <path d="M4 4v16h16" />
      <path d="M7 14l3-3 3 2 4-5" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M4 20l1.4-4A8 8 0 1 1 8.5 18.6L4 20z" />
      <path d="M9 10c0 3 2 5 5 5" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16v-3a6 6 0 0 1 12 0v3l1.5 2h-15z" />
      <path d="M9.5 18a2.5 2.5 0 0 0 5 0" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4l9 16H3z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  rain: (
    <>
      <path d="M7 15a4 4 0 1 1 1-7.9A5 5 0 0 1 17.6 8.5 3.5 3.5 0 0 1 17 15z" />
      <path d="M8 18v2M12 18v2M16 18v2" />
    </>
  ),
  'chevron-left': <path d="M15 6l-6 6 6 6" />,
  'chevron-right': <path d="M9 6l6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: <path d="M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13" />,
  check: <path d="M5 12l5 5L20 7" />,
  edit: <path d="M4 20h4L18 10l-4-4L4 16zM13 7l4 4" />,
  download: <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
}

interface Props {
  name: IconName
  size?: number
  label?: string
}

export function Icon({ name, size = 20, label }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {paths[name]}
    </svg>
  )
}
