import React from 'react'
import { type ProjectShowcase, sortedShowcase } from '@site/data/showcase'
import Marquee from '@site/src/components/magicui/marquee'
import { Section } from '../Section'

/**
 * Removes the protocol (http/https) from a URL string.
 * @param url - The URL to process. Can be a string, undefined, or null.
 * @returns The URL without the protocol, or an empty string if invalid.
 */
const removeHttp = (url: string | undefined | null): string => {
  if (!url || typeof url !== 'string') {
    return '' // Return an empty string if the URL is invalid or not a string
  }
  return url.replace(/(^\w+:|^)\/\//, '')
}

/**
 * Renders a single project card.
 * @param item - The project data of type ProjectShowcas.
 * @returns A JSX element representing the project card.
 */
const ProjectCard = ({ item }: { item: ProjectShowcase }) => (
  <div className="mx-2 h-full w-48 md:w-96">
    <a
      className="flex flex-col hover:no-underline"
      href={item.url}
      target="_blank"
      rel="noreferrer"
    >
      <img
        src={item.preview || ''}
        alt={item.title}
        className="h-[120px] w-full rounded-lg object-cover md:h-[240px]"
        loading="lazy"
      />
      <div className="w-full py-2 text-center">
        <h2 className="m-0 truncate text-xl font-normal">{item.title}</h2>
        <p className="m-0 truncate text-primary">{removeHttp(item.url)}</p>
      </div>
    </a>
  </div>
)

/**
 * Slider component for displaying a list of projects.
 * Handles cases where there are multiple projects (scrolling) or a single project (centered).
 * @param items - An array of project data of type `ProjectShowcase[]`.
 * @returns A JSX element representing the slider.
 */
const Slider = ({ items }: { items: ProjectShowcase[] }) => {
  // Handle the case where there is only one project
  if (items.length === 1) {
    return (
      <div className="flex justify-center">
        <ProjectCard item={items[0] as ProjectShowcase} />
      </div>
    )
  }

  // Handle the case where there are no projects
  if (items.length === 0) {
    return <div className="flex justify-center">No projects available</div>
  }

  // Default case: Multiple projects with scrolling
  return (
    <div className="relative flex min-h-[260px] items-center overflow-hidden">
      <Marquee pauseOnHover gradient className="[--duration:60s]">
        {items.map(item => (
          <ProjectCard key={item.title} item={item} />
        ))}
      </Marquee>
      {/* Gradient overlays for smoother edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-white dark:from-zinc-900"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-white dark:from-zinc-900"></div>
    </div>
  )
}

/**
 * ShowcaseSection component that displays a list of projects in a slider.
 * @returns A JSX element representing the project showcase section.
 */
export default function ShowcaseSection() {
  return (
    <Section
      title="Project Showcase"
      icon="ri:projector-line"
      href="/showcase"
    >
      <Slider items={sortedShowcase as ProjectShowcase[]} />
      {' '}
      {/* Use the sortedShowcase data */}
    </Section>
  )
}
