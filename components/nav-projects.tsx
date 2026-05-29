"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"

export function NavProjects({
  title = "undefine",
  projects,
}: {
  title?: string
  projects?: {
    name: string
    url: string
    icon: React.ReactNode
  }[]
}) {
  const { isMobile } = useSidebar()

  // ✅ if no data → render nothing
  if (!projects || projects.length === 0) {
    return null
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{title}</SidebarGroupLabel>

      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                {item.icon}
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>

            {/* ✅ dropdown ONLY if there is data */}

          </SidebarMenuItem>
        ))}

        {/* optional "More" item only if projects exist */}

      </SidebarMenu>
    </SidebarGroup>
  )
}